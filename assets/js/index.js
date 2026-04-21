
const programCards = [
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
  status.className = `program-status ${program.status === "live" ? "is-live" : "is-planned"}`;
  status.textContent = program.status === "live" ? "● 사용 가능" : "● 준비중";

  const title = document.createElement("h3");
  title.textContent = program.title;

  const description = document.createElement("p");
  description.textContent = program.description;

  const tags = document.createElement("div");
  tags.className = "program-tags";
  (program.tags || []).forEach(tag => tags.appendChild(createTag(tag)));

  const footer = document.createElement("div");
  footer.className = "program-card-footer";
  footer.appendChild(createActionButton(program));

  article.append(status, title, description, tags, footer);
  return article;
}

function renderPrograms() {
  const livePrograms = programCards.filter(program => program.status === "live");
  const plannedCards = programCards.filter(program => program.status !== "live");

  availablePrograms.innerHTML = "";
  plannedPrograms.innerHTML = "";

  livePrograms.forEach(program => {
    availablePrograms.appendChild(createProgramCard(program));
  });

  plannedCards.forEach(program => {
    plannedPrograms.appendChild(createProgramCard(program));
  });

  availableCount.textContent = String(livePrograms.length);
  plannedCount.textContent = String(plannedCards.length);
}

renderPrograms();

