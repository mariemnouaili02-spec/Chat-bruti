// Brouti AI - Fun Chatbot with Playful Dialect, Conflicts, Memes & AI Emojis

const conversation = document.getElementById('conversation');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const status = document.getElementById('status');
const botNameInput = document.getElementById('bot-name');
const botStyle = document.getElementById('bot-style');
const clearBtn = document.getElementById('clear');
const exportBtn = document.getElementById('export');
const randomizeBtn = document.getElementById('randomize');
const useLLM = document.getElementById('use-llm');
const llmKey = document.getElementById('llm-key');
const llmModel = document.getElementById('llm-model');
const settingsPanel = document.getElementById('settings-panel');
const toggleSettingsBtn = document.getElementById('toggle-settings');

let convo = [];
let isLoading = false;

// Emoji generator based on keywords
function generateEmojiFor(text) {
  const lower = text.toLowerCase();
  const emojiMap = {
    cat: '🐱', dog: '🐶', food: '🍕', love: '❤️', happy: '😊', sad: '😭',
    money: '💰', pizza: '🍕', coding: '💻', bug: '🐛', fire: '🔥', ice: '🧊',
    dance: '💃', party: '🎉', brain: '🧠', alien: '👽', robot: '🤖', ghost: '👻',
    diamond: '💎', apple: '🍎', banana: '🍌', moon: '🌙', sun: '☀️', star: '⭐',
  };
  
  let emojis = [];
  Object.keys(emojiMap).forEach(key => {
    if (lower.includes(key)) {
      emojis.push(emojiMap[key]);
    }
  });
  
  // Add random fun emojis
  const randomEmojis = ['🎪', '🎭', '🎬', '🎸', '🎨', '🧩', '🎯', '🎲'];
  if (emojis.length < 3) {
    emojis.push(randomEmojis[Math.floor(Math.random() * randomEmojis.length)]);
  }
  
  return emojis.length > 0 ? emojis : ['🤪', '😜', '🤣'];
}

// Silly reply generator
function sillReply(text) {
  const sillyPrefixes = [
    "Bzzzzt! Mon cerveau dit que...",
    "Selon mes calculs aléatoires...",
    "Les pigeons m'ont soufflé à l'oreille que...",
    "Si je ne me trompe pas (ce qui arrive souvent)...",
    "Mon ami imaginaire dit que...",
    "Honnêtement (pas honnêtement)...",
  ];
  
  const sillySuffixes = [
    "...mais aussi l'inverse est vrai!",
    "...ou peut-être que c'est faux, qui sait? 🤷",
    "...sauf le mardi, c'est différent.",
    "...ou du moins c'est ce que prétend ma cafetière.",
    "...probablement. Peut-être. Pas du tout.",
    "...c'est scientifique... non c'est pas vrai.",
  ];
  
  const sillyMemes = [
    "This is the way.",
    "Stonks 📈",
    "Much wow, such chat.",
    "It's not a bug, it's a feature.",
    "Big brain energy detected! 🧠",
    "No cap fr fr.",
    "Bussin no shot fam.",
  ];
  
  // 80% normal response, 20% random chaos
  const rnd = Math.random();
  if (rnd < 0.2) {
    // Pure chaos
    return sillyMemes[Math.floor(Math.random() * sillyMemes.length)];
  }
  
  // Normal funny response
  const choices = [
    sillyPrefixes[Math.floor(Math.random() * sillyPrefixes.length)] + " " +
    text.split(' ').reverse().slice(0, 3).join(' ') +
    " " + sillySuffixes[Math.floor(Math.random() * sillySuffixes.length)],
    
    "Oui non oui non... bah du coup OUI! (ou non)",
  ];
  
  return choices[Math.floor(Math.random() * choices.length)];
}

// Conflicted reply - says opposite things
function conflictedReply(text) {
  // 80% normal conflicted, 20% random
  const rnd = Math.random();
  
  const statements = [
    "Je suis 100% d'accord... et aussi 100% en désaccord.",
    "C'est vrai que non, mais faux que oui.",
    "Absolument impossible! Et oui, c'est possible!",
    "Je pense que tu as raison. Non attends, tu as complètement tort. Attends... tu as raison?",
    "Selon ma logique: Vrai = Faux, Faux = Vrai, Chat = Chien 🐱🐶",
    "Oui et non. Mais surtout peut-être. Définitivement peut-être.",
  ];
  
  if (rnd < 0.2) {
    // Random chaos
    return "Hein? Quoi? " + text.charAt(0).toUpperCase() + text.slice(1) + "... c'est quoi déjà? 🤯";
  }
  
  return statements[Math.floor(Math.random() * statements.length)] + " 🤔🤔🤔";
}

// Memey reply
function memeyReply(text) {
  // 80% normal memes, 20% random
  const rnd = Math.random();
  
  const memes = [
    "Tu sais ce c'est drôle? " + text.toUpperCase() + "!!! 😂",
    "POV: Tu penses que c'est logique 👈😂",
    "Ain't nobody got time for " + text,
    "This is fine. 🔥 Tout va bien. 🔥",
    "Me: *reads* | Also me: " + text + "? WHAT?",
    "Yo, " + text + " hit different tho 💀💀",
    "*Laugh track plays* Oui oui très amusant! *Plus rire* 😅",
  ];
  
  if (rnd < 0.2) {
    // Random chaos
    return "WAIT WHAT?! 🤨 " + text + " + moi = amis forever? Ou pas? 💔";
  }
  
  return memes[Math.floor(Math.random() * memes.length)];
}

// Mix all styles
function mixedReply(text) {
  const styles = [sillReply, conflictedReply, memeyReply];
  const chosen = styles[Math.floor(Math.random() * styles.length)];
  return chosen(text);
}

// Get reply based on style
function getReply(text, style) {
  let baseReply = '';
  
  switch (style) {
    case 'silly': baseReply = sillReply(text); break;
    case 'conflicted': baseReply = conflictedReply(text); break;
    case 'memey': baseReply = memeyReply(text); break;
    case 'mix': baseReply = mixedReply(text); break;
    default: baseReply = sillReply(text);
  }
  
  // Add engagement hooks to keep user chatting
  const engagementHooks = [
    "\n\n...ou tu penses quoi toi? 🤔",
    "\n\n...mais attends, dis-moi plus! 👀",
    "\n\n...et toi, t'en penses quoi? 🧠",
    "\n\n...vraiment? Genre sérieusement? 😲",
    "\n\n...tu vas pas me croire ce qui se passe ensuite! 🎭",
    "\n\n...c'est fou, non? 🤪",
    "\n\n...plus de détails? Je suis tout ouïe! 👂",
  ];
  
  // 60% add engagement hook for more interaction
  if (Math.random() < 0.6) {
    baseReply += engagementHooks[Math.floor(Math.random() * engagementHooks.length)];
  }
  
  return baseReply;
}

// LLM call with better error handling
async function callLLM(text, style) {
  if (!llmKey.value.trim()) throw new Error('Pas de clé LLM');
  
  const styleDesc = {
    silly: 'silly and random',
    conflicted: 'contradictory and confusing',
    memey: 'meme-filled and Gen Z slang',
    mix: 'a mix of all: silly, contradictory, and meme references'
  };
  
  const systemMsg = `Tu es Brouti AI, un chatbot hilarant qui parle ${styleDesc[style]}. 
  Réponds en français avec du style, des emojis, des jeux de mots. Max 100 mots. Sois drôle et absurde!`;
  
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
      max_tokens: 200
    })
  });
  
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || 'LLM Error: ' + res.status);
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

// Show loading animation
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
  appendMessage('user', text);
  convo.push({ who: 'user', text });
  userInput.value = '';
  
  status.textContent = '🤔 Brouti réfléchit...';
  showLoading();
  
  try {
    let reply;
    const style = botStyle.value;
    
    if (useLLM.checked && llmKey.value.trim()) {
      try {
        reply = await callLLM(text, style);
      } catch (err) {
        reply = getReply(text, style) + ' (LLM failed: ' + err.message + ')';
      }
    } else {
      reply = getReply(text, style);
    }
    
    // Remove loading and add real response
    const lastMsg = conversation.lastChild;
    if (lastMsg && lastMsg.querySelector('.loading')) {
      conversation.removeChild(lastMsg);
    }
    
    const emojis = generateEmojiFor(text);
    appendMessage('bot', reply, emojis);
    convo.push({ who: 'bot', text: reply, emojis });
    status.textContent = '✨ Prêt pour plus de folie! ✨';
  } catch (err) {
    status.textContent = '❌ Erreur: ' + err.message;
  } finally {
    isLoading = false;
  }
});

// Clear conversation
clearBtn.addEventListener('click', () => {
  conversation.innerHTML = '';
  convo = [];
  status.textContent = 'Conversation effacée! 🗑️';
});

// Export conversation
exportBtn.addEventListener('click', () => {
  const text = convo.map(c => `${c.who.toUpperCase()}: ${c.text}`).join('\n');
  const blob = new Blob([text], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'brouti-convo.txt';
  a.click();
  status.textContent = 'Conversation exportée! 💾';
});

// Show welcome screen on start
function showWelcomeScreen() {
  conversation.innerHTML = `
    <div class="welcome-screen">
      <div style="font-size: 64px; margin-bottom: 20px;">🤪</div>
      <h2>Welcome to Brouti AI</h2>
      <p>Your hilariously illogical companion for chaotic conversations!</p>
      <div class="feature-cards">
        <div class="feature-card">
          <div class="feature-emoji">😜</div>
          <h3>Silly Responses</h3>
          <p>Random, absurd, and hilarious replies</p>
        </div>
        <div class="feature-card">
          <div class="feature-emoji">🤔</div>
          <h3>Contradictions</h3>
          <p>True and false at the same time!</p>
        </div>
        <div class="feature-card">
          <div class="feature-emoji">🎭</div>
          <h3>Meme Magic</h3>
          <p>Gen Z slang and internet culture</p>
        </div>
      </div>
      <p style="margin-top: 30px; color: #999; font-size: 12px;">Start typing to unleash the chaos! 🚀</p>
      <p style="margin-top: 10px; color: #667eea; font-size: 13px; font-weight: bold;">💡 Tip: Ask me anything. The weirder, the better!</p>
    </div>
  `;
}

// Initialize
showWelcomeScreen();

// Toggle settings panel
toggleSettingsBtn.addEventListener('click', () => {
  settingsPanel.classList.toggle('show');
  toggleSettingsBtn.textContent = settingsPanel.classList.contains('show') ? '⚙️ Hide Settings' : '⚙️ Settings';
});

// Show welcome screen on start
function showWelcomeScreen() {
  conversation.innerHTML = `
    <div class="welcome-screen">
      <div style="font-size: 64px; margin-bottom: 20px;">🤪</div>
      <h2>Welcome to Brouti AI</h2>
      <p>Your hilariously illogical companion for chaotic conversations!</p>
      <div class="feature-cards">
        <div class="feature-card">
          <div class="feature-emoji">😜</div>
          <h3>Silly Responses</h3>
          <p>Random, absurd, and hilarious replies</p>
        </div>
        <div class="feature-card">
          <div class="feature-emoji">🤔</div>
          <h3>Contradictions</h3>
          <p>True and false at the same time!</p>
        </div>
        <div class="feature-card">
          <div class="feature-emoji">🎭</div>
          <h3>Meme Magic</h3>
          <p>Gen Z slang and internet culture</p>
        </div>
      </div>
      <p style="margin-top: 30px; color: #999; font-size: 12px;">Start typing to unleash the chaos! 🚀</p>
    </div>
  `;
}
