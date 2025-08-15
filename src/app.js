  // -------- Mock data ---------
  const CLIPS = [
    { id:'c1', filmTitle:'Неоновые тени', year:2021, genres:['sci-fi','thriller'], logline:'Детектив в кибер-городе расследует память, а не преступления.',
      src:'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', poster:'', tags:['#сайфай','#нуар'], filmSlug:'neon-shadows',
      watchUrl:'https://example.com/film/neon-shadows?utm_source=app&utm_medium=watch_button&utm_campaign=clips' },
    { id:'c2', filmTitle:'Винт времени', year:2019, genres:['drama','mystery'], logline:'Физик застрял в петле одного вечера и одного выбора.',
      src:'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', poster:'', tags:['#петля','#интрига'], filmSlug:'time-screw',
      watchUrl:'https://example.com/film/time-screw?utm_source=app&utm_medium=watch_button&utm_campaign=clips' },
    { id:'c3', filmTitle:'Город дождя', year:2023, genres:['action','crime'], logline:'Водитель-курьер ночью перевозит то, чего лучше не знать.',
      src:'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', poster:'', tags:['#ночь','#погоня'], filmSlug:'rain-city',
      watchUrl:'https://example.com/film/rain-city?utm_source=app&utm_medium=watch_button&utm_campaign=clips' }
  ];

  const GENRES = [
    {id:'action', name:'Боевик'}, {id:'sci-fi', name:'Фантастика'}, {id:'drama', name:'Драма'}, {id:'comedy', name:'Комедия'},
    {id:'thriller', name:'Триллер'}, {id:'mystery', name:'Мистика'}, {id:'crime', name:'Криминал'}, {id:'romance', name:'Романтика'},
    {id:'horror', name:'Хоррор'}, {id:'adventure', name:'Приключения'}, {id:'animation', name:'Анимация'}
  ];

  const CATALOG_URL = 'https://example.com/films'; // TODO: подставить твой домен

  // -------- State ---------
  const state = {
    currentClipId:null,
    likes: JSON.parse(localStorage.getItem('likes')||'{}'),
    bookmarks: JSON.parse(localStorage.getItem('bookmarks')||'{}'),
    comments: JSON.parse(localStorage.getItem('comments')||'{}'),
    genres: JSON.parse(localStorage.getItem('genres')||'[]'),
    settings: JSON.parse(localStorage.getItem('settings')||'{"autoplay":true,"muteDefault":true}')
  };

  const els = {
    feedView: document.getElementById('feedView'),
    bookView: document.getElementById('bookmarksView'),
    profileView: document.getElementById('profileView'),
    sidebarNav: document.getElementById('sidebarNav'),
    onb: document.getElementById('onb'), genreChips: document.getElementById('genreChips'),
    skipOnb: document.getElementById('skipOnb'), confirmOnb: document.getElementById('confirmOnb'),
    toast: document.getElementById('toast'),
    commentsSheet: document.getElementById('commentsSheet'), commentsList: document.getElementById('commentsList'),
    commentForm: document.getElementById('commentForm'), commentInput: document.getElementById('commentInput'), closeComments: document.getElementById('closeComments'),
    bookGrid: document.getElementById('bookGrid'),
    autoplayToggle: document.getElementById('autoplayToggle'), muteDefaultToggle: document.getElementById('muteDefaultToggle'),
    currentGenres: document.getElementById('currentGenres'),
    btnSettings: document.getElementById('btnSettings'), changeGenresBtn: document.getElementById('changeGenresBtn'),
    ctaWatch: document.getElementById('ctaWatch'), ctaTitle: document.getElementById('ctaTitle')
  };

  function save(key){
    if(key==='likes') localStorage.setItem('likes', JSON.stringify(state.likes));
    if(key==='bookmarks') localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
    if(key==='comments') localStorage.setItem('comments', JSON.stringify(state.comments));
    if(key==='genres') localStorage.setItem('genres', JSON.stringify(state.genres));
    if(key==='settings') localStorage.setItem('settings', JSON.stringify(state.settings));
  }

  // -------- Helpers ---------
  function toast(msg){
    els.toast.textContent = msg; els.toast.classList.add('show');
    clearTimeout(els.toast._t); els.toast._t = setTimeout(()=>els.toast.classList.remove('show'), 1600);
  }
  function mmss(t){ t=Math.max(0,Math.floor(t||0)); const m=String(Math.floor(t/60)).padStart(2,'0'); const s=String(t%60).padStart(2,'0'); return `${m}:${s}`; }

  function syncCtaById(id){
    const clip = CLIPS.find(c=>c.id===id); if(!clip) return;
    state.currentClipId = id;
    els.ctaWatch.dataset.url = clip.watchUrl;
    els.ctaTitle.textContent = `Смотреть: ${clip.filmTitle}`;
  }

  // -------- Build Feed ---------
  function buildFeed(){
    els.feedView.innerHTML = '';
    const list = CLIPS.filter(c=> state.genres.length? c.genres.some(g=>state.genres.includes(g)) : true);
    list.forEach((clip)=>{
      const el = document.createElement('section');
      el.className = 'clip'; el.dataset.clipId = clip.id;
      el.innerHTML = `
        <video preload="metadata" ${state.settings.autoplay? 'autoplay': ''} ${state.settings.muteDefault? 'muted': ''} playsinline webkit-playsinline src="${clip.src}" poster="${clip.poster}"></video>
        <div class="grad-top"></div><div class="grad-bottom"></div>
        <div class="play-overlay" data-act="toggle"><svg class="ic"><use href="#i-play"/></svg></div>
        <div class="info">
          <div class="title">${clip.filmTitle}</div>
          <div class="meta">${clip.year} • ${clip.genres.map(g=> (GENRES.find(x=>x.id===g)||{}).name||g).join(' • ')}</div>
          <div class="logline">${clip.logline}</div>
          <div class="tags">${(clip.tags||[]).map(t=>`<span class="tag">${t}</span>`).join('')}</div>
        </div>
        <div class="actions-rail">
          <div class="action" data-act="like" title="Нравится"><svg class="ic"><use href="#i-heart"/></svg><div class="count">${state.likes[clip.id]?1:0}</div></div>
          <div class="action" data-act="bookmark" title="В закладки"><svg class="ic"><use href="#i-bookmark"/></svg><div class="count">${state.bookmarks[clip.id]?1:0}</div></div>
          <div class="action" data-act="comments" title="Комментарии"><svg class="ic"><use href="#i-chat"/></svg><div class="count">${(state.comments[clip.id]||[]).length}</div></div>
          <div class="action" data-act="share" title="Поделиться"><svg class="ic"><use href="#i-share"/></svg></div>
        </div>
      `;
      els.feedView.appendChild(el);
    });
    attachFeedHandlers();
    setupObserver();
    if(list[0]) syncCtaById(list[0].id);
  }

  // -------- Observer (autoplay & CTA sync) ---------
  let observer;
  function setupObserver(){
    observer && observer.disconnect();
    observer = new IntersectionObserver((entries)=>{
      entries.forEach(en=>{
        const vid = en.target.querySelector('video'); if(!vid) return;
        if(en.isIntersecting && en.intersectionRatio > 0.6){
          syncCtaById(en.target.dataset.clipId);
          if(state.settings.autoplay){ vid.play().catch(()=>{}); }
          const next = en.target.nextElementSibling?.querySelector('video'); if(next){ next.preload = 'auto'; }
        } else { vid.pause(); }
      })
    }, {threshold:[0,.6,1]});
    document.querySelectorAll('.clip').forEach(c=> observer.observe(c));
  }

  // -------- Handlers ---------
  function attachFeedHandlers(){
    els.feedView.addEventListener('click',(e)=>{
      const clipEl = e.target.closest('.clip'); if(!clipEl) return;
      const clip = CLIPS.find(c=> c.id === clipEl.dataset.clipId);
      const actEl = e.target.closest('[data-act]');
      if(!actEl){ return; }
      const act = actEl.dataset.act;
      if(act==='toggle'){
        const vid = clipEl.querySelector('video'); if(!vid) return; if(vid.paused) vid.play(); else vid.pause();
      }
      if(act==='like'){
        state.likes[clip.id] = !state.likes[clip.id]; save('likes');
        clipEl.querySelector('[data-act="like"] .count').textContent = state.likes[clip.id]?1:0;
        toast(state.likes[clip.id] ? 'Нравится' : 'Убрано из «Нравится»');
      }
      if(act==='bookmark'){
        state.bookmarks[clip.id] = state.bookmarks[clip.id] ? undefined : { clipId:clip.id, filmTitle:clip.filmTitle, poster:clip.poster, slug:clip.filmSlug, watchUrl:clip.watchUrl };
        if(state.bookmarks[clip.id]===undefined) delete state.bookmarks[clip.id]; save('bookmarks');
        clipEl.querySelector('[data-act="bookmark"] .count').textContent = state.bookmarks[clip.id]?1:0;
        buildBookmarks(); toast(state.bookmarks[clip.id] ? 'Добавлено в закладки' : 'Удалено из закладок');
      }
      if(act==='comments'){ openComments(clip); }
      if(act==='share'){
        const url = `${location.origin}/film/${clip.filmSlug}?clip=${clip.id}`;
        if(navigator.share){ navigator.share({title:clip.filmTitle, url}).catch(()=>{}); } else { navigator.clipboard.writeText(url); toast('Ссылка скопирована'); }
      }
    });

    // Keyboard shortcuts
    window.addEventListener('keydown',(e)=>{
      const cur = document.querySelector(`.clip[data-clip-id="${state.currentClipId}"]`); if(!cur) return;
      const vid = cur.querySelector('video');
      if(['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) return;
      if(e.key==='k'){ e.preventDefault(); if(vid.paused) vid.play(); else vid.pause(); }
      if(e.key==='m'){ e.preventDefault(); vid.muted = !vid.muted; toast(vid.muted? 'Звук выключен':'Звук включен'); }
      if(e.key==='ArrowDown'){ e.preventDefault(); cur.nextElementSibling?.scrollIntoView({behavior:'smooth'}); }
      if(e.key==='ArrowUp'){ e.preventDefault(); cur.previousElementSibling?.scrollIntoView({behavior:'smooth'}); }
      if(e.key==='b'){ e.preventDefault(); cur.querySelector('[data-act="bookmark"]').click(); }
      if(e.key==='Enter'){ e.preventDefault(); els.ctaWatch.click(); }
    });

    // CTA click
    els.ctaWatch.addEventListener('click',()=>{
      const url = els.ctaWatch.dataset.url; if(url) window.open(url,'_blank','noopener');
    });
  }

  // -------- Comments ---------
  function openComments(clip){
    els.commentsList.innerHTML = '';
    els.commentsSheet.classList.add('active'); els.commentsSheet.setAttribute('aria-hidden','false');
    els.commentForm.dataset.clipId = clip.id; els.commentInput.value='';
    const list = state.comments[clip.id] || [];
    renderComments(list);
  }
  function renderComments(list){
    els.commentsList.innerHTML = list.map(it=>`
      <div class="cmt">
        <div class="ava">${(it.user||'Г').slice(0,1)}</div>
        <div class="cbody">
          <div><strong>${it.user||'Гость'}</strong> <span class="ctime">• ${new Date(it.ts).toLocaleString()} <span class="jump" data-jump="${it.time||0}">${mmss(it.time||0)}</span></span></div>
          <div>${it.text}</div>
        </div>
      </div>
    `).join('');
  }
  els.commentForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const clipId = e.currentTarget.dataset.clipId; if(!clipId) return;
    const text = els.commentInput.value.trim(); if(!text) return;
    const cur = document.querySelector(`.clip[data-clip-id="${clipId}"]`);
    const time = cur?.querySelector('video')?.currentTime || 0;
    const item = { text, time:Math.floor(time), ts: Date.now(), user:'Гость' };
    const list = state.comments[clipId] || []; list.unshift(item); state.comments[clipId]=list; save('comments');
    els.commentInput.value=''; renderComments(list);
    // update counter safely
    const cntEl = cur && cur.querySelector('[data-act="comments"] .count');
    if (cntEl) { cntEl.textContent = String(list.length); }
  });
  els.commentsList.addEventListener('click',(e)=>{
    const jump = e.target.closest('[data-jump]'); if(!jump) return;
    const t = Number(jump.dataset.jump)||0;
    const clipId = els.commentForm.dataset.clipId;
    const cur = document.querySelector(`.clip[data-clip-id="${clipId}"]`);
    const vid = cur?.querySelector('video'); if(vid){ vid.currentTime=t; vid.play().catch(()=>{}); }
  });
  els.closeComments.addEventListener('click',()=>{ els.commentsSheet.classList.remove('active'); els.commentsSheet.setAttribute('aria-hidden','true'); });

  // -------- Bookmarks ---------
  function buildBookmarks(){
    const entries = Object.values(state.bookmarks||{});
    els.bookGrid.innerHTML = entries.length? entries.map(b=>`
      <div style="background:rgba(255,255,255,.04);backdrop-filter:blur(10px);border:1px solid var(--line);border-radius:12px;overflow:hidden">
        <img alt="${b.filmTitle}" src="https://picsum.photos/seed/${b.clipId}/400/600" style="width:100%;aspect-ratio:2/3;object-fit:cover"/>
        <div style="padding:10px">
          <div style="font-weight:700">${b.filmTitle}</div>
          <div class="muted" style="font-size:13px;margin-top:4px">Сохранено</div>
          <div style="display:flex;gap:8px;margin-top:8px">
            <button class="btn primary" data-open="${b.watchUrl}">Смотреть</button>
            <button class="btn" data-remove="${b.clipId}">Удалить</button>
          </div>
        </div>
      </div>
    `).join('') : `<div class="muted" style="padding:16px">В закладках пусто. Добавляйте клипы — вернётесь к ним позже.</div>`;
  }
  els.bookGrid.addEventListener('click',(e)=>{
    const open = e.target.closest('[data-open]'); if(open){ window.open(open.dataset.open,'_blank','noopener'); }
    const rm = e.target.closest('[data-remove]'); if(rm){ delete state.bookmarks[rm.dataset.remove]; save('bookmarks'); buildBookmarks(); toast('Удалено из закладок'); }
  });

  // -------- Genres Onboarding ---------
  function buildGenres(){
    els.genreChips.innerHTML = GENRES.map(g=>`<div class="chip ${state.genres.includes(g.id)?'active':''}" data-id="${g.id}">${g.name}</div>`).join('');
    els.genreChips.onclick = (e)=>{
      const chip = e.target.closest('.chip'); if(!chip) return; const id = chip.dataset.id;
      if(state.genres.includes(id)) state.genres = state.genres.filter(x=>x!==id); else state.genres.push(id);
      save('genres'); chip.classList.toggle('active');
    };
  }
  els.skipOnb.addEventListener('click',()=>els.onb.classList.remove('active'));
  els.confirmOnb.addEventListener('click',()=>{ els.onb.classList.remove('active'); buildFeed(); renderCurrentGenres(); toast('Готово! Лента обновлена.'); });

  // -------- Sidebar Nav ---------
  els.sidebarNav.addEventListener('click',(e)=>{
    const item = e.target.closest('.sitem'); if(!item) return;
    document.querySelectorAll('.sitem').forEach(i=>i.classList.toggle('active', i===item));
    const id = item.dataset.tab;
    if(id==='genres'){ buildGenres(); els.onb.classList.add('active'); return; }
    if(id==='catalog'){ window.open(item.dataset.open||CATALOG_URL,'_blank','noopener'); return; }
    showView(id);
  });
  function showView(id){
    els.bookView.classList.remove('active'); els.profileView.classList.remove('active');
    if(id==='feed'){ /* остаёмся на ленте */ }
    if(id==='bookmarks'){ els.bookView.classList.add('active'); buildBookmarks(); window.scrollTo(0,0); }
    if(id==='profile'){ els.profileView.classList.add('active'); window.scrollTo(0,0); }
  }

  // -------- Settings shortcuts ---------
  els.autoplayToggle.addEventListener('change',(e)=>{ state.settings.autoplay=e.target.checked; save('settings'); toast('Настройка сохранена'); });
  els.muteDefaultToggle.addEventListener('change',(e)=>{ state.settings.muteDefault=e.target.checked; save('settings'); buildFeed(); toast('Настройка сохранена'); });
  els.btnSettings.addEventListener('click',()=>{ buildGenres(); els.onb.classList.add('active'); });
  els.changeGenresBtn.addEventListener('click',()=>{ buildGenres(); els.onb.classList.add('active'); });

  function renderCurrentGenres(){ els.currentGenres.textContent = (state.genres||[]).length ? GENRES.filter(g=>state.genres.includes(g.id)).map(g=>g.name).join(', ') : 'Не выбрано'; }

  // -------- Init ---------
  function init(){
    if(!state.genres || !state.genres.length){ buildGenres(); els.onb.classList.add('active'); } else { buildGenres(); }
    buildFeed(); buildBookmarks(); renderCurrentGenres();
  }
  init();

  // -------- Tests ---------
  console.assert(document.querySelectorAll('.snav .sitem').length>=5,'Sidebar should have 5+ items (Клипы, Жанры, Закладки, Каталог, Профиль)');
  console.assert(document.getElementById('ctaWatch'),'CTA watch button should exist');
  console.assert(!document.querySelector('.pager'),'Pager should be removed');
