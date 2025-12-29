
/*shutter button shuffle*/
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.photothumbnail');
  const btn  = document.getElementById('shutterBtn');

  const PHOTO_POOL = [
    'image/photoitem/photoitem1.jpg',
    'image/photoitem/photoitem2.jpg',
    'image/photoitem/photoitem3.jpg',
    'image/photoitem/photoitem4.jpg',
    'image/photoitem/photoitem5.jpg',
    'image/photoitem/photoitem6.jpg',
    'image/photoitem/photoitem7.jpg',
  ];

  let SLOTS = 3; 
  let lastShown = new Set(); 

  /*responsive*/
  function updateSlots() {
    if (window.innerWidth <= 1110) {
      SLOTS = 1;
    } else {
      SLOTS = 3;
    }
  }

  window.addEventListener('resize', () => {
    const oldSlots = SLOTS;
    updateSlots();
    if (oldSlots !== SLOTS) shuffleAndRender();
  });
  updateSlots();

  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function pickThree() {
    if (PHOTO_POOL.length <= SLOTS) return PHOTO_POOL.slice(0, SLOTS);
    let tries = 0;
    while (tries < 8) {
      const shuffled = shuffleArray([...PHOTO_POOL]);
      const selected = shuffled.slice(0, SLOTS);
      const set = new Set(selected);
      let same = (set.size === lastShown.size) && [...set].every(x => lastShown.has(x));
      if (!same) { lastShown = set; return selected; }
      tries++;
    }
    const fallback = shuffleArray([...PHOTO_POOL]).slice(0, SLOTS);
    lastShown = new Set(fallback);
    return fallback;
  }

  function renderPhotos(sources) {
    grid.innerHTML = ''; 
    sources.forEach(src => {
      const a = document.createElement('a');
      a.className = 'photoitem';
      a.href = 'photography/index.html';
      const img = document.createElement('img');
      img.src = src;
      img.alt = 'snap';
      img.loading = 'lazy';
      a.appendChild(img);
      grid.appendChild(a);
    });
  }

  function shuffleAndRender() {
    grid.classList.add('shuffling');
    renderPhotos(pickThree());
  
    setTimeout(() => grid.classList.remove('shuffling'), 180);
  }

  shuffleAndRender();

  btn.addEventListener('click', () => {
    const original = btn.textContent;
    btn.textContent = original.replace('📷', '📸');
    btn.disabled = true;
    shuffleAndRender();
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
    }, 500);
  });
});

/*work page scroll*/
document.addEventListener('DOMContentLoaded', () => {
  const rightPane   = document.querySelector('.archive-right');
  const gridItems   = Array.from(document.querySelectorAll('.archive-right .grid .grid-item'));
  const pieceList   = document.getElementById('pieceList');

  const itemToLi = new Map();
  const liToItem = new Map();

  gridItems.forEach((item, i) => {
    const titleEl = item.querySelector('.title');

    const li = document.createElement('li');
    li.setAttribute('role', 'button');
    li.setAttribute('tabindex', '0');
    li.dataset.idx = String(i);
    li.innerHTML = `
      ${titleEl ? titleEl.textContent.trim() : 'Untitled'}
    `;

    const go = () => item.scrollIntoView({ behavior: 'smooth', block: 'center' });
    li.addEventListener('click', go);

    pieceList.appendChild(li);
    itemToLi.set(item, li);
    liToItem.set(li, item);
  });

  let ticking = false;
  function updateActive() {
    ticking = false;
    const paneRect = rightPane.getBoundingClientRect();
    const centerY  = paneRect.top + paneRect.height / 2;

    let best = { el: null, dist: Infinity };
    gridItems.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.bottom < paneRect.top || r.top > paneRect.bottom) return;
      const d = Math.abs((r.top + r.height / 2) - centerY);
      if (d < best.dist) best = { el, dist: d };
    });

    pieceList.querySelectorAll('li.active').forEach(li => li.classList.remove('active'));
    if (best.el) {
      const li = itemToLi.get(best.el);
      if (li) {
        li.classList.add('active');
        const liRect = li.getBoundingClientRect();
        const listRect = pieceList.getBoundingClientRect();
        if (liRect.top < listRect.top + 40 || liRect.bottom > listRect.bottom - 40) {
          li.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      }
    }
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateActive);
      ticking = true;
    }
  }

  rightPane.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  updateActive();
});


/*feature work hover show text
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.project .projectpage').forEach(link => {
      const fig = link.querySelector('figure');
      if (!fig) return;
  
      const title = link.dataset.title || '';
      const meta  = link.dataset.meta  || '';
  
      const overlay = document.createElement('div');
      overlay.className = 'overlay';
  
      const content = document.createElement('div');
      content.className = 'overlay-content';
  
      if (title) {
        const t = document.createElement('div');
        t.className = 'overlay-title';
        t.textContent = title;
        content.appendChild(t);
      }
      if (meta) {
        const m = document.createElement('div');
        m.className = 'overlay-meta';
        m.textContent = meta;
        content.appendChild(m);
      }
  
      overlay.appendChild(content);
      fig.appendChild(overlay);
    });
  });*/