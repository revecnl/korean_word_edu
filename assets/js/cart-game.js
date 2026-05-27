const IMAGE_BASE_PATH = "./assets/pic/object/";

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

let cart = [];

const productGrid = document.getElementById("productGrid");
const cartList = document.getElementById("cartList");
const cartStatus = document.getElementById("cartStatus");
const answerPreview = document.getElementById("answerPreview");
const clearCartButton = document.getElementById("clearCartButton");

function makeImagePath(fileName) {
  return `${IMAGE_BASE_PATH}${fileName}`;
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
}

function clearCart() {
  cart = [];
  renderCart();
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

function makeAnswerSentence() {
  if (cart.length === 0) {
    return "아직 없어요.";
  }

  const itemNames = cart.map((item) => item.name);

  if (itemNames.length === 1) {
    return `${itemNames[0]} 를/을 사요.`;
  }

  return `${itemNames.join(", ")} 를/을 사요.`;
}

clearCartButton.addEventListener("click", clearCart);

renderProducts();
renderCart();
