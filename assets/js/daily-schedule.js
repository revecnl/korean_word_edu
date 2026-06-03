const LEVELS = {
  1: {
    title: "Level 1. 몇 시",
    hint: "정각 일정을 보고 맞는 시간을 골라요.",
    mode: "hour",
    schedule: [
      item("07:00", "아침 식사", "아침 식사를 해요", "아침 식사는 몇 시에 해요?"),
      item("08:00", "학교에 가요", "학교에 가요", "학교에 몇 시에 가요?"),
      item("12:00", "점심 식사", "점심 식사를 해요", "점심 식사는 몇 시에 해요?"),
      item("18:00", "집에 가요", "집에 가요", "집에 몇 시에 가요?"),
      item("19:00", "저녁 식사", "저녁 식사를 해요", "저녁 식사는 몇 시에 해요?"),
      item("23:00", "잠을 자요", "잠을 자요", "몇 시에 잠을 자요?")
    ]
  },
  2: {
    title: "Level 2. 몇 시 몇 분",
    hint: "분까지 확인하고 알맞은 시간을 골라요.",
    mode: "minute",
    schedule: [
      item("07:30", "아침 식사", "아침 식사를 해요", "아침 식사는 몇 시 몇 분에 해요?"),
      item("08:20", "회사에 가요", "회사에 가요", "회사에 몇 시 몇 분에 가요?"),
      item("10:40", "회의", "회의가 있어요", "회의는 몇 시 몇 분에 있어요?"),
      item("12:10", "점심 식사", "점심 식사를 해요", "점심 식사는 몇 시 몇 분에 해요?"),
      item("18:30", "집에 가요", "집에 가요", "집에 몇 시 몇 분에 가요?"),
      item("19:15", "저녁 식사", "저녁 식사를 해요", "저녁 식사는 몇 시 몇 분에 해요?"),
      item("23:50", "잠을 자요", "잠을 자요", "몇 시 몇 분에 잠을 자요?")
    ]
  },
  3: {
    title: "Level 3. 오전 / 오후",
    hint: "오전과 오후를 구분해서 골라요.",
    mode: "ampm",
    schedule: [
      item("07:30", "아침 식사", "아침 식사를 해요", "아침 식사는 언제 해요?"),
      item("08:20", "회사에 가요", "회사에 가요", "회사에 언제 가요?"),
      item("10:40", "회의", "회의가 있어요", "회의는 언제 있어요?"),
      item("12:10", "점심 식사", "점심 식사를 해요", "점심 식사는 언제 해요?"),
      item("18:30", "집에 가요", "집에 가요", "집에 언제 가요?"),
      item("19:15", "저녁 식사", "저녁 식사를 해요", "저녁 식사는 언제 해요?"),
      item("23:50", "잠을 자요", "잠을 자요", "언제 잠을 자요?")
    ]
  },
  4: {
    title: "Level 4. 시간 → 일정",
    hint: "시간을 보고 맞는 일정을 골라요.",
    mode: "ampm",
    schedule: [
      item("07:30", "아침 식사", "아침 식사를 해요"),
      item("08:20", "학교에 가요", "학교에 가요"),
      item("09:10", "수업", "수업이 있어요"),
      item("12:10", "점심 식사", "점심 식사를 해요"),
      item("15:30", "친구를 만나요", "친구를 만나요"),
      item("18:30", "집에 가요", "집에 가요"),
      item("19:15", "저녁 식사", "저녁 식사를 해요"),
      item("22:40", "잠을 자요", "잠을 자요")
    ]
  }
};

const CUSTOM_ACTIVITIES = [
  item("", "아침 식사", "아침 식사를 해요"),
  item("", "학교에 가요", "학교에 가요"),
  item("", "회사에 가요", "회사에 가요"),
  item("", "수업", "수업이 있어요"),
  item("", "회의", "회의가 있어요"),
  item("", "점심 식사", "점심 식사를 해요"),
  item("", "친구를 만나요", "친구를 만나요"),
  item("", "운동해요", "운동해요"),
  item("", "집에 가요", "집에 가요"),
  item("", "저녁 식사", "저녁 식사를 해요"),
  item("", "숙제해요", "숙제해요"),
  item("", "잠을 자요", "잠을 자요")
];

const CUSTOM_TIMES = ["07:00", "07:30", "08:00", "08:30", "09:00", "10:30", "12:00", "13:30", "15:00", "18:30", "19:00", "23:00"];
const SAMPLE_MY_SCHEDULE = [
  item("07:30", "아침 식사", "아침 식사를 해요"),
  item("08:30", "학교에 가요", "학교에 가요"),
  item("12:00", "점심 식사", "점심 식사를 해요"),
  item("15:00", "친구를 만나요", "친구를 만나요"),
  item("18:30", "집에 가요", "집에 가요"),
  item("19:00", "저녁 식사", "저녁 식사를 해요"),
  item("23:00", "잠을 자요", "잠을 자요")
];

const MAX_ROUND = 10;
let currentLevel = 1;
let currentSchedule = [...LEVELS[1].schedule];
let currentQuestion = null;
let score = 0;
let round = 1;
let answered = false;
let selectedActivity = null;
let mySchedule = [];

const els = {
  levelButtons: document.querySelectorAll(".level-btn"),
  levelTitle: document.querySelector("#levelTitle"),
  scoreText: document.querySelector("#scoreText"),
  roundText: document.querySelector("#roundText"),
  scheduleBody: document.querySelector("#scheduleBody"),
  questionText: document.querySelector("#questionText"),
  answerOptions: document.querySelector("#answerOptions"),
  feedbackBox: document.querySelector("#feedbackBox"),
  nextBtn: document.querySelector("#nextBtn"),
  restartBtn: document.querySelector("#restartBtn"),
  shuffleBtn: document.querySelector("#shuffleBtn"),
  levelHint: document.querySelector("#levelHint"),
  quizArea: document.querySelector("#quizArea"),
  makerArea: document.querySelector("#makerArea"),
  activityCards: document.querySelector("#activityCards"),
  timeCards: document.querySelector("#timeCards"),
  myScheduleBody: document.querySelector("#myScheduleBody"),
  sentenceBox: document.querySelector("#sentenceBox"),
  makeSentencesBtn: document.querySelector("#makeSentencesBtn"),
  clearMyScheduleBtn: document.querySelector("#clearMyScheduleBtn"),
  loadSampleBtn: document.querySelector("#loadSampleBtn")
};

init();

function init() {
  els.levelButtons.forEach((button) => {
    button.addEventListener("click", () => changeLevel(Number(button.dataset.level)));
  });
  els.nextBtn.addEventListener("click", nextQuestion);
  els.restartBtn.addEventListener("click", restartQuiz);
  els.shuffleBtn.addEventListener("click", shuffleSchedule);
  els.makeSentencesBtn.addEventListener("click", renderSentences);
  els.clearMyScheduleBtn.addEventListener("click", clearMySchedule);
  els.loadSampleBtn.addEventListener("click", loadSampleSchedule);

  renderMakerCards();
  changeLevel(1);
}

function item(time, label, sentence, question = "") {
  return { time, label, sentence, question };
}

function changeLevel(level) {
  currentLevel = level;
  els.levelButtons.forEach((button) => {
    button.classList.toggle("is-active", Number(button.dataset.level) === level);
  });

  if (level === 5) {
    els.quizArea.classList.add("is-hidden");
    els.makerArea.classList.remove("is-hidden");
    els.levelTitle.textContent = "Level 5. 내 일정 만들기";
    els.scoreText.textContent = "-";
    els.roundText.textContent = "-";
    renderMySchedule();
    return;
  }

  els.quizArea.classList.remove("is-hidden");
  els.makerArea.classList.add("is-hidden");
  currentSchedule = [...LEVELS[level].schedule];
  restartQuiz();
}

function restartQuiz() {
  if (currentLevel === 5) return;
  score = 0;
  round = 1;
  answered = false;
  els.levelTitle.textContent = LEVELS[currentLevel].title;
  els.levelHint.textContent = LEVELS[currentLevel].hint;
  els.nextBtn.disabled = true;
  updateStatus();
  renderSchedule();
  makeQuestion();
}

function shuffleSchedule() {
  if (currentLevel === 5) return;
  currentSchedule = shuffle([...LEVELS[currentLevel].schedule]);
  renderSchedule();
  makeQuestion();
}

function renderSchedule() {
  const mode = LEVELS[currentLevel].mode;
  const rows = [...currentSchedule].sort((a, b) => toMinutes(a.time) - toMinutes(b.time));
  els.scheduleBody.innerHTML = rows.map((entry) => `
    <tr>
      <td>${formatTime(entry.time, mode, true)}</td>
      <td>${entry.label}</td>
    </tr>
  `).join("");
}

function makeQuestion() {
  answered = false;
  els.nextBtn.disabled = true;
  els.feedbackBox.className = "feedback-box";
  els.feedbackBox.textContent = "정답을 골라 보세요.";

  const mode = LEVELS[currentLevel].mode;
  const target = pick(currentSchedule);

  if (currentLevel === 4) {
    currentQuestion = {
      target,
      answer: target.sentence,
      feedback: `${formatTime(target.time, mode)}에 ${target.sentence}.`,
      options: makeOptions(target.sentence, currentSchedule.map((entry) => entry.sentence), 4)
    };
    els.questionText.textContent = `${formatTime(target.time, mode)}에 무엇을 해요?`;
  } else {
    currentQuestion = {
      target,
      answer: formatTime(target.time, mode),
      feedback: `${target.sentence.replace("해요", "해요")} ${formatTime(target.time, mode)}에 해요.`,
      options: makeOptions(formatTime(target.time, mode), currentSchedule.map((entry) => formatTime(entry.time, mode)), 4)
    };
    els.questionText.textContent = target.question;
  }

  renderOptions(currentQuestion.options);
}

function renderOptions(options) {
  els.answerOptions.innerHTML = options.map((option) => `
    <button class="answer-btn" type="button" data-answer="${escapeAttr(option)}">${option}</button>
  `).join("");

  els.answerOptions.querySelectorAll(".answer-btn").forEach((button) => {
    button.addEventListener("click", () => checkAnswer(button));
  });
}

function checkAnswer(button) {
  if (answered) return;
  answered = true;
  const selected = button.dataset.answer;
  const correct = selected === currentQuestion.answer;
  const answerButtons = els.answerOptions.querySelectorAll(".answer-btn");

  answerButtons.forEach((btn) => {
    btn.disabled = true;
    if (btn.dataset.answer === currentQuestion.answer) btn.classList.add("is-correct");
  });

  if (correct) {
    score += 10;
    button.classList.add("is-correct");
    els.feedbackBox.className = "feedback-box correct";
    els.feedbackBox.textContent = makeCorrectFeedback(currentQuestion.target);
  } else {
    button.classList.add("is-wrong");
    els.feedbackBox.className = "feedback-box wrong";
    els.feedbackBox.textContent = makeWrongFeedback(currentQuestion.target);
  }

  updateStatus();
  els.nextBtn.disabled = false;
}

function nextQuestion() {
  if (!answered) return;

  if (round >= MAX_ROUND) {
    showResult();
    return;
  }

  round += 1;
  updateStatus();
  makeQuestion();
}

function showResult() {
  els.questionText.textContent = "끝! 오늘의 일정 말하기 연습이 끝났어요.";
  els.answerOptions.innerHTML = "";
  els.feedbackBox.className = "feedback-box correct";
  els.feedbackBox.textContent = `최종 점수는 ${score}점이에요. 다시 하려면 '처음부터'를 눌러요.`;
  els.nextBtn.disabled = true;
}

function updateStatus() {
  els.scoreText.textContent = score;
  els.roundText.textContent = round;
}

function makeCorrectFeedback(target) {
  const mode = LEVELS[currentLevel].mode;
  if (currentLevel === 4) return `맞아요! ${formatTime(target.time, mode)}에 ${target.sentence}.`;

  if (target.label.includes("회의") || target.label.includes("수업")) {
    return `맞아요! ${target.label}는 ${formatTime(target.time, mode)}에 있어요.`;
  }
  return `맞아요! ${formatTime(target.time, mode)}에 ${target.sentence}.`;
}

function makeWrongFeedback(target) {
  const mode = LEVELS[currentLevel].mode;
  if (currentLevel === 4) return `다시 확인해요. ${formatTime(target.time, mode)}에는 '${target.sentence}'가 맞아요.`;

  if (target.label.includes("회의") || target.label.includes("수업")) {
    return `다시 확인해요. ${target.label}는 ${formatTime(target.time, mode)}에 있어요.`;
  }
  return `다시 확인해요. ${formatTime(target.time, mode)}에 ${target.sentence}.`;
}

function renderMakerCards() {
  els.activityCards.innerHTML = CUSTOM_ACTIVITIES.map((activity, index) => `
    <button class="chip-btn activity-chip" type="button" data-index="${index}">${activity.label}</button>
  `).join("");

  els.timeCards.innerHTML = CUSTOM_TIMES.map((time) => `
    <button class="chip-btn time-chip" type="button" data-time="${time}">${formatTime(time, "ampm")}</button>
  `).join("");

  els.activityCards.querySelectorAll(".activity-chip").forEach((button) => {
    button.addEventListener("click", () => {
      selectedActivity = CUSTOM_ACTIVITIES[Number(button.dataset.index)];
      els.activityCards.querySelectorAll(".activity-chip").forEach((btn) => btn.classList.remove("is-selected"));
      button.classList.add("is-selected");
    });
  });

  els.timeCards.querySelectorAll(".time-chip").forEach((button) => {
    button.addEventListener("click", () => addMySchedule(button.dataset.time));
  });
}

function addMySchedule(time) {
  if (!selectedActivity) {
    els.sentenceBox.textContent = "먼저 활동 카드를 골라 주세요.";
    return;
  }

  const newEntry = item(time, selectedActivity.label, selectedActivity.sentence);
  const existingIndex = mySchedule.findIndex((entry) => entry.time === time);

  if (existingIndex >= 0) {
    mySchedule[existingIndex] = newEntry;
  } else {
    mySchedule.push(newEntry);
  }

  mySchedule.sort((a, b) => toMinutes(a.time) - toMinutes(b.time));
  renderMySchedule();
  els.sentenceBox.textContent = `${formatTime(time, "ampm")}에 '${selectedActivity.label}' 일정이 들어갔어요.`;
}

function renderMySchedule() {
  if (mySchedule.length === 0) {
    els.myScheduleBody.innerHTML = `
      <tr>
        <td colspan="2">아직 일정이 없어요.</td>
      </tr>
    `;
    return;
  }

  els.myScheduleBody.innerHTML = mySchedule.map((entry) => `
    <tr>
      <td>${formatTime(entry.time, "ampm")}</td>
      <td>${entry.label}</td>
    </tr>
  `).join("");
}

function renderSentences() {
  if (mySchedule.length === 0) {
    els.sentenceBox.textContent = "일정을 먼저 만들어 주세요.";
    return;
  }

  els.sentenceBox.innerHTML = `
    <ol>
      ${mySchedule.map((entry) => `<li>${formatTime(entry.time, "ampm")}에 ${entry.sentence}.</li>`).join("")}
    </ol>
  `;
}

function clearMySchedule() {
  mySchedule = [];
  renderMySchedule();
  els.sentenceBox.textContent = "내 일정표를 비웠어요.";
}

function loadSampleSchedule() {
  mySchedule = [...SAMPLE_MY_SCHEDULE];
  renderMySchedule();
  renderSentences();
}

function formatTime(time, mode = "minute", compactForTable = false) {
  const [hourText, minuteText] = time.split(":");
  const hour24 = Number(hourText);
  const minute = Number(minuteText);
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  const ampm = hour24 < 12 ? "오전" : "오후";

  if (mode === "hour") return `${hour12}시`;

  if (mode === "minute") {
    if (compactForTable) return `${hour12}:${String(minute).padStart(2, "0")}`;
    return minute === 0 ? `${hour12}시` : `${hour12}시 ${minute}분`;
  }

  if (compactForTable) return `${ampm} ${hour12}:${String(minute).padStart(2, "0")}`;
  return minute === 0 ? `${ampm} ${hour12}시` : `${ampm} ${hour12}시 ${minute}분`;
}

function toMinutes(time) {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

function makeOptions(answer, sourceOptions, count) {
  const unique = [...new Set(sourceOptions)].filter(Boolean);
  const wrongOptions = shuffle(unique.filter((option) => option !== answer)).slice(0, count - 1);
  return shuffle([answer, ...wrongOptions]);
}

function pick(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function shuffle(array) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

function escapeAttr(value) {
  return String(value).replace(/"/g, "&quot;");
}
