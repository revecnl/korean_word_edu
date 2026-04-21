const programCards = [
  {
    id: "roulette",
    title: "랜덤 문장 만들기",
    description:
      "왼쪽과 오른쪽 단어를 조합해 문장을 만드는 활동입니다. 프리셋, 커스텀 프리셋, 상태 저장, 초기화 기능을 사용할 수 있습니다.",
    tags: ["룰렛 문장 만들기", "어휘 연습"],
    status: "live",
    buttonText: "프로그램 실행",
    href: "./roulette.html"
  },
  {
    id: "family-tree",
    title: "가계도 만들기",
    description:
      "가족 구성원 카드를 가계도 위치에 배치하며 가족 어휘를 연습하는 프로그램입니다.",
    tags: ["가족 어휘", "드래그 활동"],
    status: "live",
    buttonText: "프로그램 실행",
    href: "./family-tree.html"
  },
  {
    id: "family-intro",
    title: "가족 소개 표 활동",
    description:
      "표 형태로 가족이나 다른 주제를 정리하며 소개할 수 있는 활동입니다. 기본 프리셋과 커스텀 프리셋을 지원합니다.",
    tags: ["표 활동", "소개 말하기", "프리셋"],
    status: "live",
    buttonText: "프로그램 실행",
    href: "./family-intro.html"
  },
  {
    id: "new-program",
    title: "새 활동 프로그램",
    description: "추후 추가될 프로그램 공간입니다.",
    tags: ["확장 예정"],
    status: "planned",
    buttonText: "준비중",
    href: ""
  }
];

const availablePrograms = document.getElementById("availablePrograms");
const plannedPrograms = document.getElementById("plannedPrograms");
const availableCount = document.getElementById("availableCount");
const plannedCount = document.getElementById("plannedCount");

function createTag(tagText) {
  const span = document.createElement("span");
  span.className = "program-tag";
  span.textContent = tagText;
  return span;
}

function createActionButton(program) {
  if (program.status === "live") {
    const link = document.createElement("a");
    link.className = "program-link";
    link.href = program.href;
    link.textContent = program.buttonText || "프로그램 실행";
    return link;
  }

  const span = document.createElement("span");
  span.className = "program-link-disabled";
  span.textContent = program.buttonText || "준비중";
  return span;
}

function createProgramCard(program) {
  const article = document.createElement("article");
  article.className = "program-card";

  const status = document.createElement("div");
  status.className =
    "program-status " + (program.status === "live" ? "is-live" : "is-planned");
  status.textContent = program.status === "live" ? "● 사용 가능" : "● 준비중";

  const title = document.createElement("h3");
  title.textContent = program.title;

  const description = document.createElement("p");
  description.textContent = program.description;

  const tags = document.createElement("div");
  tags.className = "program-tags";

  (program.tags || []).forEach((tag) => {
    tags.appendChild(createTag(tag));
  });

  const footer = document.createElement("div");
  footer.className = "program-card-footer";
  footer.appendChild(createActionButton(program));

  article.appendChild(status);
  article.appendChild(title);
  article.appendChild(description);
  article.appendChild(tags);
  article.appendChild(footer);

  return article;
}

function renderPrograms() {
  if (!availablePrograms || !plannedPrograms || !availableCount || !plannedCount) {
    console.error("index.html의 필수 요소를 찾을 수 없습니다.");
    return;
  }

  const livePrograms = programCards.filter((program) => program.status === "live");
  const plannedCards = programCards.filter((program) => program.status !== "live");

  availablePrograms.innerHTML = "";
  plannedPrograms.innerHTML = "";

  livePrograms.forEach((program) => {
    availablePrograms.appendChild(createProgramCard(program));
  });

  plannedCards.forEach((program) => {
    plannedPrograms.appendChild(createProgramCard(program));
  });

  availableCount.textContent = String(livePrograms.length);
  plannedCount.textContent = String(plannedCards.length);
}

document.addEventListener("DOMContentLoaded", renderPrograms);
