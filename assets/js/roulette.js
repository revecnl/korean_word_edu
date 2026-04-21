const STORAGE_KEYS = {
            state: 'eduRouletteSavedStateV2',
            customPresets: 'eduRouletteCustomPresetsV2'
        };

        const defaultState = {
            leftInput: '아버지, 어머니, 형, 오빠, 누나, 언니, 동생, 나',
            rightInput: '경찰관, 학생, 공무원, 소방관, 운동선수, 회사원, 선생님, 의사',
            sentence: ''
        };

        const builtInPresets = {
            국가: '한국, 중국, 일본, 미국, 베트남, 태국, 말레이시아, 몽골',
            직업: '학생, 회사원, 의사, 선생님, 경찰관, 소방관, 공무원, 요리사',
            가족: '아버지, 어머니, 형, 오빠, 누나, 언니, 동생, 할머니',
            물건: '책, 가방, 휴대전화, 컴퓨터, 시계, 안경, 우산, 의자',
            장소: '학교, 회사, 집, 도서관, 병원, 식당, 은행, 공원'
        };

        let leftData = [];
        let rightData = [];
        let customPresets = [];
        const slotHeight = 80;
        let statusTimer = null;

        function parseWords(text) {
            return text
                .split(',')
                .map(word => word.trim())
                .filter(word => word !== '');
        }

        function showStatus(message, type = 'info') {
            const statusBar = document.getElementById('statusBar');
            const colorMap = {
                info: '#2c3e50',
                success: '#16a34a',
                error: '#dc2626'
            };
            statusBar.textContent = message;
            statusBar.style.color = colorMap[type] || colorMap.info;
            clearTimeout(statusTimer);
            statusTimer = setTimeout(() => {
                statusBar.textContent = '';
            }, 2200);
        }

        function updateWords(showMessage = true) {
            const leftInput = document.getElementById('leftWordsInput').value;
            const rightInput = document.getElementById('rightWordsInput').value;

            leftData = parseWords(leftInput);
            rightData = parseWords(rightInput);

            if (leftData.length === 0 || rightData.length === 0) {
                showStatus('왼쪽과 오른쪽 단어를 모두 입력해 주세요.', 'error');
                return;
            }

            renderSlot('leftList', leftData);
            renderSlot('rightList', rightData);
            resetPosition('leftList');
            resetPosition('rightList');

            if (showMessage) {
                showStatus('단어가 업데이트되었습니다.', 'success');
            }
        }

        function renderSlot(id, data) {
            const el = document.getElementById(id);
            let html = '';
            for (let i = 0; i < 15; i++) {
                data.forEach(word => {
                    html += `<li class="slot-item">${escapeHtml(word)}</li>`;
                });
            }
            el.innerHTML = html;
        }

        function resetPosition(id) {
            const el = document.getElementById(id);
            el.style.transition = 'none';
            el.style.transform = 'translateY(0)';
        }

        function spin(side, btn) {
            const list = document.getElementById(side + 'List');
            const data = side === 'left' ? leftData : rightData;

            if (!data.length) {
                showStatus('먼저 단어를 업데이트해 주세요.', 'error');
                return;
            }

            btn.disabled = true;
            list.style.transition = 'none';
            list.style.transform = 'translateY(0)';
            list.offsetHeight;

            const randomIndex = Math.floor(Math.random() * data.length);
            const moveY = ((data.length * 8) + randomIndex) * slotHeight;

            list.style.transition = 'transform 2s cubic-bezier(0.15, 0, 0.15, 1)';
            list.style.transform = `translateY(-${moveY}px)`;

            setTimeout(() => {
                btn.disabled = false;
            }, 2000);
        }

        function renderBuiltInPresets() {
            const container = document.getElementById('presetButtons');
            container.innerHTML = '';

            Object.entries(builtInPresets).forEach(([name, words]) => {
                const button = document.createElement('button');
                button.className = 'preset-btn';
                button.textContent = `${name} 복사`;
                button.title = words;
                button.onclick = () => copyPreset(words, `${name} 프리셋이 복사되었습니다.`);
                container.appendChild(button);
            });
        }

        async function copyPreset(words, message = '복사되었습니다.') {
            const ok = await copyText(words);
            if (ok) {
                showStatus(message, 'success');
            } else {
                showStatus('복사에 실패했습니다. 직접 선택해 복사해 주세요.', 'error');
            }
        }

        async function copyText(text) {
            try {
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(text);
                    return true;
                }
            } catch (e) {}

            try {
                const temp = document.createElement('textarea');
                temp.value = text;
                temp.style.position = 'fixed';
                temp.style.left = '-9999px';
                document.body.appendChild(temp);
                temp.focus();
                temp.select();
                const ok = document.execCommand('copy');
                document.body.removeChild(temp);
                return ok;
            } catch (e) {
                return false;
            }
        }

        function saveCustomPreset() {
            const name = document.getElementById('customPresetName').value.trim();
            const target = document.getElementById('customPresetTarget').value;
            const wordsText = document.getElementById('customPresetWords').value.trim();
            const wordsArray = parseWords(wordsText);

            if (!name) {
                showStatus('커스텀 프리셋 이름을 입력해 주세요.', 'error');
                return;
            }

            if (wordsArray.length === 0) {
                showStatus('커스텀 프리셋 단어를 입력해 주세요.', 'error');
                return;
            }

            const preset = {
                id: Date.now().toString(),
                name,
                target,
                words: wordsArray.join(', ')
            };

            customPresets.push(preset);
            persistCustomPresets();
            renderCustomPresets();

            document.getElementById('customPresetName').value = '';
            document.getElementById('customPresetWords').value = '';
            document.getElementById('customPresetTarget').value = 'both';

            showStatus('커스텀 프리셋이 저장되었습니다.', 'success');
        }

        function renderCustomPresets() {
            const container = document.getElementById('customPresetButtons');
            container.innerHTML = '';

            if (customPresets.length === 0) {
                container.innerHTML = '<span style="color:#6b7280;">저장된 커스텀 프리셋이 없습니다.</span>';
                return;
            }

            customPresets.forEach(preset => {
                const card = document.createElement('div');
                card.className = 'custom-card';
                card.title = `${preset.name}: ${preset.words}`;

                const label = document.createElement('span');
                const targetLabelMap = { both: '공용', left: '왼쪽', right: '오른쪽' };
                label.textContent = `${preset.name} (${targetLabelMap[preset.target] || '공용'})`;
                card.appendChild(label);

                const copyBtn = document.createElement('button');
                copyBtn.className = 'mini-btn';
                copyBtn.textContent = '복사';
                copyBtn.onclick = () => copyPreset(preset.words, `${preset.name} 프리셋이 복사되었습니다.`);
                card.appendChild(copyBtn);

                const applyLeftBtn = document.createElement('button');
                applyLeftBtn.className = 'mini-btn';
                applyLeftBtn.textContent = '왼쪽 적용';
                applyLeftBtn.onclick = () => applyPresetToInput(preset.words, 'left');
                card.appendChild(applyLeftBtn);

                const applyRightBtn = document.createElement('button');
                applyRightBtn.className = 'mini-btn';
                applyRightBtn.textContent = '오른쪽 적용';
                applyRightBtn.onclick = () => applyPresetToInput(preset.words, 'right');
                card.appendChild(applyRightBtn);

                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'mini-btn delete-btn';
                deleteBtn.textContent = '삭제';
                deleteBtn.onclick = () => deleteCustomPreset(preset.id);
                card.appendChild(deleteBtn);

                container.appendChild(card);
            });
        }

        function applyPresetToInput(words, side) {
            const inputId = side === 'left' ? 'leftWordsInput' : 'rightWordsInput';
            document.getElementById(inputId).value = words;
            updateWords(false);
            showStatus(`${side === 'left' ? '왼쪽' : '오른쪽'} 입력칸에 적용되었습니다.`, 'success');
        }

        function deleteCustomPreset(id) {
            customPresets = customPresets.filter(preset => preset.id !== id);
            persistCustomPresets();
            renderCustomPresets();
            showStatus('커스텀 프리셋이 삭제되었습니다.', 'success');
        }

        function persistCustomPresets() {
            localStorage.setItem(STORAGE_KEYS.customPresets, JSON.stringify(customPresets));
        }

        function loadCustomPresets() {
            const saved = localStorage.getItem(STORAGE_KEYS.customPresets);
            if (!saved) {
                customPresets = [];
                return;
            }

            try {
                customPresets = JSON.parse(saved) || [];
            } catch (e) {
                customPresets = [];
            }
        }

        function saveCurrentState() {
            const state = {
                leftInput: document.getElementById('leftWordsInput').value,
                rightInput: document.getElementById('rightWordsInput').value,
                sentence: document.getElementById('sentenceBox').value
            };
            localStorage.setItem(STORAGE_KEYS.state, JSON.stringify(state));
            showStatus('현재 상태가 브라우저에 저장되었습니다.', 'success');
        }

        function loadSavedState() {
            const saved = localStorage.getItem(STORAGE_KEYS.state);
            const state = saved ? safeParse(saved, defaultState) : defaultState;

            document.getElementById('leftWordsInput').value = state.leftInput || defaultState.leftInput;
            document.getElementById('rightWordsInput').value = state.rightInput || defaultState.rightInput;
            document.getElementById('sentenceBox').value = state.sentence || '';
        }

        function safeParse(text, fallback) {
            try {
                return JSON.parse(text);
            } catch (e) {
                return fallback;
            }
        }

        function resetAll() {
            const shouldReset = confirm('현재 입력값, 저장된 상태, 커스텀 프리셋을 모두 초기화할까요?');
            if (!shouldReset) return;

            localStorage.removeItem(STORAGE_KEYS.state);
            localStorage.removeItem(STORAGE_KEYS.customPresets);
            customPresets = [];

            document.getElementById('leftWordsInput').value = defaultState.leftInput;
            document.getElementById('rightWordsInput').value = defaultState.rightInput;
            document.getElementById('sentenceBox').value = '';
            document.getElementById('customPresetName').value = '';
            document.getElementById('customPresetWords').value = '';
            document.getElementById('customPresetTarget').value = 'both';

            renderCustomPresets();
            updateWords(false);
            showStatus('초기화되었습니다.', 'success');
        }

        function escapeHtml(text) {
            return text
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }

        function init() {
            loadSavedState();
            loadCustomPresets();
            renderBuiltInPresets();
            renderCustomPresets();
            updateWords(false);
        }

        init();
