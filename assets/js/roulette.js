let leftData = [];
let rightData = [];
let customPresets = [];
let statusTimer = null;

const slotHeight = 80;

const leftList = document.getElementById("leftList");
const rightList = document.getElementById("rightList");
const leftWordsInput = document.getElementById("leftWordsInput");
const rightWordsInput = document.getElementById("rightWordsInput");
const sentenceBox = document.getElementById("sentenceBox");
const statusBar = document.getElementById("statusBar");
const presetButtons = document.getElementById("presetButtons");
const customPresetButtons = document.getElementById("customPresetButtons");
const customPresetName = document.getElementById("customPresetName");
const customPresetTarget = document.getElementById("customPresetTarget");
const customPresetWords = document.getElementById("customPresetWords");
const leftSpinButton = document.getElementById("leftSpinButton");
const rightSpinButton = document.getElementById("rightSpinButton");
const updateWordsButton = document.getElementById("updateWordsButton");
const saveStateButton = document.getElementById("saveStateButton");
const resetButton = document.getElementById("resetButton");
const saveCustomPresetButton = document.getElementById("saveCustomPresetButton");

function parseWords(text) {
  return String(text || "")
    .split(",")
    .map((word) => word.trim())
    .filter((word) => word !== "");
}

function safeParse(text, fallback) {
  try {
    return JSON.parse(text);
  } catch (error) {
    return fallback;
  }
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function showStatus(message, type = "info") {
  const colorMap = {
    info: "#2c3e50",
    success: "#16a34a",
    error: "#dc2626"
  };

  statusBar.textContent = message;
  statusBar.style.color = colorMap[type] || colorMap.info;

  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => {
    statusBar.textContent = "";
  }, 2200);
}

function renderSlot(element, data) {
  let html = "";

  for (let i = 0; i < 15; i += 1) {
    data.forEach((word) => {
      html += `<li class="slot-item">${escapeHtml(word)}</li>`;
    });
  }

  element.innerHTML = html;
}

function resetPosition(element) {
  element.style.transition = "none";
  element.style.transform = "translateY(0)";
}

function updateWords(showMessage = true) {
  leftData = parseWords(leftWordsInput.value);
  rightData = parseWords(rightWordsInput.value);

  if (leftData.length === 0 || rightData.length === 0) {
    showStatus("왼쪽과 오른쪽 단어를 모두 입력해 주세요.", "error");
    return;
  }

  renderSlot(leftList, leftData);
  renderSlot(rightList, rightData);
  resetPosition(leftList);
  resetPosition(rightList);

  if (showMessage) {
    showStatus("단어가 업데이트되었습니다.", "success");
  }
}

function spin(side, buttonElement) {
  const listElement = side === "left" ? leftList : rightList;
  const data = side === "left" ? leftData : rightData;

  if (!data.length) {
    showStatus("먼저 단어를 업데이트해 주세요.", "error");
    return;
  }

  buttonElement.disabled = true;
  listElement.style.transition = "none";
  listElement.style.transform = "translateY(0)";
  listElement.offsetHeight;

  const randomIndex = Math.floor(Math.random() * data.length);
  const moveY = ((data.length * 8) + randomIndex) * slotHeight;

  listElement.style.transition = "transform 2s cubic-bezier(0.15, 0, 0.15, 1)";
  listElement.style.transform = `translateY(-${moveY}px)`;

  window.setTimeout(() => {
    buttonElement.disabled = false;
  }, 2000);
}

function renderBuiltInPresets() {
  presetButtons.innerHTML = "";

  Object.entries(ROULETTE_BUILTIN_PRESETS).forEach(([name, words]) => {
    const button = document.createElement("button");
    button.className = "preset-btn";
    button.textContent = `${name} 복사`;
    button.title = words;
    button.addEventListener("click", () => {
      copyPreset(words, `${name} 프리셋이 복사되었습니다.`);
    });
    presetButtons.appendChild(button);
  });
}

async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (error) {
    // fallback below
  }

  try {
    const temp = document.createElement("textarea");
    temp.value = text;
    temp.style.position = "fixed";
    temp.style.left = "-9999px";
    document.body.appendChild(temp);
    temp.focus();
    temp.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(temp);
    return ok;
  } catch (error) {
    return false;
  }
}

async function copyPreset(words, message = "복사되었습니다.") {
  const ok = await copyText(words);

  if (ok) {
    showStatus(message, "success");
  } else {
    showStatus("복사에 실패했습니다. 직접 선택해 복사해 주세요.", "error");
  }
}

function persistCustomPresets() {
  localStorage.setItem(ROULETTE_STORAGE_KEYS.customPresets, JSON.stringify(customPresets));
}

function loadCustomPresets() {
  const saved = localStorage.getItem(ROULETTE_STORAGE_KEYS.customPresets);
  customPresets = saved ? safeParse(saved, []) : [];

  if (!Array.isArray(customPresets)) {
    customPresets = [];
  }
}

function renderCustomPresets() {
  customPresetButtons.innerHTML = "";

  if (customPresets.length === 0) {
    const emptyText = document.createElement("span");
    emptyText.className = "empty-text";
    emptyText.textContent = "저장된 커스텀 프리셋이 없습니다.";
    customPresetButtons.appendChild(emptyText);
    return;
  }

  customPresets.forEach((preset) => {
    const card = document.createElement("div");
    card.className = "custom-card";
    card.title = `${preset.name}: ${preset.words}`;

    const label = document.createElement("span");
    const targetLabelMap = { both: "공용", left: "왼쪽", right: "오른쪽" };
    label.textContent = `${preset.name} (${targetLabelMap[preset.target] || "공용"})`;
    card.appendChild(label);

    const copyBtn = document.createElement("button");
    copyBtn.className = "mini-btn";
    copyBtn.textContent = "복사";
    copyBtn.addEventListener("click", () => {
      copyPreset(preset.words, `${preset.name} 프리셋이 복사되었습니다.`);
    });
    card.appendChild(copyBtn);

    const applyLeftBtn = document.createElement("button");
    applyLeftBtn.className = "mini-btn";
    applyLeftBtn.textContent = "왼쪽 적용";
    applyLeftBtn.addEventListener("click", () => {
      applyPresetToInput(preset.words, "left");
    });
    card.appendChild(applyLeftBtn);

    const applyRightBtn = document.createElement("button");
    applyRightBtn.className = "mini-btn";
    applyRightBtn.textContent = "오른쪽 적용";
    applyRightBtn.addEventListener("click", () => {
      applyPresetToInput(preset.words, "right");
    });
    card.appendChild(applyRightBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "mini-btn delete-btn";
    deleteBtn.textContent = "삭제";
    deleteBtn.addEventListener("click", () => {
      deleteCustomPreset(preset.id);
    });
    card.appendChild(deleteBtn);

    customPresetButtons.appendChild(card);
  });
}

function saveCustomPreset() {
  const name = customPresetName.value.trim();
  const target = customPresetTarget.value;
  const wordsText = customPresetWords.value.trim();
  const wordsArray = parseWords(wordsText);

  if (!name) {
    showStatus("커스텀 프리셋 이름을 입력해 주세요.", "error");
    return;
  }

  if (wordsArray.length === 0) {
    showStatus("커스텀 프리셋 단어를 입력해 주세요.", "error");
    return;
  }

  const preset = {
    id: Date.now().toString(),
    name,
    target,
    words: wordsArray.join(", ")
  };

  customPresets.push(preset);
  persistCustomPresets();
  renderCustomPresets();

  customPresetName.value = "";
  customPresetWords.value = "";
  customPresetTarget.value = "both";

  showStatus("커스텀 프리셋이 저장되었습니다.", "success");
}

function applyPresetToInput(words, side) {
  if (side === "left") {
    leftWordsInput.value = words;
  } else {
    rightWordsInput.value = words;
  }

  updateWords(false);
  showStatus(`${side === "left" ? "왼쪽" : "오른쪽"} 입력칸에 적용되었습니다.`, "success");
}

function deleteCustomPreset(id) {
  customPresets = customPresets.filter((preset) => preset.id !== id);
  persistCustomPresets();
  renderCustomPresets();
  showStatus("커스텀 프리셋이 삭제되었습니다.", "success");
}

function saveCurrentState() {
  const state = {
    leftInput: leftWordsInput.value,
    rightInput: rightWordsInput.value,
    sentence: sentenceBox.value
  };

  localStorage.setItem(ROULETTE_STORAGE_KEYS.state, JSON.stringify(state));
  showStatus("현재 상태가 브라우저에 저장되었습니다.", "success");
}

function loadSavedState() {
  const saved = localStorage.getItem(ROULETTE_STORAGE_KEYS.state);
  const state = saved ? safeParse(saved, ROULETTE_DEFAULT_STATE) : ROULETTE_DEFAULT_STATE;

  leftWordsInput.value = state.leftInput || ROULETTE_DEFAULT_STATE.leftInput;
  rightWordsInput.value = state.rightInput || ROULETTE_DEFAULT_STATE.rightInput;
  sentenceBox.value = state.sentence || "";
}

function resetAll() {
  const shouldReset = window.confirm("현재 입력값, 저장된 상태, 커스텀 프리셋을 모두 초기화할까요?");
  if (!shouldReset) return;

  localStorage.removeItem(ROULETTE_STORAGE_KEYS.state);
  localStorage.removeItem(ROULETTE_STORAGE_KEYS.customPresets);
  customPresets = [];

  leftWordsInput.value = ROULETTE_DEFAULT_STATE.leftInput;
  rightWordsInput.value = ROULETTE_DEFAULT_STATE.rightInput;
  sentenceBox.value = "";
  customPresetName.value = "";
  customPresetWords.value = "";
  customPresetTarget.value = "both";

  renderCustomPresets();
  updateWords(false);
  showStatus("초기화되었습니다.", "success");
}

function bindEvents() {
  leftSpinButton.addEventListener("click", () => {
    spin("left", leftSpinButton);
  });

  rightSpinButton.addEventListener("click", () => {
    spin("right", rightSpinButton);
  });

  updateWordsButton.addEventListener("click", () => {
    updateWords(true);
  });

  saveStateButton.addEventListener("click", saveCurrentState);
  resetButton.addEventListener("click", resetAll);
  saveCustomPresetButton.addEventListener("click", saveCustomPreset);
}

function init() {
  loadSavedState();
  loadCustomPresets();
  renderBuiltInPresets();
  renderCustomPresets();
  updateWords(false);
  bindEvents();
}

document.addEventListener("DOMContentLoaded", init);
