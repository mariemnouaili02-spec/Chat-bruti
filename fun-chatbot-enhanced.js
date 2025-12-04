// Brouti AI Enhanced - Multi-language AI-powered fun chatbot

const conversation = document.getElementById('conversation');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const status = document.getElementById('status');
const botNameInput = document.getElementById('bot-name');
const botStyle = document.getElementById('bot-style');
const language = document.getElementById('language');
const clearBtn = document.getElementById('clear');
const exportBtn = document.getElementById('export');
const randomizeBtn = document.getElementById('randomize');
const useLLM = document.getElementById('use-llm');
const llmKey = document.getElementById('llm-key');
const llmModel = document.getElementById('llm-model');
const settingsPanel = document.getElementById('settings-panel');
const toggleSettingsBtn = document.getElementById('toggle-settings');
const sendBtn = document.getElementById('send-btn');
const headerDesc = document.getElementById('header-desc');

let convo = [];
let isLoading = false;

// Multi-language strings
const translations = {
  french: {
    headerDesc: "Le chatbot hilarant qui parle n'importe quoi avec style",
    placeholder: "Dites quelque chose... ou pas 😏",
    ready: "Prêt à dire n'importe quoi! 🚀",
    thinking: "🤔 Brouti réfléchit...",
    done: "✨ Prêt pour plus de folie! ✨",
    cleared: "Conversation effacée! 🗑️",
    exported: "Conversation exportée! 💾",
    randomized: "Personnalité randomisée! 🎲",
    welcome: "Salut! Je suis Brouti et je suis ici pour dire n'importe quoi! 🤪",
    tip: "💡 Conseil: Pose-moi des questions bizarres!",
  },
  english: {
    headerDesc: "The hilarious chatbot that talks nonsense with style",
    placeholder: "Say something... or not 😏",
    ready: "Ready to talk nonsense! 🚀",
    thinking: "🤔 Brouti is thinking...",
    done: "✨ Ready for more chaos! ✨",
    cleared: "Conversation cleared! 🗑️",
    exported: "Conversation exported! 💾",
    randomized: "Personality randomized! 🎲",
    welcome: "Hey! I'm Brouti and I'm here to talk total nonsense! 🤪",
    tip: "💡 Tip: Ask me weird questions!",
  },
  german: {
    headerDesc: "Der lustige Chatbot, der Unsinn mit Stil spricht",
    placeholder: "Sag etwas... oder nicht 😏",
    ready: "Bereit, Unsinn zu reden! 🚀",
    thinking: "🤔 Brouti denkt nach...",
    done: "✨ Bereit für mehr Chaos! ✨",
    cleared: "Unterhaltung gelöscht! 🗑️",
    exported: "Unterhaltung exportiert! 💾",
    randomized: "Persönlichkeit randomisiert! 🎲",
    welcome: "Hallo! Ich bin Brouti und rede nur Unsinn! 🤪",
    tip: "💡 Tipp: Stell mir seltsame Fragen!",
  },
  spanish: {
    headerDesc: "El chatbot hilarante que habla tonterías con estilo",
    placeholder: "Di algo... o no 😏",
    ready: "¡Listo para hablar tonterías! 🚀",
    thinking: "🤔 Brouti está pensando...",
    done: "✨ ¡Listo para más caos! ✨",
    cleared: "¡Conversación borrada! 🗑️",
    exported: "¡Conversación exportada! 💾",
    randomized: "¡Personalidad aleatoria! 🎲",
    welcome: "¡Hola! ¡Soy Brouti y hablo puras tonterías! 🤪",
    tip: "💡 Consejo: ¡Hazme preguntas raras!",
  },
  italian: {
    headerDesc: "Il chatbot esilarante che parla sciocchezze con stile",
    placeholder: "Di' qualcosa... o no 😏",
    ready: "Pronto a dire sciocchezze! 🚀",
    thinking: "🤔 Brouti sta pensando...",
    done: "✨ Pronto per più caos! ✨",
    cleared: "Conversazione cancellata! 🗑️",
    exported: "Conversazione esportata! 💾",
    randomized: "Personalità casualizzata! 🎲",
    welcome: "Ciao! Sono Brouti e dico solo sciocchezze! 🤪",
    tip: "💡 Consiglio: Fammi domande strane!",
  },
  portuguese: {
    headerDesc: "O chatbot hilariante que fala besteiras com estilo",
    placeholder: "Diga algo... ou não 😏",
    ready: "Pronto para falar besteiras! 🚀",
    thinking: "🤔 Brouti está pensando...",
    done: "✨ Pronto para mais caos! ✨",
    cleared: "Conversa limpa! 🗑️",
    exported: "Conversa exportada! 💾",
    randomized: "Personalidade aleatorizada! 🎲",
    welcome: "Oi! Sou Brouti e falo só besteiras! 🤪",
    tip: "💡 Dica: Faça-me perguntas estranhas!",
  },
  dutch: {
    headerDesc: "De hilarische chatbot die onzin spreekt met stijl",
    placeholder: "Zeg iets... of niet 😏",
    ready: "Klaar om onzin te praten! 🚀",
    thinking: "🤔 Brouti denkt na...",
    done: "✨ Klaar voor meer chaos! ✨",
    cleared: "Gesprek gewist! 🗑️",
    exported: "Gesprek geëxporteerd! 💾",
    randomized: "Persoonlijkheid gerandomiseerd! 🎲",
    welcome: "Hallo! Ik ben Brouti en ik zeg alleen onzin! 🤪",
    tip: "💡 Tip: Stel me rare vragen!",
  },
};

function getLanguage() {
  let lang = language.value;
  if (lang === 'random') {
    const langs = Object.keys(translations);
    lang = langs[Math.floor(Math.random() * langs.length)];
  }
  return lang;
}

function t(key) {
  const lang = getLanguage();
  return translations[lang]?.[key] || translations.english[key];
}

// Emoji generator
function generateEmojiFor(text) {
  const lower = text.toLowerCase();
  const emojiMap = {
    cat: '🐱', dog: '🐶', food: '🍕', love: '❤️', happy: '😊', sad: '😭',
    money: '💰', pizza: '🍕', code: '💻', bug: '🐛', fire: '🔥', ice: '🧊',
    dance: '💃', party: '🎉', brain: '🧠', alien: '👽', robot: '🤖', ghost: '👻',
  };
  
  let emojis = [];
  Object.keys(emojiMap).forEach(key => {
    if (lower.includes(key)) {
      emojis.push(emojiMap[key]);
    }
  });
  
  const randomEmojis = ['🎪', '🎭', '🎬', '🎸', '🎨', '🧩', '🎯', '🎲'];
  if (emojis.length < 2) {
    emojis.push(randomEmojis[Math.floor(Math.random() * randomEmojis.length)]);
  }
  
  return emojis.slice(0, 3);
}

// Rule-based replies with AI fallback
function getRuleBasedReply(text) {
  const lang = getLanguage();
  const rnd = Math.random();
  
  // 20% pure chaos
  if (rnd < 0.2) {
    const chaos = [
      "BZZZZZZT! 🤖",
      "Wut? 🤯",
      text.split('').reverse().join(''),
      "YES! NO! MAYBE! 🎲",
    ];
    return chaos[Math.floor(Math.random() * chaos.length)];
  }
  
  // 80% fun response with engagement
  const engagementHooks = [
    "\n...tu crois? 🤔",
    "\n...raconte moi plus! 👀",
    "\n...et toi? 🧠",
    "\n...attends la suite! 🎭",
    "\n...c'est fou non? 🤪",
  ];
  
  const responses = [
    "Absolument! Ou pas. Qui sait? 🤷",
    "Bien sûr! Genre... vraiment? 😲",
    "C'est logique! (complètement faux) 🙃",
  ];
  
  let reply = responses[Math.floor(Math.random() * responses.length)];
  if (Math.random() < 0.6) {
    reply += engagementHooks[Math.floor(Math.random() * engagementHooks.length)];
  }
  
  return reply;
}

// LLM-powered response
async function callLLM(text) {
  if (!llmKey.value.trim()) throw new Error('No API key');
  
  const lang = getLanguage();
  const langNames = {
    french: 'French',
    english: 'English',
    german: 'German',
    spanish: 'Spanish',
    italian: 'Italian',
    portuguese: 'Portuguese',
    dutch: 'Dutch',
  };
  
  const styleDesc = {
    silly: 'silly and absurd',
    conflicted: 'contradictory and confusing',
    memey: 'full of memes and Gen Z slang',
    mix: 'a mix of silly, contradictory, and memes',
  };
  
  const systemMsg = `You are ${botNameInput.value}, a ${styleDesc[botStyle.value]} chatbot. 
  Always respond in ${langNames[lang]}.
  Keep responses short (max 80 words), funny, and add engagement questions to keep users chatting.
  Use emojis liberally. Be playful and never serious.`;
  
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${llmKey.value}`
    },
    body: JSON.stringify({
      model: llmModel.value,
      messages: [
        { role: 'system', content: systemMsg },
        { role: 'user', content: text }
      ],
      temperature: 0.9,
      max_tokens: 150
    })
  });
  
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || 'LLM Error');
  }
  
  const data = await res.json();
  return data.choices[0].message.content;
}

// Add message to UI
function appendMessage(who, text, emojis = []) {
  const el = document.createElement('div');
  el.className = 'msg ' + who;
  const content = document.createElement('div');
  content.className = 'msg-content';
  content.textContent = text;
  el.appendChild(content);
  
  if (emojis.length > 0 && who === 'bot') {
    const emojiDiv = document.createElement('div');
    emojiDiv.className = 'msg-emoji';
    emojiDiv.textContent = emojis.join(' ');
    el.appendChild(emojiDiv);
  }
  
  conversation.appendChild(el);
  conversation.scrollTop = conversation.scrollHeight;
}

// Show loading
function showLoading() {
  const el = document.createElement('div');
  el.className = 'msg bot';
  const content = document.createElement('div');
  content.className = 'msg-content';
  content.innerHTML = '<div class="loading"><div class="loading-dot"></div><div class="loading-dot"></div><div class="loading-dot"></div></div>';
  el.appendChild(content);
  conversation.appendChild(el);
  conversation.scrollTop = conversation.scrollHeight;
}

// Handle user message
chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (isLoading) return;
  
  const text = userInput.value.trim();
  if (!text) return;
  
  isLoading = true;
  sendBtn.disabled = true;
  appendMessage('user', text);
  convo.push({ who: 'user', text });
  userInput.value = '';
  
  status.textContent = t('thinking');
  showLoading();
  
  try {
    let reply;
    
    if (useLLM.checked && llmKey.value.trim()) {
      try {
        reply = await callLLM(text);
      } catch (err) {
        reply = getRuleBasedReply(text) + '\n(AI unavailable, fallback mode)';
      }
    } else {
      reply = getRuleBasedReply(text);
    }
    
    const lastMsg = conversation.lastChild;
    if (lastMsg && lastMsg.querySelector('.loading')) {
      conversation.removeChild(lastMsg);
    }
    
    const emojis = generateEmojiFor(text);
    appendMessage('bot', reply, emojis);
    convo.push({ who: 'bot', text: reply, emojis });
    status.textContent = t('done');
  } catch (err) {
    status.textContent = '❌ Error: ' + err.message;
  } finally {
    isLoading = false;
    sendBtn.disabled = false;
  }
});

// Clear
clearBtn.addEventListener('click', () => {
  conversation.innerHTML = '';
  convo = [];
  status.textContent = t('cleared');
});

// Export
exportBtn.addEventListener('click', () => {
  const text = convo.map(c => `${c.who.toUpperCase()}: ${c.text}`).join('\n');
  const blob = new Blob([text], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'brouti-convo.txt';
  a.click();
  status.textContent = t('exported');
});

// Randomize
randomizeBtn.addEventListener('click', () => {
  const styles = ['silly', 'conflicted', 'memey', 'mix'];
  botStyle.value = styles[Math.floor(Math.random() * styles.length)];
  status.textContent = t('randomized');
});

// Update UI language
language.addEventListener('change', () => {
  userInput.placeholder = t('placeholder');
  headerDesc.textContent = t('headerDesc');
  status.textContent = t('ready');
});

// Toggle settings
toggleSettingsBtn.addEventListener('click', () => {
  settingsPanel.classList.toggle('show');
  toggleSettingsBtn.textContent = settingsPanel.classList.contains('show') ? '⚙️ Hide' : '⚙️ Settings';
});

// Welcome
function showWelcome() {
  conversation.innerHTML = `
    <div class="welcome-screen">
      <div style="font-size: 64px;">🤪</div>
      <h2>Brouti AI</h2>
      <p>${t('welcome')}</p>
      <p style="margin-top: 20px; font-size: 13px; color: #667eea;">${t('tip')}</p>
    </div>
  `;
}

showWelcome();
userInput.placeholder = t('placeholder');
headerDesc.textContent = t('headerDesc');
