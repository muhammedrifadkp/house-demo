/* =========================================================
   AAROHAM ✦ Housewarming & Kudiveppu Experience Script
   GSAP, ScrollTrigger, Lenis Smooth Scroll, Canvas Confetti
   ========================================================= */

(() => {
  'use strict';

  /* ---------------------------------------------------------
     EVENT CONFIGURATION
     --------------------------------------------------------- */
  const EVENT_CONFIG = {
    title: "Aaroham ✦ Housewarming & Kudiveppu Ceremony",
    houseName: "Aaroham",
    hosts: "Mr. Rahul Krishnan & Mrs. Lakshmi Rahul",
    startISO: "2026-11-24T09:30:00+05:30", // Sunday, 24 Nov 2026, 09:30 AM IST
    endISO: "2026-11-24T20:30:00+05:30",
    venueName: "Aaroham Villa",
    venueAddress: "Hillview Enclave, Wayanad Road, Near Golf Links, Kozhikode, Kerala 673009",
    mapsUrl: "https://maps.google.com/?q=Wayanad+Road+Kozhikode+Kerala",
    whatsappPhone: "919876543210",
  };

  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
  const root = document.documentElement;
  const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = !!(window.gsap && window.ScrollTrigger);

  const GOLD_PALETTE = ['#f7e7b0', '#d4af37', '#ffd966', '#1d5f42', '#0f3d2a', '#fff8e7'];

  /* ---------------------------------------------------------
     AUDIO SYSTEM (BGM + Web Audio Chime Synthesizer)
     --------------------------------------------------------- */
  const audioEl = $('#bgmAudio');
  const musicToggle = $('#musicToggle');
  let audioContext = null;
  let isMusicPlaying = false;
  let userWantsMusic = false;

  function initAudioContext() {
    if (!audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) audioContext = new AudioCtx();
    }
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }
  }

  // Plays a soft temple chime/bell sound when lighting lamps
  function playChime(freq = 528) {
    try {
      initAudioContext();
      if (!audioContext) return;
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioContext.currentTime);

      gain.gain.setValueAtTime(0.2, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(audioContext.destination);

      osc.start();
      osc.stop(audioContext.currentTime + 1.2);
    } catch {
      // AudioContext unavailable or blocked
    }
  }

  function updateMusicUI(playing) {
    isMusicPlaying = playing;
    musicToggle.classList.toggle('is-playing', playing);
    musicToggle.setAttribute('aria-pressed', String(playing));
    musicToggle.setAttribute('aria-label', playing ? 'Pause celebration music' : 'Play celebration music');
  }

  function startMusic() {
    userWantsMusic = true;
    initAudioContext();
    if (audioEl) {
      audioEl.volume = 0.55;
      const promise = audioEl.play();
      if (promise && promise.catch) {
        promise.catch(() => updateMusicUI(false));
      }
    }
  }

  function pauseMusic() {
    userWantsMusic = false;
    if (audioEl) audioEl.pause();
  }

  if (audioEl) {
    audioEl.addEventListener('play', () => updateMusicUI(true));
    audioEl.addEventListener('pause', () => updateMusicUI(false));
  }

  if (musicToggle) {
    musicToggle.addEventListener('click', () => {
      if (isMusicPlaying) pauseMusic();
      else startMusic();
    });
  }

  // Pause on background tab, resume on focus if requested
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (audioEl) audioEl.pause();
    } else if (userWantsMusic && audioEl) {
      audioEl.play().catch(() => {});
    }
  });

  /* ---------------------------------------------------------
     CONFETTI BURST
     --------------------------------------------------------- */
  function burstConfetti(type = 'grand') {
    if (!window.confetti || prefersReducedMotion) return;
    const baseOpts = { colors: GOLD_PALETTE, disableForReducedMotion: true, zIndex: 1200 };

    if (type === 'grand') {
      confetti({ ...baseOpts, particleCount: 80, angle: 60, spread: 70, startVelocity: 65, origin: { x: 0, y: 0.75 } });
      confetti({ ...baseOpts, particleCount: 80, angle: 120, spread: 70, startVelocity: 65, origin: { x: 1, y: 0.75 } });
      setTimeout(() => {
        confetti({ ...baseOpts, particleCount: 110, spread: 100, startVelocity: 42, scalar: 1.15, origin: { x: 0.5, y: 0.3 } });
      }, 300);
    } else if (type === 'sparkle') {
      confetti({ ...baseOpts, particleCount: 40, spread: 60, startVelocity: 35, origin: { x: 0.5, y: 0.6 } });
    }
  }

  /* ---------------------------------------------------------
     ENTRANCE GATE / UNLOCKING KEY CEREMONY
     --------------------------------------------------------- */
  const gateEl = $('#gateOverlay');
  const unlockKeyBtn = $('#unlockKeyBtn');
  let isGateUnlocked = false;

  function finishGateOpening() {
    if (gateEl) gateEl.remove();
    root.classList.remove('is-locked');
    if (hasGsap) ScrollTrigger.refresh();
  }

  function unlockEntrance() {
    if (isGateUnlocked) return;
    isGateUnlocked = true;

    startMusic();
    playChime(640);

    if (!hasGsap || prefersReducedMotion) {
      if (gateEl) {
        gateEl.style.opacity = '0';
        gateEl.style.transition = 'opacity 0.8s ease';
        setTimeout(finishGateOpening, 800);
      }
      burstConfetti('grand');
      return;
    }

    const tl = gsap.timeline({ onComplete: finishGateOpening });

    tl.to(unlockKeyBtn, { scale: 1.25, rotation: 30, autoAlpha: 0, duration: 0.6, ease: 'back.in(1.8)' }, 0)
      .to(['.gate-eyebrow', '.gate-prompt', '.gate-audio-cue', '.gate-house-sub'], { autoAlpha: 0, y: -20, duration: 0.45, stagger: 0.05 }, 0)
      .to('.gate-door--left', { xPercent: -100, duration: 1.6, ease: 'power3.inOut' }, 0.3)
      .to('.gate-door--right', { xPercent: 100, duration: 1.6, ease: 'power3.inOut' }, 0.3)
      .to(gateEl, { backgroundColor: 'rgba(6,20,14,0)', duration: 1.2, ease: 'power2.inOut' }, 0.5)
      .add(() => burstConfetti('grand'), 0.8)
      .from('.hero-photo-wrap', { scale: 0.88, autoAlpha: 0, duration: 1.4, ease: 'expo.out' }, 0.6)
      .from('.hero-title', { y: 40, autoAlpha: 0, duration: 1.2, ease: 'expo.out' }, 0.7)
      .from('.hero-quote', { y: 20, autoAlpha: 0, duration: 1 }, 0.9);
  }

  if (unlockKeyBtn) {
    unlockKeyBtn.addEventListener('click', unlockEntrance);
  }

  /* ---------------------------------------------------------
     PROGRESS BAR & SCROLL ANIMATIONS
     --------------------------------------------------------- */
  function initScrollEffects() {
    // Progress Bar
    const progressBar = $('#progressBarSpan');
    window.addEventListener('scroll', () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      if (progressBar) progressBar.style.width = scrolled + '%';
    }, { passive: true });

    if (!hasGsap || prefersReducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    // Hero parallax
    gsap.to('.hero-photo-wrap', {
      yPercent: 10,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      }
    });

    // Section headers fade up
    $$('.section-head, .blessing-card, .ticket-pass, .ritual-stage').forEach(el => {
      gsap.from(el, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
        }
      });
    });

    // Timeline items reveal
    $$('.timeline-item').forEach((item, idx) => {
      gsap.from(item, {
        x: idx % 2 === 0 ? 30 : -30,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
        }
      });
    });
  }

  /* ---------------------------------------------------------
     NILAVILAKKU INTERACTIVE RITUAL (വിളക്ക് തെളിയിക്കൽ)
     --------------------------------------------------------- */
  function initNilavilakku() {
    const wicks = $$('.wick-tap-btn');
    const flames = $$('.lamp-flame');
    const counterEl = $('#lampLitCounter');
    const statusMsg = $('#ritualStatusMsg');
    const resetBtn = $('#resetLampBtn');
    let litCount = 0;
    const notes = [440, 528, 587, 659, 880];

    wicks.forEach((wick, index) => {
      wick.addEventListener('click', () => {
        const flame = flames[index];
        if (!flame || flame.classList.contains('is-lit')) return;

        flame.classList.add('is-lit');
        litCount++;
        playChime(notes[index] || 528);
        burstConfetti('sparkle');

        if (counterEl) counterEl.textContent = `${litCount} of 5 Flames Lit`;

        if (litCount === 1) {
          if (statusMsg) statusMsg.textContent = "The first flame glows. Four more to kindle!";
        } else if (litCount < 5) {
          if (statusMsg) statusMsg.textContent = `Auspicious light fills the hall! ${5 - litCount} more to kindle.`;
        } else if (litCount === 5) {
          if (statusMsg) {
            statusMsg.innerHTML = "✨ <strong>Aaroham is bathed in holy light!</strong> May prosperity, health & joy dwell within these walls forever. Thank you for your divine blessing! ✨";
          }
          if (resetBtn) resetBtn.hidden = false;
          setTimeout(() => burstConfetti('grand'), 400);
        }
      });
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        flames.forEach(f => f.classList.remove('is-lit'));
        litCount = 0;
        if (counterEl) counterEl.textContent = "0 of 5 Flames Lit";
        if (statusMsg) statusMsg.textContent = "Tap each wick on the Nilavilakku to ignite the holy flame.";
        resetBtn.hidden = true;
      });
    }
  }

  /* ---------------------------------------------------------
     COUNTDOWN TIMER
     --------------------------------------------------------- */
  function initCountdown() {
    const targetTime = new Date(EVENT_CONFIG.startISO).getTime();
    const daysEl = $('[data-time="days"]');
    const hoursEl = $('[data-time="hours"]');
    const minsEl = $('[data-time="mins"]');
    const secsEl = $('[data-time="secs"]');
    const labelEl = $('#countdownLabel');

    function update() {
      const now = Date.now();
      const diff = targetTime - now;

      if (diff <= 0) {
        if (labelEl) labelEl.textContent = "✨ The Housewarming Celebrations are LIVE today! ✨";
        if (daysEl) daysEl.textContent = "00";
        if (hoursEl) hoursEl.textContent = "00";
        if (minsEl) minsEl.textContent = "00";
        if (secsEl) secsEl.textContent = "00";
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      if (daysEl) daysEl.textContent = String(d).padStart(2, '0');
      if (hoursEl) hoursEl.textContent = String(h).padStart(2, '0');
      if (minsEl) minsEl.textContent = String(m).padStart(2, '0');
      if (secsEl) secsEl.textContent = String(s).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
  }

  /* ---------------------------------------------------------
     CALENDAR & WHATSAPP ACTION BUTTONS
     --------------------------------------------------------- */
  function initCalendarAndShare() {
    const start = new Date(EVENT_CONFIG.startISO);
    const end = new Date(EVENT_CONFIG.endISO);
    const formatDate = d => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

    // Google Calendar Link
    const gcalParams = new URLSearchParams({
      action: 'TEMPLATE',
      text: EVENT_CONFIG.title,
      dates: `${formatDate(start)}/${formatDate(end)}`,
      details: `Housewarming & Kudiveppu celebration of ${EVENT_CONFIG.hosts} at ${EVENT_CONFIG.houseName}. You are cordially invited for the rituals and grand feast!`,
      location: EVENT_CONFIG.venueAddress,
    });
    const gcalBtn = $('#btnGCal');
    if (gcalBtn) {
      gcalBtn.href = `https://calendar.google.com/calendar/render?${gcalParams.toString()}`;
    }

    // Apple / Outlook .ics
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Aaroham//Housewarming Invitation//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:aaroham-housewarming-${Date.now()}@invite`,
      `DTSTAMP:${formatDate(new Date())}`,
      `DTSTART:${formatDate(start)}`,
      `DTEND:${formatDate(end)}`,
      `SUMMARY:${EVENT_CONFIG.title}`,
      `DESCRIPTION:You are cordially invited to celebrate the housewarming of ${EVENT_CONFIG.hosts} at ${EVENT_CONFIG.houseName}.`,
      `LOCATION:${EVENT_CONFIG.venueAddress}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const icsBtn = $('#btnICS');
    if (icsBtn) {
      icsBtn.href = `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`;
    }

    // WhatsApp RSVP
    const waBtn = $('#btnWhatsApp');
    if (waBtn) {
      const msg = `Namaste! We are delighted to RSVP for Aaroham's Housewarming ceremony on Sunday, 24 Nov 2026. Looking forward to blessing your new home! 🏡✨`;
      waBtn.href = `https://wa.me/${EVENT_CONFIG.whatsappPhone}?text=${encodeURIComponent(msg)}`;
    }
  }

  /* ---------------------------------------------------------
     INTERACTIVE TOUR TABS & LIGHTBOX
     --------------------------------------------------------- */
  function initTourTabs() {
    const tabBtns = $$('.tour-tab-btn');
    const cards = $$('.tour-card');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');

        const filter = btn.dataset.filter;
        cards.forEach(card => {
          if (filter === 'all' || card.dataset.category === filter) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

    // Lightbox Modal
    const lightbox = $('#lightboxModal');
    const lightboxImg = $('#lightboxImg');
    const lightboxClose = $('#lightboxClose');

    $$('.tour-card-media').forEach(media => {
      media.addEventListener('click', () => {
        const img = $('img', media);
        if (img && lightbox && lightboxImg) {
          lightboxImg.src = img.src;
          lightbox.classList.add('is-active');
        }
      });
    });

    function closeLightbox() {
      if (lightbox) lightbox.classList.remove('is-active');
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightbox) {
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
      });
    }
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  /* ---------------------------------------------------------
     RSVP & GUESTBOOK BLESSINGS WALL (LocalStorage)
     --------------------------------------------------------- */
  const INITIAL_BLESSINGS = [
    {
      name: "Dr. K. Jayadevan & Family",
      attending: true,
      text: "പുതിയ വീടിന്റെ പടിവാതിലിൽ ഐശ്വര്യവും സർവ്വ ഐശ്വര്യങ്ങളും നിറയട്ടെ! രാഹുലിനും ലക്ഷ്മിക്കും മക്കൾക്കും സ്നേഹാശംസകൾ.",
      time: "2 hours ago"
    },
    {
      name: "Harish & Meera Nambiar",
      attending: true,
      text: "Heartiest congratulations on building such an architectural marvel! We wouldn't miss this grand celebration for anything. See you on the 24th!",
      time: "Yesterday"
    },
    {
      name: "Suresh Babu (Dubai)",
      attending: true,
      text: "May peace, health, and limitless joy dwell in Aaroham forever. Warmest regards from all of us in the UAE.",
      time: "2 days ago"
    }
  ];

  function initGuestbook() {
    const listEl = $('#blessingsList');
    const form = $('#rsvpForm');
    const formStatus = $('#formStatusMsg');

    const STORAGE_KEY = 'aaroham_guest_blessings';
    let savedBlessings = [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      savedBlessings = data ? JSON.parse(data) : INITIAL_BLESSINGS;
    } catch {
      savedBlessings = INITIAL_BLESSINGS;
    }

    function renderBlessings() {
      if (!listEl) return;
      listEl.innerHTML = savedBlessings.map(b => `
        <article class="blessing-entry">
          <div class="blessing-entry-head">
            <span class="blessing-author">${escapeHTML(b.name)}</span>
            <span class="blessing-tag">${b.attending ? 'Attending with Joy' : 'Best Wishes Sent'}</span>
          </div>
          <p class="blessing-text">“${escapeHTML(b.text)}”</p>
          <time class="blessing-time">${escapeHTML(b.time || 'Just now')}</time>
        </article>
      `).join('');
    }

    function escapeHTML(str) {
      return String(str).replace(/[&<>'"]/g, tag => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
      }[tag] || tag));
    }

    renderBlessings();

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = $('#guestName').value.trim();
        const attending = $('input[name="attending"]:checked').value === 'yes';
        const count = $('#guestCount').value;
        const msg = $('#guestMessage').value.trim();
        const honeypot = $('#formWebsite').value;

        if (honeypot) return; // bot detected
        if (!name) return;

        const newBlessing = {
          name: `${name} ${count > 1 ? `(+${count - 1})` : ''}`,
          attending: attending,
          text: msg || (attending ? "Thrilled to join you for the celebrations! Wishing endless joy and peace to Aaroham." : "Sending our heartfelt love and prayers for your new home!"),
          time: "Just now"
        };

        savedBlessings.unshift(newBlessing);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(savedBlessings.slice(0, 30)));
        } catch {}

        renderBlessings();
        form.reset();
        burstConfetti('sparkle');

        if (formStatus) {
          formStatus.style.display = 'block';
          formStatus.innerHTML = `✨ <strong>Thank you, ${escapeHTML(name)}!</strong> Your RSVP and beautiful blessing have been recorded on the wall. ✨`;
          setTimeout(() => { formStatus.style.display = 'none'; }, 6000);
        }
      });
    }
  }

  /* ---------------------------------------------------------
     3D TILT EFFECT ON CARD
     --------------------------------------------------------- */
  function initTiltCard() {
    const card = $('.tilt-card');
    if (!card || prefersReducedMotion) return;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotX = -(y / (rect.height / 2)) * 10;
      const rotY = (x / (rect.width / 2)) * 10;
      card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
    });
  }

  /* ---------------------------------------------------------
     SMOOTH SCROLL ANCHORS
     --------------------------------------------------------- */
  function initSmoothAnchors() {
    $$('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#' || href === '') return;
        const target = $(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        }
      });
    });
  }

  /* ---------------------------------------------------------
     INITIALIZATION
     --------------------------------------------------------- */
  window.addEventListener('DOMContentLoaded', () => {
    initScrollEffects();
    initNilavilakku();
    initCountdown();
    initCalendarAndShare();
    initTourTabs();
    initGuestbook();
    initTiltCard();
    initSmoothAnchors();
  });
})();
