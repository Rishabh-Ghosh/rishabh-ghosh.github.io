let currentChatId = null;
let currentModel = 'deepseek-r1:1.5b';
let systemPrompt = "You are a helpful, concise, private AI assistant running locally on edge hardware. Respond accurately and clearly.";
let temperature = 0.7;
let currentMessages = [];
let isGenerating = false;
let activeAbortController = null;

// DOM Elements
const messagesContainer = document.getElementById('messagesContainer');
const welcomeCard = document.getElementById('welcomeCard');
const promptInput = document.getElementById('promptInput');
const sendBtn = document.getElementById('sendBtn');
const chatForm = document.getElementById('chatForm');
const modelSelect = document.getElementById('modelSelect');
const currentModelBadge = document.getElementById('currentModelBadge');
const chatHistoryList = document.getElementById('chatHistoryList');
const newChatBtn = document.getElementById('newChatBtn');
const connectionStatus = document.getElementById('connectionStatus');
const mobileToggleBtn = document.getElementById('mobileToggleBtn');
const sidebar = document.getElementById('sidebar');
const pullModelBtn = document.getElementById('pullModelBtn');
const killEngineBtn = document.getElementById('killEngineBtn');

// Modal Elements
const settingsModal = document.getElementById('settingsModal');
const settingsBtn = document.getElementById('settingsBtn');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');
const systemPromptInput = document.getElementById('systemPromptInput');
const temperatureInput = document.getElementById('temperatureInput');
const tempValue = document.getElementById('tempValue');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkConnectionStatus();
    loadChatHistory();
    setupEventListeners();
    setInterval(checkConnectionStatus, 10000);
});

function setupEventListeners() {
    promptInput.addEventListener('input', () => {
        promptInput.style.height = 'auto';
        promptInput.style.height = Math.min(promptInput.scrollHeight, 160) + 'px';
        sendBtn.disabled = promptInput.value.trim() === '' || isGenerating;
    });

    promptInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (promptInput.value.trim() !== '' && !isGenerating) {
                sendMessage();
            }
        }
    });

    sendBtn.addEventListener('click', sendMessage);
    newChatBtn.addEventListener('click', createNewChat);

    modelSelect.addEventListener('change', (e) => {
        currentModel = e.target.value;
        const selectedOption = e.target.options[e.target.selectedIndex].text;
        currentModelBadge.textContent = selectedOption.replace(/^[^\w]+/, '');
    });

    mobileToggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    pullModelBtn.addEventListener('click', pullModelPrompt);
    if (killEngineBtn) {
        killEngineBtn.addEventListener('click', killAndResetLLM);
    }

    // Settings Modal
    settingsBtn.addEventListener('click', () => {
        systemPromptInput.value = systemPrompt;
        temperatureInput.value = temperature;
        tempValue.textContent = temperature;
        settingsModal.classList.add('open');
    });

    closeSettingsBtn.addEventListener('click', () => {
        settingsModal.classList.remove('open');
    });

    temperatureInput.addEventListener('input', (e) => {
        tempValue.textContent = e.target.value;
    });

    saveSettingsBtn.addEventListener('click', () => {
        systemPrompt = systemPromptInput.value;
        temperature = parseFloat(temperatureInput.value);
        settingsModal.classList.remove('open');
    });
}

async function checkConnectionStatus() {
    try {
        const res = await fetch('/api/status');
        const data = await res.json();
        const dot = connectionStatus.querySelector('.status-dot');
        const text = connectionStatus.querySelector('.status-text');

        if (data.online) {
            dot.className = 'status-dot online';
            text.textContent = `PC Ollama Online (${data.models.length} models)`;
        } else {
            dot.className = 'status-dot offline';
            text.textContent = 'PC Offline / Local Fallback';
        }
    } catch (err) {
        const dot = connectionStatus.querySelector('.status-dot');
        const text = connectionStatus.querySelector('.status-text');
        dot.className = 'status-dot offline';
        text.textContent = 'Backend Offline';
    }
}

async function loadChatHistory() {
    try {
        const res = await fetch('/api/chats');
        const chats = await res.json();
        chatHistoryList.innerHTML = '';

        chats.forEach(chat => {
            const item = document.createElement('div');
            item.className = `history-item ${chat.id === currentChatId ? 'active' : ''}`;
            item.innerHTML = `
                <span>💬 ${escapeHtml(chat.title)}</span>
                <button class="delete-chat-btn" onclick="deleteChat('${chat.id}', event)">✕</button>
            `;
            item.onclick = (e) => {
                if (!e.target.classList.contains('delete-chat-btn')) {
                    selectChat(chat.id);
                }
            };
            chatHistoryList.appendChild(item);
        });
    } catch (err) {
        console.error('Failed to load chat history', err);
    }
}

async function createNewChat() {
    currentChatId = 'chat_' + Date.now();
    currentMessages = [];
    messagesContainer.innerHTML = '';
    messagesContainer.appendChild(welcomeCard);
    welcomeCard.style.display = 'flex';
    loadChatHistory();
    if (window.innerWidth <= 768) sidebar.classList.remove('open');
}

async function selectChat(chatId) {
    currentChatId = chatId;
    welcomeCard.style.display = 'none';
    messagesContainer.innerHTML = '';

    try {
        const res = await fetch(`/api/chats/${chatId}`);
        const messages = await res.json();
        currentMessages = messages.map(m => ({ role: m.role, content: m.content }));

        messages.forEach(msg => {
            appendMessageUI(msg.role, msg.content);
        });

        loadChatHistory();
        scrollToBottom();
        if (window.innerWidth <= 768) sidebar.classList.remove('open');
    } catch (err) {
        console.error('Failed to load messages', err);
    }
}

async function deleteChat(chatId, event) {
    event.stopPropagation();
    try {
        await fetch(`/api/chats/${chatId}`, { method: 'DELETE' });
        if (currentChatId === chatId) {
            createNewChat();
        } else {
            loadChatHistory();
        }
    } catch (err) {
        console.error('Failed to delete chat', err);
    }
}

function usePrompt(text) {
    promptInput.value = text;
    promptInput.dispatchEvent(new Event('input'));
    sendMessage();
}

async function sendMessage() {
    const text = promptInput.value.trim();
    if (!text || isGenerating) return;

    if (!currentChatId) {
        currentChatId = 'chat_' + Date.now();
    }

    welcomeCard.style.display = 'none';
    promptInput.value = '';
    promptInput.style.height = 'auto';
    sendBtn.disabled = true;
    isGenerating = true;

    // Append User Message
    currentMessages.push({ role: 'user', content: text });
    appendMessageUI('user', text);
    scrollToBottom();

    // Create Assistant Placeholder
    const assistantWrapper = createMessageWrapper('assistant');
    const bubble = assistantWrapper.querySelector('.message-bubble');
    bubble.innerHTML = '<span class="typing-indicator">Thinking...</span>';
    messagesContainer.appendChild(assistantWrapper);
    scrollToBottom();

    let fullAssistantResponse = '';

    activeAbortController = new AbortController();
    try {
        const response = await fetch('/api/chat/stream', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: activeAbortController.signal,
            body: JSON.stringify({
                chat_id: currentChatId,
                model: currentModel,
                messages: currentMessages,
                system_prompt: systemPrompt,
                temperature: temperature
            })
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        bubble.innerHTML = '';

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    try {
                        const jsonStr = line.replace('data: ', '').trim();
                        if (!jsonStr) continue;
                        const data = JSON.parse(jsonStr);

                        if (data.error) {
                            bubble.innerHTML = `<span style="color: #ef4444;">⚠️ ${escapeHtml(data.error)}</span>`;
                            break;
                        }

                        if (data.token) {
                            fullAssistantResponse += data.token;
                            bubble.innerHTML = renderMarkdown(fullAssistantResponse);
                            highlightCodeBlocks(bubble);
                            scrollToBottom();
                        }
                    } catch (e) {
                        // Partial JSON stream line
                    }
                }
            }
        }

        currentMessages.push({ role: 'assistant', content: fullAssistantResponse });
        loadChatHistory();
    } catch (err) {
        bubble.innerHTML = `<span style="color: #ef4444;">⚠️ Connection Error: ${escapeHtml(err.message)}</span>`;
    } finally {
        isGenerating = false;
        sendBtn.disabled = false;
    }
}

function appendMessageUI(role, content) {
    const wrapper = createMessageWrapper(role);
    const bubble = wrapper.querySelector('.message-bubble');
    bubble.innerHTML = renderMarkdown(content);
    highlightCodeBlocks(bubble);
    messagesContainer.appendChild(wrapper);
}

function createMessageWrapper(role) {
    const wrapper = document.createElement('div');
    wrapper.className = `message-wrapper ${role}`;

    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.textContent = role === 'user' ? '👤' : '🤖';

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';

    wrapper.appendChild(avatar);
    wrapper.appendChild(bubble);
    return wrapper;
}

function renderMarkdown(text) {
    if (typeof marked !== 'undefined') {
        return marked.parse(text);
    }
    return escapeHtml(text);
}

function highlightCodeBlocks(container) {
    if (typeof hljs !== 'undefined') {
        container.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
            if (!block.parentElement.querySelector('.code-header')) {
                const header = document.createElement('div');
                header.className = 'code-header';
                header.innerHTML = `<span>Code</span><button class="copy-code-btn" onclick="copyCode(this)">Copy</button>`;
                block.parentElement.insertBefore(header, block);
            }
        });
    }
}

function copyCode(btn) {
    const code = btn.parentElement.nextElementSibling.textContent;
    navigator.clipboard.writeText(code).then(() => {
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
    });
}

async function pullModelPrompt() {
    const modelName = prompt('Enter Ollama edge model tag to pull (e.g. codegemma:2b, deepseek-r1:1.5b, llama3.2:1b):', currentModel);
    if (!modelName) return;

    alert(`Pulling ${modelName} in background. Make sure Ollama is running on your PC!`);
    try {
        const res = await fetch('/api/models/pull', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model: modelName })
        });
        const reader = res.body.getReader();
        while (true) {
            const { done } = await reader.read();
            if (done) break;
        }
        checkConnectionStatus();
    } catch (err) {
        alert('Failed to pull model: ' + err.message);
    }
}

async function killAndResetLLM() {
    if (activeAbortController) {
        activeAbortController.abort();
        activeAbortController = null;
    }
    isGenerating = false;
    sendBtn.disabled = false;

    try {
        const res = await fetch('/api/engine/kill', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model: currentModel })
        });
        const data = await res.json();
        alert('⚡ LLM Engine Reset!\n' + (data.message || 'Model unloaded from RAM/VRAM.'));
        checkConnectionStatus();
    } catch (err) {
        alert('Failed to reset LLM engine: ' + err.message);
    }
}

function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
