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
  }
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
    ]
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
    ]
  }
];

let cart = [];
let currentNpc = null;

const productGrid = document.getElementById("productGrid");
const cartList = document.getElementById("cartList");
const cartStatus = document.getElementById("cartStatus");
const answerPreview = document.getElementById("answerPreview");
const clearCartButton = document.getElementById("clearCartButton");

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

function renderRandomNpc() {
  currentNpc = getRandomItem(npcs);

  npcImage.src = makeCharacterPath(currentNpc.image);
  npcImage.alt = `${currentNpc.name} 점원`;
  npcName.textContent = currentNpc.name;
  npcRole.textContent = currentNpc.role;
  npcDialogue.textContent = getRandomItem(currentNpc.greetings);
}

function updateNpcDialogue(type) {
  if (!currentNpc) return;

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
  }
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

function renderProducts() {
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

  if (!product) return;

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

function makeAnswerSentence() {
  if (cart.length === 0) {
    return "아직 없어요.";
  }

  if (cart.length === 1) {
    const item = cart[0];
    return `${item.name}${getObjectParticle(item.name)} 사요.`;
  }

  const phrases = cart.map((item) => {
    return `${item.name}${getObjectParticle(item.name)}`;
  });

  return `${phrases.join(", ")} 사요.`;
}

clearCartButton.addEventListener("click", clearCart);

renderRandomNpc();
renderProducts();
renderCart();
