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
// Clean Chat-rlatan script only
// Purely client-side: playful French chatbot with optional LLM integration
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

// Welcome message
appendMessage('bot', `Salut ! Je suis ${botAvatar.value} ${botNameInput.value}, ${botPersonality.value}. Posez-moi une question (ou pas).`);

  // curated character examples per category
  const lists = {
    films: [
      'Darth Vader','Indiana Jones','Forrest Gump','The Joker','Harry Potter','James Bond','Rocky Balboa','Ellen Ripley'
    ],
    series: [
      'Sherlock Holmes','Daenerys Targaryen','Walter White','Tony Soprano','Eleven','Jon Snow','Rick Grimes','Dr. Who'
    ],
    cartoons: [
      'Mickey Mouse','Bugs Bunny','Homer Simpson','SpongeBob SquarePants','Tom Cat','Jerry Mouse','Scooby-Doo','Popeye'
    ]
  };
  const chosen = lists[category] || lists.films;
  // if custom list textarea has content, parse it and use that
  const customText = customListTextarea && customListTextarea.value && customListTextarea.value.trim();
  if(customText){
    const lines = customText.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
    return lines.map(name=>({ name, emoji: makeEmojiFor(name) }));
  }
  return chosen.map(name=>({ name, emoji: makeEmojiFor(name) }));
}

function renderEmojiResults(items){
  emojiResults.innerHTML = '';
  items.forEach(it=>{
    const el = document.createElement('div');
    el.style.cssText = 'background:rgba(255,255,255,0.02);padding:10px;border-radius:8px;min-width:160px;text-align:center;cursor:pointer;border:1px solid rgba(255,255,255,0.03)';
    el.title = 'Click to copy emoji';
    el.innerHTML = `<div style="font-weight:700;margin-bottom:6px">${it.name}</div><div style="font-size:24px">${it.emoji}</div>`;
    el.addEventListener('click', ()=>{
      navigator.clipboard.writeText(it.emoji).then(()=>{
        msg.textContent = `${it.name} emoji copied!`;
        if(soundToggle && soundToggle.checked) playClick();
      });
    });
    emojiResults.appendChild(el);
  });
}

generateEmojisBtn && generateEmojisBtn.addEventListener('click', ()=>{
  const cat = (emojiCategory && emojiCategory.value) || 'films';
  // if upload list provided, attempt to use it
  if(uploadListInput && uploadListInput.files && uploadListInput.files.length>0){
    const f = uploadListInput.files[0];
    const reader = new FileReader();
    reader.onload = ()=>{
      customListTextarea.value = String(reader.result);
      const items = generateEmojis(cat);
      renderEmojiResults(items);
    };
    reader.readAsText(f,'utf-8');
    return;
  }
  const items = generateEmojis(cat);
  renderEmojiResults(items);
  if(soundToggle && soundToggle.checked) playClick();
});

downloadEmojisBtn && downloadEmojisBtn.addEventListener('click', ()=>{
  const cat = (emojiCategory && emojiCategory.value) || 'films';
  const items = generateEmojis(cat);
  const lines = items.map(i=>`${i.name}\t${i.emoji}`).join('\n');
  const blob = new Blob([lines], { type: 'text/plain;charset=utf-8' });
  downloadBlob(blob, `${cat}-ai-emojis.txt`);
  if(soundToggle && soundToggle.checked) playClick();
});

// upload custom sound files and decode to buffers
async function decodeAndStoreSound(file, targetKey){
  if(!file) return;
  ensureAudio();
  const ab = await file.arrayBuffer();
  const decoded = await audioCtx.decodeAudioData(ab);
  renderedBuffers[targetKey] = decoded;
  msg.textContent = `Loaded custom ${targetKey} sound: ${file.name}`;
}

if(uploadSoundClick){ uploadSoundClick.addEventListener('change', (e)=>{ const f = e.target.files[0]; if(f) decodeAndStoreSound(f,'click'); }); }
if(uploadSoundDrum){ uploadSoundDrum.addEventListener('change', (e)=>{ const f = e.target.files[0]; if(f) decodeAndStoreSound(f,'drumroll'); }); }
if(uploadSoundApplause){ uploadSoundApplause.addEventListener('change', (e)=>{ const f = e.target.files[0]; if(f) decodeAndStoreSound(f,'applause'); }); }

// LLM integration: call OpenAI Chat Completions to produce JSON mapping of name->emoji
async function callLLMForEmojis(names, model='gpt-3.5-turbo', apiKey=''){
  if(!apiKey) throw new Error('No API key provided');
  const system = `You are an assistant that converts a list of character names into short emoji representations. Reply with a JSON array where each item is {"name": "...", "emoji": "...", "note":"short note"}. Do not include any other text.`;
  const user = `Characters:\n${names.join('\n')}\nReturn only valid JSON.`;
  const url = 'https://api.openai.com/v1/chat/completions';
  const body = { model, messages: [{role:'system', content: system},{role:'user', content: user}], temperature:0.7, max_tokens:800 };
  const res = await fetch(url, { method:'POST', headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${apiKey}` }, body: JSON.stringify(body) });
  if(!res.ok){ const t = await res.text(); throw new Error(`LLM error: ${res.status} ${t}`); }
  const data = await res.json();
  const content = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || data.choices[0].text;
  // attempt to parse JSON from content
  try{
    const jsonStart = content.indexOf('[');
    const jsonStr = content.slice(jsonStart);
    const parsed = JSON.parse(jsonStr);
    return parsed.map(item=>({ name: item.name, emoji: item.emoji || item.emojis || '', note: item.note || '' }));
  }catch(e){
    throw new Error('Failed to parse LLM response as JSON: ' + e.message + '\nResponse:\n' + content);
  }
}

generateLLMBtn && generateLLMBtn.addEventListener('click', async ()=>{
  const cat = (emojiCategory && emojiCategory.value) || 'films';
  const lists = { films: ['Darth Vader','Indiana Jones','Forrest Gump','The Joker','Harry Potter','James Bond','Rocky Balboa','Ellen Ripley'], series: ['Sherlock Holmes','Daenerys Targaryen','Walter White','Tony Soprano','Eleven','Jon Snow','Rick Grimes','Dr. Who'], cartoons: ['Mickey Mouse','Bugs Bunny','Homer Simpson','SpongeBob SquarePants','Tom Cat','Jerry Mouse','Scooby-Doo','Popeye'] };
  const names = lists[cat] || lists.films;
  const apiKey = llmApiKeyInput && llmApiKeyInput.value.trim();
  const model = llmModelSelect && llmModelSelect.value;
  if(!useLLMcheckbox || !useLLMcheckbox.checked){ msg.textContent = 'Enable "Use LLM" first.'; return; }
  if(!apiKey){ msg.textContent = 'Please paste your OpenAI API key into the input field.'; return; }
  msg.textContent = 'Generating via LLM...';
  try{
    const result = await callLLMForEmojis(names, model, apiKey);
    // map result into expected structure for renderEmojiResults
    const items = result.map(r=>({ name: r.name, emoji: (r.emoji || '').trim() || makeEmojiFor(r.name) }));
    renderEmojiResults(items);
    msg.textContent = 'LLM-generated emojis ready.';
  }catch(err){
    console.error(err); msg.textContent = 'LLM error: ' + err.message;
  }
});
