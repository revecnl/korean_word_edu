let leftData = [];
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
