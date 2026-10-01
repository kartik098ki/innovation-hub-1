/**
 * Ambient Animated Dark Background Engine for Ridehack 2026 / BECon
 * Features:
 * - Interactive Particle Constellation (stars, micro-dust, connections)
 * - Gentle Mouse Gravity / Ripple
 * - Sporadic Graceful Shooting Stars
 * - Auto-pausing on tab hide for 60fps battery-saving performance
 * - HiDPI (Retina) support
 */

(function () {
  'use strict';

  // Prevent multiple initializations
  if (window.__ambientBackgroundInitialized) return;
  window.__ambientBackgroundInitialized = true;

  function initHomepageVideo() {
    const video = document.querySelector('main video');
    if (!video) return;

    video.querySelectorAll('source').forEach((source) => source.remove());
    video.src = new URL('WhatsApp Video 2026-09-29 at 23.44.17.mp4', document.baseURI).href;
    video.muted = true;
    video.controls = true;
    video.load();
  }

  function initHomepageFooterImage() {
    const image = document.querySelector('footer img[alt="Ridehack Logo"]');
    if (!image || image.getAttribute('src')) return;

    image.src = new URL('ridehack-2026-hero.jpg', document.baseURI).href;
    image.alt = 'Ridehack 2026 event photo';
  }

  function initHorizontalStatsMarquee() {
    const marquee = document.querySelector('.mask-linear-fade');
    const track = marquee?.children[2];
    if (!marquee || !track) return;

    marquee.classList.add('mt-8', 'horizontal-stats-marquee');
    track.classList.add('horizontal-stats-marquee-track');
  }

  function removeAccommodationPromo() {
    const heading = Array.from(document.querySelectorAll('main h3')).find(
      (element) => element.textContent.trim() === 'Need a Place to Stay?'
    );
    heading?.closest('div.mt-16')?.remove();
  }

  function initScrollAwareNavigation() {
    document.querySelectorAll('#mobileMenuDrawer a').forEach((link) => {
      if (link.textContent.trim().toLowerCase() === 'sponsors') {
        link.textContent = 'Grants';
      }
    });

    const desktopNavigation = Array.from(document.querySelectorAll('div.fixed')).find((element) =>
      element.classList.contains('hidden') &&
      element.classList.contains('md:flex')
    );
    if (!desktopNavigation) return;

    const panel = desktopNavigation.firstElementChild;
    if (!panel) return;
    const logoLink = panel.querySelector('a');
    if (!logoLink) return;

    panel.querySelectorAll('a').forEach((link) => {
      const label = link.textContent.trim().toLowerCase();
      const href = link.getAttribute('href') || '';
      if (
        href.includes('map.edciitd.com') ||
        href.includes('thedopaminestore.in/collections/becon-iit-delhi') ||
        ['map', 'shop', 'sign in', 'log in'].includes(label)
      ) {
        link.remove();
      } else if (label === 'sponsors') {
        link.textContent = 'Grants';
      }
    });

    const row = Array.from(panel.querySelectorAll('div')).find((element) =>
      element.classList.contains('absolute') &&
      element.classList.contains('justify-between') &&
      element.contains(logoLink)
    );
    const links = Array.from(row.children).find((element) => !element.contains(logoLink));
    if (!row || !links) return;

    panel.classList.add('site-nav-panel');
    row.classList.add('site-nav-row');
    links.classList.add('site-nav-links');

    let collapsed = false;
    const setCollapsed = (shouldCollapse) => {
      if (collapsed === shouldCollapse) return;
      collapsed = shouldCollapse;
      panel.classList.toggle('site-nav-compact', collapsed);
      row.classList.toggle('site-nav-row-collapsed', collapsed);
      links.classList.toggle('site-nav-links-hidden', collapsed);
      links.inert = collapsed;
    };

    let previousScrollY = window.scrollY;
    setCollapsed(previousScrollY > 32);
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      const direction = currentScrollY - previousScrollY;

      if (currentScrollY <= 32) setCollapsed(false);
      else if (direction > 5) setCollapsed(true);
      else if (direction < -5) setCollapsed(false);

      if (Math.abs(direction) > 5 || currentScrollY <= 32) {
        previousScrollY = currentScrollY;
      }
    }, { passive: true });
  }

  function initScrollReveal() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const candidates = document.querySelectorAll(
      'main section:not(#hero):not([aria-label]), main [class~="mb-20"], main [class~="mb-24"], main [class*="grid-cols-"] > *, main [class*="flex-wrap"] > *, main [class*="space-y-8"] > *'
    );
    const targets = Array.from(candidates).filter((element) =>
      !element.parentElement.closest('section:not(#hero):not([aria-label]), [class~="mb-20"], [class~="mb-24"]')
    );

    if (!('IntersectionObserver' in window)) {
      targets.forEach((element) => element.classList.add('scroll-reveal-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('scroll-reveal-visible');
        activeObserver.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    targets.forEach((element) => {
      element.classList.add('scroll-reveal');
      observer.observe(element);
    });
  }

  function initTaglineReveal() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const taglineLines = [
      'Where Bold Ideas Meet Capital',
      "JIIT's Premier Startup Pitching Event"
    ];
    const tagline = taglineLines.join(' | ');
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let textNode;

    while ((textNode = walker.nextNode())) {
      if (textNode.nodeValue.replace(/\s+/g, ' ').trim() !== tagline) continue;

      const label = textNode.parentElement;
      label.setAttribute('aria-label', tagline);

      const fragment = document.createDocumentFragment();
      const lettersByLine = taglineLines.map((lineText) => {
        const line = document.createElement('span');
        line.className = 'tagline-reveal-line';
        line.setAttribute('aria-hidden', 'true');

        const letters = Array.from(lineText, (character) => {
          const letter = document.createElement('span');
          letter.className = 'tagline-reveal-letter';
          letter.textContent = character;
          line.appendChild(letter);
          return letter;
        });

        fragment.appendChild(line);
        return letters;
      });
      textNode.replaceWith(fragment);

      const style = document.createElement('style');
      style.textContent = '.tagline-reveal-line { display: block; white-space: pre-wrap; } .tagline-reveal-letter { display: inline-block; opacity: 0; transform: translateY(0.35em); transition: opacity 180ms ease, transform 180ms ease; } .tagline-reveal-letter.is-visible { opacity: 1; transform: translateY(0); }';
      document.head.appendChild(style);

      const pause = (duration) => new Promise((resolve) => setTimeout(resolve, duration));
      const revealLine = async (letters) => {
        for (const letter of letters) {
          letter.classList.add('is-visible');
          await pause(38);
        }
      };

      (async function repeatReveal() {
        while (true) {
          await revealLine(lettersByLine[0]);
          await pause(450);
          await revealLine(lettersByLine[1]);
          await pause(1400);
          lettersByLine.flat().forEach((letter) => letter.classList.remove('is-visible'));
          await pause(350);
        }
      })();
      break;
    }
  }

  function initAmbientBackground() {
    initHomepageVideo();
    initHomepageFooterImage();
    initHorizontalStatsMarquee();
    removeAccommodationPromo();
    initScrollAwareNavigation();
    initScrollReveal();
    initTaglineReveal();

    // 1. Inject Background DOM Structure if not present
    let bgContainer = document.getElementById('site-ambient-bg');
    if (!bgContainer) {
      bgContainer = document.createElement('div');
      bgContainer.id = 'site-ambient-bg';
      bgContainer.setAttribute('aria-hidden', 'true');
      bgContainer.innerHTML = `
        <div class="ambient-grid-overlay"></div>
        <div class="ambient-nebula nebula-1"></div>
        <div class="ambient-nebula nebula-2"></div>
        <div class="ambient-nebula nebula-3"></div>
        <div class="ambient-beam"></div>
        <canvas id="site-ambient-canvas"></canvas>
      `;
      document.body.prepend(bgContainer);
    }

    const canvas = document.getElementById('site-ambient-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }

    resize();
    window.addEventListener('resize', debounce(resize, 150));

    // Particle Setup
    const isMobile = width < 768;
    const PARTICLE_COUNT = isMobile ? 38 : 80;
    const MAX_DISTANCE = isMobile ? 85 : 120;
    const particles = [];

    // Mouse Tracking
    const mouse = { x: -9999, y: -9999, radius: 140, active: false };
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    });

    // Particle Colors (Deep violet, electric purple, neon cyan-tinted white, starlight)
    const colors = [
      { r: 168, g: 85, b: 247 }, // #a855f7 (Purple)
      { r: 192, g: 132, b: 252 }, // #c084fc (Light purple)
      { r: 129, g: 140, b: 248 }, // #818cf8 (Indigo)
      { r: 236, g: 72, b: 153 }, // #ec4899 (Pink/Magenta accent)
      { r: 255, g: 255, b: 255 }  // Pure white starlight
    ];

    class Particle {
      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        this.x = init ? Math.random() * width : (Math.random() > 0.5 ? 0 : width);
        this.y = Math.random() * height;
        this.baseRadius = Math.random() * 1.6 + 0.6;
        this.radius = this.baseRadius;
        
        // Very slow, soothing drift
        const speed = Math.random() * 0.35 + 0.12;
        const angle = Math.random() * Math.PI * 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.baseAlpha = Math.random() * 0.55 + 0.25;
        this.alpha = this.baseAlpha;
        this.twinkleSpeed = Math.random() * 0.02 + 0.008;
        this.twinkleOffset = Math.random() * Math.PI * 2;
      }

      update(time) {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around edges seamlessly
        if (this.x < -10) this.x = width + 10;
        else if (this.x > width + 10) this.x = -10;
        if (this.y < -10) this.y = height + 10;
        else if (this.y > height + 10) this.y = -10;

        // Twinkle calculation
        this.alpha = this.baseAlpha + Math.sin(time * this.twinkleSpeed + this.twinkleOffset) * 0.22;
        if (this.alpha < 0.1) this.alpha = 0.1;
        if (this.alpha > 0.9) this.alpha = 0.9;

        // Mouse interaction (gentle displacement & glow)
        if (mouse.active) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.hypot(dx, dy);

          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            // Soft repelling push
            this.x -= Math.cos(angle) * force * 1.5;
            this.y -= Math.sin(angle) * force * 1.5;
            this.radius = this.baseRadius + force * 1.2;
            this.alpha = Math.min(1, this.alpha + force * 0.4);
          } else {
            this.radius = this.baseRadius;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha})`;
        ctx.fill();

        // Soft halo on larger particles
        if (this.radius > 1.4) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha * 0.18})`;
          ctx.fill();
        }
      }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }

    // Shooting Star / Meteor System
    class ShootingStar {
      constructor() {
        this.reset();
      }

      reset() {
        this.active = false;
        this.x = 0;
        this.y = 0;
        this.length = 0;
        this.speed = 0;
        this.angle = 0;
        this.opacity = 0;
        this.life = 0;
        this.maxLife = 0;
        // Schedule next streak in 4-9 seconds
        this.waitTime = Math.random() * 300 + 240;
      }

      trigger() {
        this.active = true;
        this.x = Math.random() * (width * 0.8) + width * 0.1;
        this.y = Math.random() * (height * 0.4);
        this.length = Math.random() * 120 + 80;
        this.speed = Math.random() * 10 + 14;
        this.angle = (Math.PI / 4) + (Math.random() * 0.2 - 0.1); // ~45 degrees diagonal
        this.opacity = 1;
        this.maxLife = Math.random() * 35 + 25;
        this.life = this.maxLife;
      }

      update() {
        if (!this.active) {
          this.waitTime--;
          if (this.waitTime <= 0) {
            this.trigger();
          }
          return;
        }

        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.life--;

        // Fade in & out
        if (this.life > this.maxLife * 0.7) {
          this.opacity = (this.maxLife - this.life) / (this.maxLife * 0.3);
        } else {
          this.opacity = this.life / (this.maxLife * 0.7);
        }

        if (this.life <= 0 || this.x > width + 100 || this.y > height + 100) {
          this.reset();
        }
      }

      draw() {
        if (!this.active || this.opacity <= 0) return;

        const tailX = this.x - Math.cos(this.angle) * this.length;
        const tailY = this.y - Math.sin(this.angle) * this.length;

        const grad = ctx.createLinearGradient(this.x, this.y, tailX, tailY);
        grad.addColorStop(0, `rgba(255, 255, 255, ${this.opacity * 0.9})`);
        grad.addColorStop(0.3, `rgba(168, 85, 247, ${this.opacity * 0.6})`);
        grad.addColorStop(1, `rgba(147, 51, 234, 0)`);

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.8;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Bright spark head
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(192, 132, 252, 0.9)';
        ctx.fill();
        ctx.restore();
      }
    }

    const shootingStar = new ShootingStar();

    // Render Loop
    let animId = null;
    let isVisible = true;
    let lastTime = 0;

    function render(timestamp) {
      if (!isVisible) return;

      lastTime = timestamp;
      ctx.clearRect(0, 0, width, height);

      // Update & Draw Particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update(timestamp);
        particles[i].draw();
      }

      // Draw Constellation Connections
      ctx.lineWidth = 0.75;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < MAX_DISTANCE) {
            const alpha = (1 - dist / MAX_DISTANCE) * 0.22 * Math.min(particles[i].alpha, particles[j].alpha);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
            ctx.stroke();
          }
        }

        // Connect to mouse if close
        if (mouse.active) {
          const dx = mouse.x - particles[i].x;
          const dy = mouse.y - particles[i].y;
          const dist = Math.hypot(dx, dy);

          if (dist < mouse.radius * 0.85) {
            const alpha = (1 - dist / (mouse.radius * 0.85)) * 0.32;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(particles[i].x, particles[i].y);
            ctx.strokeStyle = `rgba(192, 132, 252, ${alpha})`;
            ctx.stroke();
          }
        }
      }

      // Update & Draw Shooting Star
      shootingStar.update();
      shootingStar.draw();

      animId = requestAnimationFrame(render);
    }

    // Visibility Handling to save battery & maintain 60 FPS
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        isVisible = false;
        if (animId) cancelAnimationFrame(animId);
      } else {
        isVisible = true;
        animId = requestAnimationFrame(render);
      }
    });

    animId = requestAnimationFrame(render);
  }

  function debounce(fn, ms) {
    let timer;
    return function () {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, arguments), ms);
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAmbientBackground);
  } else {
    initAmbientBackground();
  }
})();
