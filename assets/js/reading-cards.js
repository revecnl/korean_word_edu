const categoryLabels = {
  all: "전체",
  animals: "동식물",
  food: "음식",
  objects: "물건",
  people: "사람 / 직업"
};

let filteredCards = [];
let currentIndex = 0;

const categorySelect = document.getElementById("categorySelect");
const includeBatchimToggle = document.getElementById("includeBatchimToggle");
const showMeaningToggle = document.getElementById("showMeaningToggle");

const wordText = document.getElementById("wordText");
const wordImage = document.getElementById("wordImage");
const imageFallback = document.getElementById("imageFallback");
const meaningText = document.getElementById("meaningText");
const categoryBadge = document.getElementById("categoryBadge");
const batchimBadge = document.getElementById("batchimBadge");
const cardCounter = document.getElementById("cardCounter");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const randomBtn = document.getElementById("randomBtn");
const shuffleBtn = document.getElementById("shuffleBtn");

function getFilteredCards() {
  const selectedCategory = categorySelect.value;
  const includeBatchim = includeBatchimToggle.checked;

  return READING_CARDS.filter((card) => {
    const categoryMatched =
      selectedCategory === "all" || card.category === selectedCategory;

    const batchimMatched =
      includeBatchim || card.hasBatchim === false;

    return categoryMatched && batchimMatched;
  });
}

function refreshCards() {
  filteredCards = getFilteredCards();
  currentIndex = 0;
  renderCard();
}

function renderCard() {
  if (filteredCards.length === 0) {
    wordText.textContent = "단어 없음";
    meaningText.textContent = "";
    categoryBadge.textContent = "-";
    batchimBadge.textContent = "-";
    cardCounter.textContent = "0 / 0";

    wordImage.classList.add("hidden");
    imageFallback.classList.remove("hidden");
    imageFallback.textContent = "표시할 단어가 없습니다.";
    return;
  }

  const card = filteredCards[currentIndex];

  wordText.textContent = card.word;
  meaningText.textContent = showMeaningToggle.checked ? card.meaning : "";

  categoryBadge.textContent = categoryLabels[card.category] || card.category;

  batchimBadge.textContent = card.hasBatchim ? "받침 있음" : "받침 없음";
  batchimBadge.classList.toggle("has-batchim", card.hasBatchim);

  cardCounter.textContent = `${currentIndex + 1} / ${filteredCards.length}`;

  loadImage(card);
}

function loadImage(card) {
  wordImage.classList.add("hidden");
  imageFallback.classList.add("hidden");

  if (!card.image) {
    imageFallback.textContent = "이미지 준비 중";
    imageFallback.classList.remove("hidden");
    return;
  }

  wordImage.onload = () => {
    imageFallback.classList.add("hidden");
    wordImage.classList.remove("hidden");
  };

  wordImage.onerror = () => {
    wordImage.classList.add("hidden");
    imageFallback.textContent = "이미지 준비 중";
    imageFallback.classList.remove("hidden");
  };

  wordImage.src = card.image;
  wordImage.alt = card.word;
}

function showNextCard() {
  if (filteredCards.length === 0) return;

  currentIndex = (currentIndex + 1) % filteredCards.length;
  renderCard();
}

function showPrevCard() {
  if (filteredCards.length === 0) return;

  currentIndex =
    (currentIndex - 1 + filteredCards.length) % filteredCards.length;
  renderCard();
}

function showRandomCard() {
  if (filteredCards.length === 0) return;

  if (filteredCards.length === 1) {
    currentIndex = 0;
    renderCard();
    return;
  }

  let randomIndex;

  do {
    randomIndex = Math.floor(Math.random() * filteredCards.length);
  } while (randomIndex === currentIndex);

  currentIndex = randomIndex;
  renderCard();
}

function shuffleCards() {
  if (filteredCards.length <= 1) return;

  for (let i = filteredCards.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [filteredCards[i], filteredCards[randomIndex]] = [
      filteredCards[randomIndex],
      filteredCards[i]
    ];
  }

  currentIndex = 0;
  renderCard();
}

categorySelect.addEventListener("change", refreshCards);
includeBatchimToggle.addEventListener("change", refreshCards);
showMeaningToggle.addEventListener("change", renderCard);

nextBtn.addEventListener("click", showNextCard);
prevBtn.addEventListener("click", showPrevCard);
randomBtn.addEventListener("click", showRandomCard);
shuffleBtn.addEventListener("click", shuffleCards);

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") {
    showNextCard();
  }

  if (event.key === "ArrowLeft") {
    showPrevCard();
  }

  if (event.key.toLowerCase() === "r") {
    showRandomCard();
  }

  if (event.key.toLowerCase() === "s") {
    shuffleCards();
  }
});

refreshCards();
