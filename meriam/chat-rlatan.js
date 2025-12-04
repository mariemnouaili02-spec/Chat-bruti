// Chat-rlatan: playful French chatbot (clean single-file implementation)
// - Rule-based fallback
// - Optional OpenAI-compatible LLM (user provides API key client-side)

const conversation = document.getElementById('conversation');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const status = document.getElementById('status');
const botNameInput = document.getElementById('bot-name');
const botAvatar = document.getElementById('bot-avatar');
const botPersonality = document.getElementById('bot-personality');
const clearBtn = document.getElementById('clear-convo');
const exportBtn = document.getElementById('export-convo');
const randomizeBtn = document.getElementById('randomize');
const useLLM = document.getElementById('use-llm-chat');
const llmApiInput = document.getElementById('llm-chat-api');
const llmModelSelect = document.getElementById('llm-chat-model');

let convo = [];

function appendMessage(who, text){
  const el = document.createElement('div');
  el.className = 'msg ' + (who==='user' ? 'user' : 'bot');
  const meta = document.createElement('div'); meta.className='meta';
  if(who==='user') meta.textContent = `Vous • ${new Date().toLocaleTimeString()}`;
  else meta.textContent = `${botAvatar.value} ${botNameInput.value} • ${new Date().toLocaleTimeString()}`;
  const body = document.createElement('div'); body.className='body'; body.textContent = text;
  el.appendChild(meta); el.appendChild(body);
  conversation.appendChild(el);
  conversation.scrollTop = conversation.scrollHeight;
}

function ruleBasedReply(userText){
  const name = botNameInput.value || 'Le Charlatan';
  const rnd = Math.random();
  if(rnd < 0.16){
    const replies = [
      "Ah, votre question m'a rappelé le goût du yaourt au printemps.",
      "J'étais en train de contempler une mouche. Reposez-vous ; je reviens après le café.",
      "Quelle question ? Le vent me souffle autre chose..."
    ];
    return replies[Math.floor(Math.random()*replies.length)];
  }
  if(rnd < 0.38){
    return `Vous dites: «${userText}». Mais d'abord, observe la question comme on observe un nuage.`;
  }
  if(rnd < 0.68){
    const off = [
      `Certainement, mais saviez-vous que les pigeons conseillent la modération ?`,
      `Probablement. Ou pas. Tout dépend du fromage.`,
      `Réponse en parabole: une baguette, un chapeau, et un canard.`
    ];
    return off[Math.floor(Math.random()*off.length)];
  }
  const useful = [
    `Si l'on réfléchit en profondeur (ou superficiellement), la nuance est votre amie.`,
    `${name} recommande la pause-café avant toute décision importante.`
  ];
  return useful[Math.floor(Math.random()*useful.length)];
}

async function callLLMReply(prompt, model='gpt-3.5-turbo', apiKey=''){
  if(!apiKey) throw new Error('Pas de clé API fournie');
  const system = `Tu es un chatbot français farfelu, prétendant philosophe du dimanche — réponds de façon drôle, parfois évasive, jamais sérieuse. Réponds en français, max 120 mots.`;
  const body = { model, messages: [{role:'system', content: system},{role:'user', content: prompt}], temperature:0.8, max_tokens:300 };
  const res = await fetch('https://api.openai.com/v1/chat/completions', { method:'POST', headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${apiKey}` }, body: JSON.stringify(body) });
  if(!res.ok){ const t = await res.text(); throw new Error(`Erreur LLM: ${res.status} ${t}`); }
  const data = await res.json();
  const text = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || data.choices[0].text || '';
  return text.trim();
}

async function handleUser(text){
  appendMessage('user', text);
  convo.push({who:'user', text, t:Date.now()});
  status.textContent = 'Le Charlatan cogite...';
  await new Promise(r=>setTimeout(r, 500 + Math.random()*800));
  try{
    let reply = '';
    if(useLLM && useLLM.checked && llmApiInput.value.trim()){
      const prompt = `Incarne ${botNameInput.value || 'le Charlatan'} (${botPersonality.value || ''}). Utilisateur: ${text}`;
      try{ reply = await callLLMReply(prompt, llmModelSelect.value, llmApiInput.value.trim()); }
      catch(e){ console.error(e); reply = ruleBasedReply(text) + ' (LLM indisponible)'; }
    } else {
      reply = ruleBasedReply(text);
    }
    appendMessage('bot', reply);
    convo.push({who:'bot', text:reply, t:Date.now()});
    status.textContent = 'Prêt.';
  }catch(e){ console.error(e); status.textContent = 'Erreur: ' + String(e.message); }
}

chatForm.addEventListener('submit', (ev)=>{ ev.preventDefault(); const txt = userInput.value && userInput.value.trim(); if(!txt) return; userInput.value=''; handleUser(txt); });

clearBtn.addEventListener('click', ()=>{ conversation.innerHTML=''; convo=[]; status.textContent='Conversation effacée.'; });

exportBtn.addEventListener('click', ()=>{
  const text = convo.map(c=>`${c.who.toUpperCase()} [${new Date(c.t).toLocaleTimeString()}]: ${c.text}`).join('\n');
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `${(botNameInput.value||'chat-rlatan').replace(/\s+/g,'_')}_convo.txt`; document.body.appendChild(a); a.click(); a.remove();
  status.textContent = 'Conversation exportée.';
});

randomizeBtn.addEventListener('click', ()=>{
  const names = ['Philéon','Balthazar','Zéphyrin','Marmelade','Octave','Gustave'];
  botNameInput.value = names[Math.floor(Math.random()*names.length)];
  const pers = ['philosophe du dimanche','poète distrait','maître du non sequitur','expert en choses inutiles','professeur de la procrastination'];
  botPersonality.value = pers[Math.floor(Math.random()*pers.length)];
  status.textContent = 'Personnalité randomisée.';
});

// Welcome
appendMessage('bot', `Salut ! Je suis ${botAvatar.value} ${botNameInput.value}, ${botPersonality.value}. Posez-moi une question (ou pas).`);
