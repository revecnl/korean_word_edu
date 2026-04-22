var STORAGE_KEY = 'flashcard_custom_cards_v4';
var MAX_FILE_SIZE = 2 * 1024 * 1024;
var MAX_IMAGE_WIDTH = 1600;
var MAX_IMAGE_HEIGHT = 1600;
var ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

function makeId() {
  return 'card-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
}

function cloneCards(list) {
  return list.map(function(card) {
    return {
      id: card.id || makeId(),
      category: card.category || 'custom',
      name: card.name || '',
      description: card.description || '',
      image: card.image || '',
      flipped: false
    };
  });
}

var presetData = {
  family: [
    { id: makeId(), category: 'family', name: '할아버지', description: '아버지나 어머니의 아버지예요.', image: 'assets/pic/family/grandfather.png' },
    { id: makeId(), category: 'family', name: '할머니', description: '아버지나 어머니의 어머니예요.', image: 'assets/pic/family/grandmother.png' },
    { id: makeId(), category: 'family', name: '아버지', description: '우리 가족의 아버지예요.', image: 'assets/pic/family/father.png' },
    { id: makeId(), category: 'family', name: '어머니', description: '우리 가족의 어머니예요.', image: 'assets/pic/family/mother.png' },
    { id: makeId(), category: 'family', name: '형/오빠', description: '나보다 나이가 많은 남자 형제예요.', image: 'assets/pic/family/brother-older.png' },
    { id: makeId(), category: 'family', name: '누나/언니', description: '나보다 나이가 많은 여자 형제예요.', image: 'assets/pic/family/sister-older.png' },
    { id: makeId(), category: 'family', name: '남동생', description: '나보다 나이가 어린 남자 형제예요.', image: 'assets/pic/family/brother-younger.png' },
    { id: makeId(), category: 'family', name: '여동생', description: '나보다 나이가 어린 여자 형제예요.', image: 'assets/pic/family/sister-younger.png' }
  ],
  object: [
    { id: makeId(), category: 'object', name: '책', description: '읽을 때 사용하는 물건이에요.', image: 'assets/pic/object/book.png' },
    { id: makeId(), category: 'object', name: '가방', description: '물건을 넣어 가지고 다니는 물건이에요.', image: 'assets/pic/object/bag.png' },
    { id: makeId(), category: 'object', name: '의자', description: '앉을 때 사용하는 물건이에요.', image: 'assets/pic/object/chair.png' },
    { id: makeId(), category: 'object', name: '컴퓨터', description: '공부하거나 일할 때 자주 사용하는 기기예요.', image: 'assets/pic/object/computer.png' },
    { id: makeId(), category: 'object', name: '연필', description: '글씨를 쓸 때 사용하는 물건이에요.', image: 'assets/pic/object/pencil.png' },
    { id: makeId(), category: 'object', name: '시계', description: '시간을 확인할 때 사용하는 물건이에요.', image: 'assets/pic/object/clock.png' },
    { id: makeId(), category: 'object', name: '핸드폰', description: '전화하거나 메시지를 보낼 때 사용하는 물건이에요.', image: 'assets/pic/object/phone.png' },
    { id: makeId(), category: 'object', name: '컵', description: '물을 마실 때 사용하는 물건이에요.', image: 'assets/pic/object/cup.png' }
  ],
  job: [
    { id: makeId(), category: 'job', name: '선생님', description: '학생을 가르치는 직업이에요.', image: 'assets/pic/job/teacher.png' },
    { id: makeId(), category: 'job', name: '의사', description: '아픈 사람을 진료하는 직업이에요.', image: 'assets/pic/job/doctor.png' },
    { id: makeId(), category: 'job', name: '회사원', description: '회사에서 일하는 직업이에요.', image: 'assets/pic/job/office-worker.png' },
    { id: makeId(), category: 'job', name: '요리사', description: '음식을 만드는 직업이에요.', image: 'assets/pic/job/cook.png' },
    { id: makeId(), category: 'job', name: '경찰', description: '사람들을 보호하는 직업이에요.', image: 'assets/pic/job/police.png' },
    { id: makeId(), category: 'job', name: '간호사', description: '환자를 돌보는 직업이에요.', image: 'assets/pic/job/nurse.png' },
    { id: makeId(), category: 'job', name: '학생', description: '학교에서 공부하는 사람이에요.', image: 'assets/pic/job/student.png' },
    { id: makeId(), category: 'job', name: '운전기사', description: '차를 운전하는 직업이에요.', image: 'assets/pic/job/driver.png' }
  ]
};

var currentSetName = 'family';
var cards = cloneCards(presetData.family);
var customCards = loadCustomCards();
var editingCardId = null;

var cardGrid = document.getElementById('cardGrid');
var currentSetNameEl = document.getElementById('currentSetName');
var cardCountEl = document.getElementById('cardCount');
var flippedCountEl = document.getElementById('flippedCount');
var statusMessageEl = document.getElementById('statusMessage');
var customCardListEl = document.getElementById('customCardList');
var uploadPreviewEl = document.getElementById('uploadPreview');

var cardCategoryEl = document.getElementById('cardCategory');
var cardNameEl = document.getElementById('cardName');
var cardDescriptionEl = document.getElementById('cardDescription');
var cardImagePathEl = document.getElementById('cardImagePath');
var cardImageFileEl = document.getElementById('cardImageFile');

function nameLabel(key) {
  var labels = {
    family: '가족',
    object: '물건',
    job: '직업',
    custom: '커스텀'
  };
  return labels[key] || key;
}

function setMessage(text) {
  statusMessageEl.textContent = text;
  clearTimeout(setMessage.timer);
  setMessage.timer = setTimeout(function() {
    statusMessageEl.textContent = '';
  }, 2400);
}

function loadCustomCards() {
  try {
    var raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    var parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (e) {
    return [];
  }
}

function saveCustomCards() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customCards));
  } catch (e) {
    setMessage('저장 공간이 부족할 수 있습니다. 이미지 크기를 줄여 주세요.');
  }
  renderCustomList();
  if (currentSetName === 'custom') {
    cards = cloneCards(customCards);
    renderCards();
  }
}

function clearUploadPreview() {
  uploadPreviewEl.innerHTML = '<div class="preview-placeholder">선택한 이미지 미리보기가 여기에 표시됩니다.</div>';
}

function setUploadPreview(src, text) {
  uploadPreviewEl.innerHTML = '';
  if (!src) {
    clearUploadPreview();
    return;
  }
  var img = document.createElement('img');
  img.src = src;
  img.alt = text || '업로드 미리보기';
  uploadPreviewEl.appendChild(img);
}

function clearForm() {
  editingCardId = null;
  cardCategoryEl.value = 'family';
  cardNameEl.value = '';
  cardDescriptionEl.value = '';
  cardImagePathEl.value = '';
  cardImageFileEl.value = '';
  clearUploadPreview();
}

function getFormData() {
  return {
    category: cardCategoryEl.value,
    name: cardNameEl.value.trim(),
    description: cardDescriptionEl.value.trim(),
    image: cardImagePathEl.value.trim()
  };
}

function validateForm(data) {
  if (!data.name) {
    setMessage('카드 이름을 입력해 주세요.');
    return false;
  }
  return true;
}

function validateImageDimensions(dataUrl) {
  return new Promise(function(resolve) {
    var img = new Image();
    img.onload = function() {
      if (img.width > MAX_IMAGE_WIDTH || img.height > MAX_IMAGE_HEIGHT) {
        resolve({ ok: false, message: '이미지 해상도는 ' + MAX_IMAGE_WIDTH + '×' + MAX_IMAGE_HEIGHT + ' 이하만 가능합니다.' });
        return;
      }
      resolve({ ok: true, width: img.width, height: img.height });
    };
    img.onerror = function() {
      resolve({ ok: false, message: '이미지 파일을 읽을 수 없습니다.' });
    };
    img.src = dataUrl;
  });
}

function readSelectedImageFile() {
  return new Promise(function(resolve) {
    var file = cardImageFileEl.files && cardImageFileEl.files[0];
    if (!file) {
      resolve({ ok: true, dataUrl: null });
      return;
    }

    if (ALLOWED_IMAGE_TYPES.indexOf(file.type) === -1) {
      resolve({ ok: false, message: 'PNG, JPG, WEBP, GIF 파일만 업로드할 수 있습니다.' });
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      resolve({ ok: false, message: '이미지 용량은 2MB 이하만 가능합니다.' });
      return;
    }

    var reader = new FileReader();
    reader.onload = function(event) {
      var dataUrl = event.target.result;
      validateImageDimensions(dataUrl).then(function(result) {
        if (!result.ok) {
          resolve({ ok: false, message: result.message });
          return;
        }
        resolve({ ok: true, dataUrl: dataUrl, width: result.width, height: result.height });
      });
    };
    reader.onerror = function() {
      resolve({ ok: false, message: '이미지 파일을 불러오지 못했습니다.' });
    };
    reader.readAsDataURL(file);
  });
}

function loadPreset(name) {
  currentSetName = name;
  currentSetNameEl.textContent = nameLabel(name);
  cards = cloneCards(presetData[name]);
  renderCards();
  setMessage(nameLabel(name) + ' 프리셋을 불러왔습니다.');
}

function loadCustomSet() {
  currentSetName = 'custom';
  currentSetNameEl.textContent = '커스텀';
  cards = cloneCards(customCards);
  renderCards();
  if (customCards.length) {
    setMessage('커스텀 세트를 불러왔습니다.');
  } else {
    setMessage('커스텀 카드가 아직 없습니다.');
  }
}

async function addCustomCard() {
  var data = getFormData();
  if (!validateForm(data)) return;

  var uploadResult = await readSelectedImageFile();
  if (!uploadResult.ok) {
    setMessage(uploadResult.message);
    return;
  }

  customCards.push({
    id: makeId(),
    category: data.category,
    name: data.name,
    description: data.description,
    image: uploadResult.dataUrl || data.image
  });

  saveCustomCards();
  currentSetName = 'custom';
  currentSetNameEl.textContent = '커스텀';
  cards = cloneCards(customCards);
  renderCards();
  clearForm();
  setMessage(uploadResult.dataUrl ? '제한 조건을 통과한 로컬 이미지로 카드가 추가되었습니다.' : '커스텀 카드가 추가되었습니다.');
}

function startEditCard(id) {
  var target = customCards.find(function(card) {
    return card.id === id;
  });
  if (!target) return;
  editingCardId = id;
  cardCategoryEl.value = target.category;
  cardNameEl.value = target.name;
  cardDescriptionEl.value = target.description;
  if (target.image && target.image.indexOf('data:image') === 0) {
    cardImagePathEl.value = '';
    setUploadPreview(target.image, target.name);
  } else {
    cardImagePathEl.value = target.image;
    clearUploadPreview();
  }
  cardImageFileEl.value = '';
  setMessage('수정할 카드를 불러왔습니다.');
}

async function updateCustomCard() {
  if (!editingCardId) {
    setMessage('먼저 수정할 카드를 선택해 주세요.');
    return;
  }

  var data = getFormData();
  if (!validateForm(data)) return;

  var index = customCards.findIndex(function(card) {
    return card.id === editingCardId;
  });

  if (index === -1) {
    setMessage('수정할 카드를 찾지 못했습니다.');
    return;
  }

  var uploadResult = await readSelectedImageFile();
  if (!uploadResult.ok) {
    setMessage(uploadResult.message);
    return;
  }

  var originalImage = customCards[index].image || '';
  var finalImage = uploadResult.dataUrl || data.image || originalImage;

  customCards[index] = {
    id: editingCardId,
    category: data.category,
    name: data.name,
    description: data.description,
    image: finalImage
  };

  saveCustomCards();
  clearForm();
  setMessage(uploadResult.dataUrl ? '이미지 제한을 통과한 새 파일로 카드를 수정했습니다.' : '커스텀 카드를 수정했습니다.');
}

function deleteCustomCard(id) {
  customCards = customCards.filter(function(card) {
    return card.id !== id;
  });
  if (editingCardId === id) clearForm();
  saveCustomCards();
  setMessage('커스텀 카드를 삭제했습니다.');
}

function clearCustomSet() {
  customCards = [];
  localStorage.removeItem(STORAGE_KEY);
  clearForm();
  renderCustomList();
  if (currentSetName === 'custom') {
    cards = [];
    renderCards();
  }
  setMessage('커스텀 카드를 모두 삭제했습니다.');
}

function flipAllCards() {
  var hasFront = cards.some(function(card) {
    return !card.flipped;
  });
  cards.forEach(function(card) {
    card.flipped = hasFront;
  });
  renderCards();
  setMessage(hasFront ? '전체 카드를 뒤집었습니다.' : '전체 카드를 앞면으로 돌렸습니다.');
}

function resetFlips() {
  cards.forEach(function(card) {
    card.flipped = false;
  });
  renderCards();
  setMessage('모든 카드를 앞면으로 초기화했습니다.');
}

function createPlaceholder(text, extraClass) {
  var div = document.createElement('div');
  div.className = 'placeholder' + (extraClass ? ' ' + extraClass : '');
  div.innerHTML = text;
  return div;
}

function renderCards() {
  cardGrid.innerHTML = '';

  if (!cards.length) {
    cardGrid.appendChild(createPlaceholder('표시할 카드가 없습니다.', 'empty-box'));
    cardCountEl.textContent = '0';
    flippedCountEl.textContent = '0';
    return;
  }

  cards.forEach(function(card) {
    var article = document.createElement('article');
    article.className = 'flip-card' + (card.flipped ? ' flipped' : '');

    var inner = document.createElement('div');
    inner.className = 'flip-card-inner';

    var front = document.createElement('div');
    front.className = 'flip-face flip-front';

    var imageWrap = document.createElement('div');
    imageWrap.className = 'image-wrap';

    if (card.image) {
      var img = document.createElement('img');
      img.className = 'card-image';
      img.src = card.image;
      img.alt = card.name;
      img.onerror = function() {
        this.remove();
        imageWrap.appendChild(createPlaceholder(card.name + '<br>이미지를 찾을 수 없습니다.'));
      };
      imageWrap.appendChild(img);
    } else {
      imageWrap.appendChild(createPlaceholder('이미지 경로를 입력하면 여기에 표시됩니다.'));
    }

    var label = document.createElement('div');
    label.className = 'card-label';
    label.textContent = card.name;

    front.appendChild(imageWrap);
    front.appendChild(label);

    var back = document.createElement('div');
    back.className = 'flip-face flip-back';

    var title = document.createElement('div');
    title.className = 'back-title';
    title.textContent = card.name;

    var desc = document.createElement('div');
    desc.className = 'back-desc';
    desc.textContent = card.description || '설명이 없습니다.';

    var badge = document.createElement('div');
    badge.className = 'badge';
    badge.textContent = nameLabel(card.category);

    back.appendChild(title);
    back.appendChild(desc);
    back.appendChild(badge);

    inner.appendChild(front);
    inner.appendChild(back);
    article.appendChild(inner);

    article.addEventListener('click', function() {
      card.flipped = !card.flipped;
      renderCards();
    });

    cardGrid.appendChild(article);
  });

  cardCountEl.textContent = String(cards.length);
  flippedCountEl.textContent = String(cards.filter(function(card) {
    return card.flipped;
  }).length);
}

function renderCustomList() {
  customCardListEl.innerHTML = '';

  if (!customCards.length) {
    customCardListEl.textContent = '아직 추가된 커스텀 카드가 없습니다.';
    return;
  }

  customCards.forEach(function(card) {
    var row = document.createElement('div');
    row.className = 'custom-item';

    var info = document.createElement('div');
    var name = document.createElement('strong');
    name.textContent = card.name + ' ';
    var badge = document.createElement('span');
    badge.className = 'badge';
    badge.style.marginTop = '0';
    badge.textContent = nameLabel(card.category);
    var desc = document.createElement('div');
    desc.style.marginTop = '4px';
    desc.style.color = '#4b5563';
    desc.style.fontSize = '13px';
    desc.textContent = card.description || '설명 없음';

    info.appendChild(name);
    info.appendChild(badge);
    info.appendChild(desc);

    var buttons = document.createElement('div');
    buttons.className = 'button-row';

    var editBtn = document.createElement('button');
    editBtn.className = 'secondary';
    editBtn.textContent = '수정';
    editBtn.addEventListener('click', function() {
      startEditCard(card.id);
    });

    var deleteBtn = document.createElement('button');
    deleteBtn.className = 'danger';
    deleteBtn.textContent = '삭제';
    deleteBtn.addEventListener('click', function() {
      deleteCustomCard(card.id);
    });

    buttons.appendChild(editBtn);
    buttons.appendChild(deleteBtn);

    row.appendChild(info);
    row.appendChild(buttons);
    customCardListEl.appendChild(row);
  });
}

document.querySelectorAll('[data-preset]').forEach(function(button) {
  button.addEventListener('click', function() {
    loadPreset(button.getAttribute('data-preset'));
  });
});

cardImageFileEl.addEventListener('change', function() {
  var file = cardImageFileEl.files && cardImageFileEl.files[0];
  if (!file) {
    clearUploadPreview();
    return;
  }

  if (ALLOWED_IMAGE_TYPES.indexOf(file.type) === -1) {
    setMessage('PNG, JPG, WEBP, GIF 파일만 업로드할 수 있습니다.');
    cardImageFileEl.value = '';
    clearUploadPreview();
    return;
  }

  if (file.size > MAX_FILE_SIZE) {
    setMessage('이미지 용량은 2MB 이하만 가능합니다.');
    cardImageFileEl.value = '';
    clearUploadPreview();
    return;
  }

  var reader = new FileReader();
  reader.onload = function(event) {
    validateImageDimensions(event.target.result).then(function(result) {
      if (!result.ok) {
        setMessage(result.message);
        cardImageFileEl.value = '';
        clearUploadPreview();
        return;
      }
      setUploadPreview(event.target.result, file.name);
      setMessage('업로드 가능한 이미지입니다.');
    });
  };
  reader.readAsDataURL(file);
});

document.getElementById('loadCustomBtn').addEventListener('click', loadCustomSet);
document.getElementById('flipAllBtn').addEventListener('click', flipAllCards);
document.getElementById('resetFlipBtn').addEventListener('click', resetFlips);
document.getElementById('saveCustomBtn').addEventListener('click', saveCustomCards);
document.getElementById('clearCustomBtn').addEventListener('click', clearCustomSet);
document.getElementById('addCardBtn').addEventListener('click', addCustomCard);
document.getElementById('updateCardBtn').addEventListener('click', updateCustomCard);
document.getElementById('cancelEditBtn').addEventListener('click', function() {
  clearForm();
  setMessage('수정을 취소했습니다.');
});

renderCustomList();
renderCards();
clearUploadPreview();
