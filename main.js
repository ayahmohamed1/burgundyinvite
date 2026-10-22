// ==========================================================
// ROYAL ENGAGEMENT INVITATION - JAVASCRIPT LOGIC
// ==========================================================

// Global state
const defaultState = {
  groomName: 'أحمد عبد الرحمن',
  brideName: 'مريم الشريف',
  eventDateTime: getFutureDate(25), // 25 days ahead
  dateArabic: 'الجمعة، ١٥ نوفمبر ٢٠٢٦',
  timeText: 'الساعة ٧:٠٠ مساءً',
  hallName: 'قاعة رويال لوتس الكبرى',
  hallHotel: 'فندق النيل ريتز كارلتون',
  address: 'كورنيش النيل، ميدان التحرير، وسط البلد، القاهرة، مصر',
  mapUrl: 'https://maps.google.com/?q=The+Nile+Ritz-Carlton+Cairo',
  couplePhoto: './assets/couple.jpg'
};

let appState = loadState();

function getFutureDate(daysAhead) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  d.setHours(19, 0, 0, 0);
  return d.toISOString().slice(0, 16);
}

function loadState() {
  try {
    const saved = localStorage.getItem('royal_invitation_state');
    if (saved) {
      return { ...defaultState, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.warn('Could not load state from localStorage', e);
  }
  return { ...defaultState };
}

function saveState() {
  try {
    localStorage.setItem('royal_invitation_state', JSON.stringify(appState));
  } catch (e) {
    console.warn('Could not save state to localStorage', e);
  }
}

// ==========================================================
// DOM ELEMENTS
// ==========================================================
const bgAudio = document.getElementById('bgMusic');
const musicToggleBtn = document.getElementById('musicToggleBtn');
const musicTooltip = document.getElementById('musicTooltip');

const envelopeScreen = document.getElementById('envelopeScreen');
const waxSealBtn = document.getElementById('waxSealBtn');
const openEnvelopeBtn = document.getElementById('openEnvelopeBtn');
const envelopeInteractiveBox = document.getElementById('envelopeInteractiveBox');

const invitationScreen = document.getElementById('invitationScreen');
const reopenEnvelopeBtn = document.getElementById('reopenEnvelopeBtn');
const dovesContainer = document.getElementById('dovesFlyContainer');

// Display elements
const displayGroomName = document.getElementById('displayGroomName');
const displayBrideName = document.getElementById('displayBrideName');
const displayDateArabic = document.getElementById('displayDateArabic');
const displayTimeText = document.getElementById('displayTimeText');
const displayHallName = document.getElementById('displayHallName');
const displayAddress = document.getElementById('displayAddress');
const displayCouplePhoto = document.getElementById('displayCouplePhoto');
const mapDirectBtn = document.getElementById('mapDirectBtn');
const envNamesPreview = document.getElementById('envNamesPreview');

// Countdown elements
const countDays = document.getElementById('countDays');
const countHours = document.getElementById('countHours');
const countMinutes = document.getElementById('countMinutes');
const countSeconds = document.getElementById('countSeconds');

// Customizer elements
const customizerToggleBtn = document.getElementById('customizerToggleBtn');
const customizerModal = document.getElementById('customizerModal');
const customizerOverlay = document.getElementById('customizerOverlay');
const closeCustomizerBtn = document.getElementById('closeCustomizerBtn');
const saveCustomizerBtn = document.getElementById('saveCustomizerBtn');
const resetCustomizerBtn = document.getElementById('resetCustomizerBtn');

const custGroomName = document.getElementById('custGroomName');
const custBrideName = document.getElementById('custBrideName');
const custEventDateTime = document.getElementById('custEventDateTime');
const custDateArabic = document.getElementById('custDateArabic');
const custTimeText = document.getElementById('custTimeText');
const custHallName = document.getElementById('custHallName');
const custAddress = document.getElementById('custAddress');
const custMapUrl = document.getElementById('custMapUrl');
const custPhotoUpload = document.getElementById('custPhotoUpload');

// RSVP elements
const rsvpForm = document.getElementById('rsvpForm');
const wishesList = document.getElementById('wishesList');
const addToCalendarBtn = document.getElementById('addToCalendarBtn');
const shareWhatsappBtn = document.getElementById('shareWhatsappBtn');

let isMusicPlaying = false;
let audioContext = null;
let synthGain = null;

// ==========================================================
// AUDIO SYSTEM (AUDIO ELEMENT + WEB AUDIO API FALLBACK)
// ==========================================================
function initAudio() {
  if (bgAudio) {
    bgAudio.volume = 0.8;
  }
}

function playMusic() {
  if (bgAudio) {
    bgAudio.play().then(() => {
      isMusicPlaying = true;
      updateMusicButtonUI(true);
    }).catch(err => {
      console.warn('Audio play restricted or failed, starting WebAudio synth fallback', err);
      startWebAudioSynth();
    });
  } else {
    startWebAudioSynth();
  }
}

function pauseMusic() {
  if (bgAudio && !bgAudio.paused) {
    bgAudio.pause();
  }
  if (audioContext && audioContext.state === 'running') {
    audioContext.suspend();
  }
  isMusicPlaying = false;
  updateMusicButtonUI(false);
}

function toggleMusic() {
  if (isMusicPlaying) {
    pauseMusic();
  } else {
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
      isMusicPlaying = true;
      updateMusicButtonUI(true);
    } else {
      playMusic();
    }
  }
}

function updateMusicButtonUI(playing) {
  if (playing) {
    musicToggleBtn.classList.add('playing');
    musicTooltip.textContent = 'إيقاف الموسيقى ⏸';
  } else {
    musicToggleBtn.classList.remove('playing');
    musicTooltip.textContent = 'تشغيل الموسيقى ▶';
  }
}

// Fallback romantic melody synthesizer in case browser blocks or audio file fails
function startWebAudioSynth() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    if (!audioContext) {
      audioContext = new AudioContext();
    }
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    isMusicPlaying = true;
    updateMusicButtonUI(true);
  } catch (e) {
    console.error('WebAudio error', e);
  }
}

musicToggleBtn.addEventListener('click', toggleMusic);

// ==========================================================
// DOVES FLYING ANIMATION (DOVE PNG FROM USER FOLDER)
// ==========================================================
function triggerFlyingDoves() {
  dovesContainer.innerHTML = '';
  
  // Create 6 doves with natural staggered flights
  const doveConfigs = [
    { delay: 0, scale: 0.8, startX: '45%', startY: '50%', anim: 'flyAcrossScreen1', duration: '3.6s' },
    { delay: 200, scale: 0.95, startX: '52%', startY: '48%', anim: 'flyCenterUp', duration: '3.4s' },
    { delay: 400, scale: 0.85, startX: '48%', startY: '52%', anim: 'flyAcrossScreen2', duration: '3.8s' },
    { delay: 650, scale: 0.7, startX: '42%', startY: '47%', anim: 'flyAcrossScreen1', duration: '4.2s' },
    { delay: 900, scale: 1.1, startX: '55%', startY: '49%', anim: 'flyCenterUp', duration: '3.2s' },
    { delay: 1200, scale: 0.75, startX: '50%', startY: '53%', anim: 'flyAcrossScreen2', duration: '3.9s' }
  ];

  doveConfigs.forEach(conf => {
    setTimeout(() => {
      const dove = document.createElement('img');
      dove.src = './assets/dove.png';
      dove.alt = 'حمامة بيضاء تحلق';
      dove.className = 'flying-dove dove-flap';
      dove.style.left = conf.startX;
      dove.style.top = conf.startY;
      dove.style.transform = `scale(${conf.scale})`;
      dove.style.animation = `${conf.anim} ${conf.duration} cubic-bezier(0.2, 0.8, 0.4, 1) forwards`;

      dovesContainer.appendChild(dove);

      // Clean up after animation finishes
      setTimeout(() => {
        if (dove.parentNode) {
          dove.parentNode.removeChild(dove);
        }
      }, 5000);
    }, conf.delay);
  });
}

// ==========================================================
// ENVELOPE OPENING INTERACTION
// ==========================================================
function openEnvelope() {
  // 1. Play romantic background music
  playMusic();

  // 2. Trigger golden wax-seal confetti burst
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.55 },
      colors: ['#D4AF37', '#8E2335', '#FFDF88', '#FFFFFF', '#6E1724']
    });
  }

  // 3. Trigger flying doves
  triggerFlyingDoves();

  // 4. Animate envelope open state
  envelopeScreen.classList.add('opened');

  // 5. Reveal the Royal Invitation card
  setTimeout(() => {
    invitationScreen.classList.remove('hidden');
    reopenEnvelopeBtn.classList.remove('hidden');

    // Scroll smoothly to top of invitation
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Additional celebratory soft confetti
    if (typeof confetti === 'function') {
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 60,
          origin: { x: 0, y: 0.4 },
          colors: ['#D4AF37', '#8E2335', '#FFF']
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 60,
          origin: { x: 1, y: 0.4 },
          colors: ['#D4AF37', '#8E2335', '#FFF']
        });
      }, 800);
    }
  }, 900);
}

waxSealBtn.addEventListener('click', openEnvelope);
openEnvelopeBtn.addEventListener('click', openEnvelope);
envelopeInteractiveBox.addEventListener('click', (e) => {
  // If clicked anywhere on envelope art
  openEnvelope();
});

// Reopen envelope button (to view the envelope experience again)
reopenEnvelopeBtn.addEventListener('click', () => {
  invitationScreen.classList.add('hidden');
  reopenEnvelopeBtn.classList.add('hidden');
  envelopeScreen.classList.remove('opened');
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ==========================================================
// FALLING ROSE PETALS (HTML5 CANVAS)
// ==========================================================
const canvas = document.getElementById('petalsCanvas');
const ctx = canvas.getContext('2d');
let petals = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Petal {
  constructor() {
    this.reset();
    this.y = Math.random() * canvas.height; // initial distribution
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = -30;
    this.size = Math.random() * 12 + 8;
    this.speedY = Math.random() * 1.2 + 0.6;
    this.speedX = Math.random() * 1 - 0.5;
    this.rotation = Math.random() * 360;
    this.rotSpeed = (Math.random() - 0.5) * 1.5;
    this.opacity = Math.random() * 0.5 + 0.4;
    // Vary between burgundy red, crimson, and velvet rose
    const colors = [
      'rgba(142, 35, 53, ',
      'rgba(110, 23, 36, ',
      'rgba(175, 45, 65, ',
      'rgba(90, 15, 25, '
    ];
    this.colorBase = colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    this.y += this.speedY;
    this.x += Math.sin(this.y * 0.015) * 0.8 + this.speedX;
    this.rotation += this.rotSpeed;

    if (this.y > canvas.height + 30) {
      this.reset();
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.fillStyle = this.colorBase + this.opacity + ')';

    // Petal heart/oval curve
    ctx.beginPath();
    ctx.ellipse(0, 0, this.size * 0.6, this.size, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// Create 35 delicate floating petals
for (let i = 0; i < 35; i++) {
  petals.push(new Petal());
}

function animatePetals() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  petals.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animatePetals);
}
animatePetals();

// ==========================================================
// COUNTDOWN TIMER (EXACT STYLE OF USER IMAGE 1)
// ==========================================================
function updateCountdown() {
  const targetDate = new Date(appState.eventDateTime).getTime();
  const now = new Date().getTime();
  const diff = targetDate - now;

  if (diff <= 0) {
    countDays.textContent = '00';
    countHours.textContent = '00';
    countMinutes.textContent = '00';
    countSeconds.textContent = '00';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  countDays.textContent = String(days).padStart(2, '0');
  countHours.textContent = String(hours).padStart(2, '0');
  countMinutes.textContent = String(minutes).padStart(2, '0');
  countSeconds.textContent = String(seconds).padStart(2, '0');
}

setInterval(updateCountdown, 1000);
updateCountdown();

// ==========================================================
// RENDER APP STATE TO DOM
// ==========================================================
function renderUI() {
  displayGroomName.textContent = appState.groomName;
  displayBrideName.textContent = appState.brideName;
  envNamesPreview.textContent = `${appState.groomName.split(' ')[0]} & ${appState.brideName.split(' ')[0]}`;

  displayDateArabic.textContent = appState.dateArabic;
  displayTimeText.textContent = appState.timeText;
  displayHallName.textContent = appState.hallName;
  displayAddress.textContent = appState.address;
  mapDirectBtn.href = appState.mapUrl;

  if (appState.couplePhoto) {
    displayCouplePhoto.src = appState.couplePhoto;
  }

  // Sync inputs in customizer modal
  custGroomName.value = appState.groomName;
  custBrideName.value = appState.brideName;
  custEventDateTime.value = appState.eventDateTime;
  custDateArabic.value = appState.dateArabic;
  custTimeText.value = appState.timeText;
  custHallName.value = appState.hallName;
  custAddress.value = appState.address;
  custMapUrl.value = appState.mapUrl;
}

renderUI();

// ==========================================================
// RSVP & GUEST WISHES SYSTEM
// ==========================================================
const defaultWishes = [
  {
    name: 'م. حسام الدين والعائلة',
    time: 'منذ ساعتين',
    attending: 'yes',
    message: 'ألف ألف مبروك لأجمل عروسين! بارك الله لكما وجمع بينكما في خير وسعادة دائمة يا رب.'
  },
  {
    name: 'د. سارة فؤاد',
    time: 'منذ ٤ ساعات',
    attending: 'yes',
    message: 'ما شاء الله تبارك الرحمن، ربي يتمملكم على خير ويسعد قلوبكم ويجعل دياركم عامرة بالأفراح.'
  },
  {
    name: 'عمر وإيمان الشريف',
    time: 'منذ يوم',
    attending: 'yes',
    message: 'من القلب نبارك لأخينا الغالي أحمد وكريمته مريم، متشوقون لحضور أجمل ليلة معاً!'
  }
];

function loadWishes() {
  try {
    const saved = localStorage.getItem('royal_invitation_wishes');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return defaultWishes;
}

function saveWishes(list) {
  try {
    localStorage.setItem('royal_invitation_wishes', JSON.stringify(list));
  } catch (e) {}
}

function renderWishes() {
  const wishes = loadWishes();
  wishesList.innerHTML = '';
  wishes.forEach(item => {
    const el = document.createElement('div');
    el.className = 'wish-item';
    el.innerHTML = `
      <div class="wish-author">
        <span>${escapeHtml(item.name)}</span>
        <span class="wish-date">${item.time || 'الآن'}</span>
      </div>
      <p class="wish-text">${escapeHtml(item.message || 'حضوركم شرف لنا ونشارككم أصدق الدعوات')}</p>
    `;
    wishesList.appendChild(el);
  });
}
renderWishes();

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }[m]));
}

// Radio cards selection handler
document.querySelectorAll('.radio-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.radio-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    const radio = card.querySelector('input[type="radio"]');
    if (radio) radio.checked = true;
  });
});

rsvpForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('guestName').value.trim();
  const message = document.getElementById('guestMessage').value.trim();
  const count = document.getElementById('guestCount').value;
  const attending = document.querySelector('input[name="attending"]:checked')?.value || 'yes';

  if (!name) return;

  const newWish = {
    name: `${name} (${count === '1' ? 'فرد واحد' : count + ' أفراد'})`,
    time: 'الآن',
    attending,
    message: message || (attending === 'yes' ? 'بإذن الله نكون حاضرين ونشارككم الفرحة والسرور' : 'اعتذر عن الحضور وأتمنى لكم أجمل الأوقات والسعادة')
  };

  const currentWishes = loadWishes();
  currentWishes.unshift(newWish);
  saveWishes(currentWishes);
  renderWishes();

  // Celebration burst
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  }

  alert(`شكراً لك يا ${name}! تم تسجيل ردك بنجاح وننتظر تشريفك ومشاركتك فرحتنا.`);
  rsvpForm.reset();
  document.querySelector('.radio-card').classList.add('selected');
});

// ==========================================================
// ACTIONS: ADD TO CALENDAR & WHATSAPP SHARE
// ==========================================================
addToCalendarBtn.addEventListener('click', () => {
  const title = encodeURIComponent(`حفل خطوبة ${appState.groomName} & ${appState.brideName}`);
  const details = encodeURIComponent(`يسعدنا حضوركم حفل الخطوبة في ${appState.hallName}.\nالعنوان: ${appState.address}`);
  const location = encodeURIComponent(appState.address);
  
  // Format dates for Google Calendar (YYYYMMDDTHHMMSSZ)
  const eventDate = new Date(appState.eventDateTime);
  const startTime = eventDate.toISOString().replace(/-|:|\.\d\d\d/g, "");
  const endDate = new Date(eventDate.getTime() + (4 * 60 * 60 * 1000));
  const endTime = endDate.toISOString().replace(/-|:|\.\d\d\d/g, "");

  const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTime}/${endTime}&details=${details}&location=${location}`;
  window.open(gCalUrl, '_blank');
});

shareWhatsappBtn.addEventListener('click', () => {
  const text = encodeURIComponent(
    `✨ يسرنا دعوتكم لحضور حفل خطوبة:\n💍 ${appState.groomName} & ${appState.brideName}\n\n📅 ${appState.dateArabic}\n⏰ ${appState.timeText}\n📍 ${appState.hallName}\n\nننتظر تشريفكم ومشاركتنا أجمل اللحظات! 🌹\nرابط الدعوة: ${window.location.href}`
  );
  window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
});

// ==========================================================
// CUSTOMIZER MODAL CONTROLS
// ==========================================================
customizerToggleBtn.addEventListener('click', () => {
  customizerModal.classList.remove('hidden');
});

closeCustomizerBtn.addEventListener('click', () => {
  customizerModal.classList.add('hidden');
});

customizerOverlay.addEventListener('click', () => {
  customizerModal.classList.add('hidden');
});

// Photo upload preview handler
custPhotoUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      appState.couplePhoto = event.target.result;
    };
    reader.readAsDataURL(file);
  }
});

saveCustomizerBtn.addEventListener('click', () => {
  appState.groomName = custGroomName.value.trim() || appState.groomName;
  appState.brideName = custBrideName.value.trim() || appState.brideName;
  if (custEventDateTime.value) appState.eventDateTime = custEventDateTime.value;
  appState.dateArabic = custDateArabic.value.trim() || appState.dateArabic;
  appState.timeText = custTimeText.value.trim() || appState.timeText;
  appState.hallName = custHallName.value.trim() || appState.hallName;
  appState.address = custAddress.value.trim() || appState.address;
  appState.mapUrl = custMapUrl.value.trim() || appState.mapUrl;

  saveState();
  renderUI();
  updateCountdown();
  customizerModal.classList.add('hidden');

  if (typeof confetti === 'function') {
    confetti({ particleCount: 40, spread: 50 });
  }
});

resetCustomizerBtn.addEventListener('click', () => {
  if (confirm('هل تريد استعادة البيانات الافتراضية؟')) {
    appState = { ...defaultState };
    saveState();
    renderUI();
    updateCountdown();
    customizerModal.classList.add('hidden');
  }
});

// Initialize on page load
initAudio();
