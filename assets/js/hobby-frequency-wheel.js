const characters = [
  { name: "로라", emoji: "👩" },
  { name: "유키", emoji: "👘" },
  { name: "말릭", emoji: "👨🏾" },
  { name: "수진", emoji: "👩🏻" },
  { name: "치엔", emoji: "🧑🏻" },
  { name: "민수", emoji: "👦🏻" },
  { name: "수아", emoji: "👧🏻" },
  { name: "아르준", emoji: "👨🏽" }
];

const actions = [
  {
    base: "자전거를 타다",
    object: "자전거를",
    verb: "타요",
    negativeVerb: "안 타요",
    emoji: "🚲",
    image: ""
  },
  {
    base: "피아노를 치다",
    object: "피아노를",
    verb: "쳐요",
    negativeVerb: "안 쳐요",
    emoji: "🎹",
    image: ""
  },
  {
    base: "수영을 하다",
    object: "수영을",
    verb: "해요",
    negativeVerb: "안 해요",
    emoji: "🏊",
    image: ""
  },
  {
    base: "배드민턴을 치다",
    object: "배드민턴을",
    verb: "쳐요",
    negativeVerb: "안 쳐요",
    emoji: "🏸",
    image: ""
  },
  {
    base: "게임을 하다",
    object: "게임을",
    verb: "해요",
    negativeVerb: "안 해요",
    emoji: "🎮",
    image: ""
  },
  {
    base: "그림을 그리다",
    object: "그림을",
    verb: "그려요",
    negativeVerb: "안 그려요",
    emoji: "🎨",
    image: ""
  },
  {
    base: "축구를 하다",
    object: "축구를",
    verb: "해요",
    negativeVerb: "안 해요",
    emoji: "⚽",
    image: ""
  },
  {
    base: "책을 읽다",
    object: "책을",
    verb: "읽어요",
    negativeVerb: "안 읽어요",
    emoji: "📚",
    image: ""
  },
  {
    base: "노래를 부르다",
    object: "노래를",
    verb: "불러요",
    negativeVerb: "안 불러요",
    emoji: "🎤",
    image: ""
  },
  {
    base: "보드게임을 하다",
    object: "보드게임을",
    verb: "해요",
    negativeVerb: "안 해요",
    emoji: "🎲",
    image: ""
  },
  {
    base: "식물을 키우다",
    object: "식물을",
    verb: "키워요",
    negativeVerb: "안 키워요",
    emoji: "🪴",
    image: ""
  }
];

const frequencies = [
  { label: "항상", type: "positive" },
  { label: "자주", type: "positive" },
  { label: "가끔", type: "positive" },
  { label: "별로", type: "negative" },
  { label: "거의", type: "negative" },
  { label: "전혀", type: "negative" }
];

const positiveReasons = [
  "재미있어요.",
  "좋아해요.",
  "건강에 좋아요.",
  "기분이 좋아져요.",
  "스트레스가 풀려요."
];

const negativeReasons = [
  "시간이 없어요.",
  "어려워요.",
  "피곤해요.",
  "잘 못해요.",
  "별로 안 좋아해요."
];

/*
  캐릭터 + 행동 조합 이미지가 있으면 여기에 넣으면 됩니다.

  예:
  "유키|피아노를 치다": "./assets/img/yuki_piano.png"

  우선순위:
  1. comboImages의 캐릭터+행동 조합 이미지
  2. actions 안의 action.image
  3. 이모지 카드
*/
const comboImages = {
  // "유키|피아노를 치다": "./assets/img/yuki_piano.png",
  // "말릭|자전거를 타다": "./assets/img/malik_bicycle.png",
  // "수진|게임을 하다": "./assets/img/sujin_game.png"
};

const $ = (selector) => document.querySelector(selector);

const nameWheel = $("#nameWheel");
const actionWheel = $("#actionWheel");
const frequencyWheel = $("#frequencyWheel");

const spinBtn = $("#spinBtn");
const hideSentenceBtn = $("#hideSentenceBtn");
const reasonModeBtn = $("#reasonModeBtn");
const resetBtn = $("#resetBtn");

const chipName = $("#chipName");
const chipAction = $("#chipAction");
const chipFrequency = $("#chipFrequency");

const visual = $("#visual");
const resultImage = $("#resultImage");
const emojiArt = $("#emojiArt");
const fallbackTitle = $("#fallbackTitle");
const fallbackDesc = $("#fallbackDesc");

const sentenceEl = $("#sentence");
const hint = $("#hint");
const reasonPanel = $("#reasonPanel");
const reasonCards = $("#reasonCards");
const finalSentence = $("#finalSentence");
const historyList = $("#historyList");

let current = {
  character: null,
  action: null,
  frequency: null,
  sentence: ""
};

let sentenceHidden = false;
let reasonMode = true;
let history = [];

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function makeSentence(character, action, frequency) {
  const verbPart =
    frequency.type === "negative"
      ? action.negativeVerb
      : action.verb;

  return `${character.name} 씨는 ${action.object} ${frequency.label} ${verbPart}.`;
}

function getImagePath(character, action) {
  const comboKey = `${character.name}|${action.base}`;
  return comboImages[comboKey] || action.image || "";
}

function updateWheelScreens(character, action, frequency) {
  nameWheel.textContent = character ? character.name : "?";
  actionWheel.textContent = action ? action.base : "?";
  frequencyWheel.textContent = frequency ? frequency.label : "?";
}

function updateResult() {
  const { character, action, frequency, sentence } = current;

  if (!character || !action || !frequency) {
    chipName.textContent = "?";
    chipAction.textContent = "?";
    chipFrequency.textContent = "?";

    sentenceEl.textContent = "아직 문장이 없어요.";
    sentenceEl.classList.remove("hidden");

    hint.className = "hint";
    hint.textContent = "";

    finalSentence.textContent = "이유를 고르면 최종 문장이 나와요.";

    renderReasonCards([]);
    renderFallback();
    return;
  }

  chipName.textContent = character.name;
  chipAction.textContent = action.base;
  chipFrequency.textContent = frequency.label;

  if (sentenceHidden) {
    sentenceEl.textContent = "학생이 먼저 말해 보세요.";
    sentenceEl.classList.add("hidden");
  } else {
    sentenceEl.textContent = sentence;
    sentenceEl.classList.remove("hidden");
  }

  if (frequency.type === "negative") {
    hint.className = "hint negative";
    hint.innerHTML = `규칙: <b>${frequency.label} + 안</b><br />예: ${frequency.label} ${action.negativeVerb}`;
  } else {
    hint.className = "hint positive";
    hint.innerHTML = `규칙: <b>${frequency.label}</b>은 그대로 사용해요.<br />예: ${frequency.label} ${action.verb}`;
  }

  renderVisual(character, action);
  renderReasonCards(frequency.type === "negative" ? negativeReasons : positiveReasons);
  finalSentence.textContent = "이유를 고르면 최종 문장이 나와요.";
}

function renderVisual(character, action) {
  const imagePath = getImagePath(character, action);

  emojiArt.textContent = action.emoji;
  fallbackTitle.textContent = `${character.name} 씨`;
  fallbackDesc.textContent = action.base;

  visual.classList.remove("has-image");
  resultImage.removeAttribute("src");
  resultImage.alt = `${character.name} 씨가 ${action.base.replace("다", "는")} 모습`;

  if (!imagePath) return;

  resultImage.onload = () => {
    visual.classList.add("has-image");
  };

  resultImage.onerror = () => {
    visual.classList.remove("has-image");
    resultImage.removeAttribute("src");
  };

  resultImage.src = imagePath;
}

function renderFallback() {
  visual.classList.remove("has-image");
  resultImage.removeAttribute("src");

  emojiArt.textContent = "🎲";
  fallbackTitle.textContent = "돌림판을 돌려 보세요";
  fallbackDesc.textContent = "결과 이미지가 여기에 표시됩니다";
}

function renderReasonCards(reasons) {
  reasonCards.innerHTML = "";

  if (!reasonMode) {
    reasonPanel.style.display = "none";
    return;
  }

  reasonPanel.style.display = "block";

  if (!reasons.length) {
    reasonCards.innerHTML = `<div class="empty">돌림판을 먼저 돌려 주세요.</div>`;
    return;
  }

  reasons.forEach((reason) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "reason-card";
    button.textContent = reason;

    button.addEventListener("click", () => {
      document
        .querySelectorAll(".reason-card")
        .forEach((card) => card.classList.remove("selected"));

      button.classList.add("selected");

      const full = `${current.sentence} ${reason}`;
      finalSentence.textContent = full;
      addHistory(full);
    });

    reasonCards.appendChild(button);
  });
}

function addHistory(text) {
  if (!text) return;

  history = [text, ...history.filter((item) => item !== text)].slice(0, 8);
  renderHistory();
}

function renderHistory() {
  if (!history.length) {
    historyList.innerHTML = `<div class="empty">아직 기록이 없어요.</div>`;
    return;
  }

  historyList.innerHTML = history
    .map((item) => `<div class="history-item">${item}</div>`)
    .join("");
}

function spinOne(element, list, getLabel, duration, finalValue) {
  return new Promise((resolve) => {
    element.classList.add("spinning");

    const startTime = Date.now();
    const interval = setInterval(() => {
      element.textContent = getLabel(randomItem(list));

      const elapsed = Date.now() - startTime;
      if (elapsed >= duration) {
        clearInterval(interval);
        element.textContent = getLabel(finalValue);
        element.classList.remove("spinning");
        resolve();
      }
    }, 70);
  });
}

async function spinAll() {
  spinBtn.disabled = true;
  finalSentence.textContent = "이유를 고르면 최종 문장이 나와요.";

  const character = randomItem(characters);
  const action = randomItem(actions);
  const frequency = randomItem(frequencies);

  current = {
    character,
    action,
    frequency,
    sentence: makeSentence(character, action, frequency)
  };

  await Promise.all([
    spinOne(nameWheel, characters, (item) => item.name, 700, character),
    spinOne(actionWheel, actions, (item) => item.base, 950, action),
    spinOne(frequencyWheel, frequencies, (item) => item.label, 1150, frequency)
  ]);

  updateResult();
  addHistory(current.sentence);
  spinBtn.disabled = false;
}

function toggleSentence() {
  sentenceHidden = !sentenceHidden;
  hideSentenceBtn.textContent = sentenceHidden ? "문장 보기" : "문장 숨기기";
  updateResult();
}

function toggleReasonMode() {
  reasonMode = !reasonMode;
  reasonModeBtn.textContent = reasonMode ? "이유 모드: 켜짐" : "이유 모드: 꺼짐";
  updateResult();
}

function resetAll() {
  current = {
    character: null,
    action: null,
    frequency: null,
    sentence: ""
  };

  updateWheelScreens(null, null, null);
  updateResult();
}

spinBtn.addEventListener("click", spinAll);
hideSentenceBtn.addEventListener("click", toggleSentence);
reasonModeBtn.addEventListener("click", toggleReasonMode);
resetBtn.addEventListener("click", resetAll);

updateResult();
