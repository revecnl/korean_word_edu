const IMAGE_BASE_PATH = "./assets/pic/object/";
const CHARACTER_BASE_PATH = "./assets/pic/character/";

const products = [
  {
    id: "apple",
    name: "사과",
    image: "apple.png"
  },
  {
    id: "bread",
    name: "빵",
    image: "bread.png"
  },
  {
    id: "milk",
    name: "우유",
    image: "milk.png"
  },
  {
    id: "water",
    name: "물",
    image: "water.png"
  },
  {
    id: "book",
    name: "책",
    image: "book.png"
  },
  {
    id: "bag",
    name: "가방",
    image: "bag.png"
  },
  {
    id: "pen",
    name: "펜",
    image: "pen.png"
  },
  {
    id: "wallet",
    name: "지갑",
    image: "wallet.png"
  },
];

const npcs = [
  {
    id: "clerk-male",
    name: "이준호",
    role: "친절한 점원",
    image: "clerk-male.png",
    greetings: [
      "어서 오세요! 필요한 물건을 골라 보세요.",
      "오늘은 무엇을 사요?",
      "장바구니에 물건을 담아 보세요!"
    ],
    emptyMessages: [
      "아직 장바구니가 비어 있어요. 물건을 하나 골라 볼까요?",
      "상품의 + 버튼을 눌러 보세요.",
      "필요한 물건을 장바구니에 담아 주세요."
    ],
    cartMessages: [
      "좋아요! 이렇게 말해 볼까요?",
      "잘했어요. 문장으로 말해 보세요.",
      "장바구니에 담았어요. 같이 읽어 볼까요?"
    ],
    clearMessages: [
      "장바구니를 비웠어요. 다시 골라 볼까요?",
      "초기화했어요. 새로 담아 보세요.",
      "좋아요. 다시 쇼핑을 시작해 볼까요?"
    ],
    levelMessages: {
      1: "레벨 1이에요. 물건 이름을 넣어 말해 보세요.",
      2: "레벨 2예요. 한 개, 두 개, 세 개를 같이 연습해요."
    }
  },
  {
    id: "clerk-female",
    name: "김수연",
    role: "상냥한 점원",
    image: "clerk-female.png",
    greetings: [
      "안녕하세요! 천천히 둘러보세요.",
      "무엇을 사요? 필요한 물건을 골라 보세요.",
      "어서 오세요! 장바구니에 물건을 담아 보세요."
    ],
    emptyMessages: [
      "아직 담은 물건이 없어요. 하나 골라 볼까요?",
      "왼쪽 상품에서 + 버튼을 눌러 주세요.",
      "먼저 사고 싶은 물건을 선택해 보세요."
    ],
    cartMessages: [
      "좋아요! 이 문장을 말해 보세요.",
      "아주 좋아요. 무엇을 사요?",
      "장바구니에 담았어요. 문장으로 연습해 볼까요?"
    ],
    clearMessages: [
      "장바구니를 비웠어요. 다시 시작해요!",
      "좋아요. 다시 물건을 골라 보세요.",
      "초기화했어요. 이번에는 무엇을 살까요?"
    ],
    levelMessages: {
      1: "레벨 1이에요. ‘사과를 사요’처럼 말해 보세요.",
      2: "레벨 2예요. ‘사과 한 개를 사요’처럼 말해 보세요."
    }
  }
];

let cart = [];
let currentNpc = null;
let currentLevel = Number(localStorage.getItem("cartGameLevel")) || 1;

const productGrid = document.getElementById("productGrid");
const cartList = document.getElementById("cartList");
const cartStatus = document.getElementById("cartStatus");
const answerPreview = document.getElementById("answerPreview");
const clearCartButton = document.getElementById("clearCartButton");
const levelButtons = document.querySelectorAll(".level-button");

const npcImage = document.getElementById("npcImage");
const npcName = document.getElementById("npcName");
const npcRole = document.getElementById("npcRole");
const npcDialogue = document.getElementById("npcDialogue");

function makeImagePath(fileName) {
  return `${IMAGE_BASE_PATH}${fileName}`;
}

function makeCharacterPath(fileName) {
  return `${CHARACTER_BASE_PATH}${fileName}`;
}

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function makePlaceholderImage(name) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="240" height="180" viewBox="0 0 240 180">
      <rect width="240" height="180" rx="28" fill="#fff3e4"/>
      <circle cx="120" cy="76" r="34" fill="#f08a5d" opacity="0.82"/>
      <text x="120" y="132" text-anchor="middle"
        font-family="Arial, sans-serif" font-size="24" font-weight="700" fill="#5f4634">
        ${name}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function renderRandomNpc() {
  if (!npcImage || !npcName || !npcRole || !npcDialogue) {
    return;
  }

  currentNpc = getRandomItem(npcs);

  npcImage.src = makeCharacterPath(currentNpc.image);
  npcImage.alt = `${currentNpc.name} 점원`;
  npcName.textContent = currentNpc.name;
  npcRole.textContent = currentNpc.role;
  npcDialogue.textContent = getRandomItem(currentNpc.greetings);

  npcImage.addEventListener("error", () => {
    npcImage.style.display = "none";
  });
}

function updateNpcDialogue(type) {
  if (!currentNpc || !npcDialogue) {
    return;
  }

  if (type === "empty") {
    npcDialogue.textContent = getRandomItem(currentNpc.emptyMessages);
    return;
  }

  if (type === "cart") {
    npcDialogue.textContent = `${getRandomItem(currentNpc.cartMessages)} “${makeAnswerSentence()}”`;
    return;
  }

  if (type === "clear") {
    npcDialogue.textContent = getRandomItem(currentNpc.clearMessages);
    return;
  }

  if (type === "level") {
    npcDialogue.textContent =
      currentNpc.levelMessages[currentLevel] ||
      "레벨을 바꿨어요. 다시 연습해 볼까요?";
  }
}

function setupLevelButtons() {
  if (!levelButtons || levelButtons.length === 0) {
    return;
  }

  levelButtons.forEach((button) => {
    const buttonLevel = Number(button.dataset.level);

    button.classList.toggle("active", buttonLevel === currentLevel);

    button.addEventListener("click", () => {
      currentLevel = buttonLevel;
      localStorage.setItem("cartGameLevel", String(currentLevel));

      levelButtons.forEach((item) => {
        item.classList.toggle(
          "active",
          Number(item.dataset.level) === currentLevel
        );
      });

      renderCart();

      if (cart.length > 0) {
        updateNpcDialogue("cart");
      } else {
        updateNpcDialogue("level");
      }
    });
  });
}

function renderProducts() {
  if (!productGrid) {
    return;
  }

  productGrid.innerHTML = "";

  products.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";

    card.innerHTML = `
      <div class="product-image-wrap">
        <img
          class="product-image"
          src="${makeImagePath(product.image)}"
          alt="${product.name}"
        />
      </div>

      <div class="product-info">
        <p class="product-name">${product.name}</p>
        <button
          class="add-button"
          type="button"
          aria-label="${product.name} 담기"
          data-id="${product.id}"
        >
          +
        </button>
      </div>
    `;

    const image = card.querySelector(".product-image");
    image.addEventListener("error", () => {
      image.src = makePlaceholderImage(product.name);
    });

    const addButton = card.querySelector(".add-button");
    addButton.addEventListener("click", () => {
      addToCart(product.id);
    });

    productGrid.appendChild(card);
  });
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);

  if (!product) {
    return;
  }

  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.count += 1;
  } else {
    cart.push({
      ...product,
      count: 1
    });
  }

  renderCart();
  updateNpcDialogue("cart");
}

function clearCart() {
  cart = [];
  renderCart();
  updateNpcDialogue("clear");
}

function renderCart() {
  if (!cartList || !cartStatus || !answerPreview) {
    return;
  }

  cartList.innerHTML = "";

  if (cart.length === 0) {
    cartList.classList.add("empty");
    cartList.innerHTML = `<p class="empty-message">상품을 담아 보세요.</p>`;
    cartStatus.textContent = "아직 담은 물건이 없어요.";
    answerPreview.textContent = "아직 없어요.";
    return;
  }

  cartList.classList.remove("empty");

  const totalCount = cart.reduce((sum, item) => sum + item.count, 0);
  cartStatus.textContent = `담은 상품: ${totalCount}개`;

  cart.forEach((item) => {
    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";

    cartItem.innerHTML = `
      <img
        class="cart-item-image"
        src="${makeImagePath(item.image)}"
        alt="${item.name}"
      />

      <p class="cart-item-name">${item.name}</p>

      <span class="cart-item-count">x ${item.count}</span>
    `;

    const image = cartItem.querySelector(".cart-item-image");
    image.addEventListener("error", () => {
      image.src = makePlaceholderImage(item.name);
    });

    cartList.appendChild(cartItem);
  });

  answerPreview.textContent = makeAnswerSentence();
}

function hasFinalConsonant(word) {
  const lastChar = word[word.length - 1];
  const code = lastChar.charCodeAt(0);

  if (code < 0xac00 || code > 0xd7a3) {
    return false;
  }

  return (code - 0xac00) % 28 !== 0;
}

function getObjectParticle(word) {
  return hasFinalConsonant(word) ? "을" : "를";
}

function getNativeNumber(count) {
  const nativeNumbers = {
    1: "한",
    2: "두",
    3: "세",
    4: "네",
    5: "다섯",
    6: "여섯",
    7: "일곱",
    8: "여덟",
    9: "아홉",
    10: "열"
  };

  return nativeNumbers[count] || String(count);
}

function makeLevelOneSentence() {
  if (cart.length === 1) {
    const item = cart[0];
    return `${item.name}${getObjectParticle(item.name)} 사요.`;
  }

  const phrases = cart.map((item) => {
    return `${item.name}${getObjectParticle(item.name)}`;
  });

  return `${phrases.join(", ")} 사요.`;
}

function makeLevelTwoSentence() {
  if (cart.length === 1) {
    const item = cart[0];
    const countText = getNativeNumber(item.count);

    return `${item.name} ${countText} 개를 사요.`;
  }

  const phrases = cart.map((item, index) => {
    const countText = getNativeNumber(item.count);
    const phrase = `${item.name} ${countText} 개`;

    if (index === cart.length - 1) {
      return `${phrase}를`;
    }

    return phrase;
  });

  return `${phrases.join(", ")} 사요.`;
}

function makeAnswerSentence() {
  if (cart.length === 0) {
    return "아직 없어요.";
  }

  if (currentLevel === 1) {
    return makeLevelOneSentence();
  }

  if (currentLevel === 2) {
    return makeLevelTwoSentence();
  }

  return makeLevelOneSentence();
}

if (clearCartButton) {
  clearCartButton.addEventListener("click", clearCart);
}

setupLevelButtons();
renderRandomNpc();
renderProducts();
renderCart();
