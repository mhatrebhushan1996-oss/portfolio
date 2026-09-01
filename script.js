class DCLogic {}

class Component extends DCLogic {
  componentDidMount() {
    const root = document.querySelector('[data-root]');
    if (!root) return;
    this.root = root;
    this.tracks = [...root.querySelectorAll('[data-track]')].map(el => ({ el, name: el.dataset.track }));
    this.cursor = root.querySelector('[data-el="cursor"]');
    this.cdot = root.querySelector('[data-el="cursorDot"]');
    this.clabel = root.querySelector('[data-el="cursorLabel"]');
    this.mouse = { x: innerWidth / 2, y: innerHeight / 2 };
    this.pos = { ...this.mouse };

    this.onScroll = () => { this.dirty = true; };
    this.onMove = e => {
      this.mouse.x = e.clientX; this.mouse.y = e.clientY;
      const t = e.target.closest ? e.target.closest('[data-cursor="view"]') : null;
      this.setCursor(!!t);
      const visual = e.target.closest ? e.target.closest('.work-visual-link') : null;
      if (visual !== this.workVisual) {
        if (this.workVisual) {
          this.workVisual.style.setProperty('--mx', '0px');
          this.workVisual.style.setProperty('--my', '0px');
        }
        this.workVisual = visual;
      }
      if (visual) {
        const vr = visual.getBoundingClientRect();
        visual.style.setProperty('--mx', `${((e.clientX - vr.left) / vr.width - .5) * 8}px`);
        visual.style.setProperty('--my', `${((e.clientY - vr.top) / vr.height - .5) * 8}px`);
      }
      const workCard = e.target.closest ? e.target.closest('.work-flip-viewport') : null;
      if (workCard && this.workCta && matchMedia('(hover: hover) and (pointer: fine)').matches) {
        const cr = workCard.getBoundingClientRect();
        const size = this.workCta.offsetWidth || 112;
        const desiredLeft = Math.max(12, Math.min(cr.width - size - 12, e.clientX - cr.left - size / 2));
        const desiredTop = Math.max(12, Math.min(cr.height - size - 12, e.clientY - cr.top - size / 2));
        const baseLeft = cr.width - size + 34;
        this.workCtaTarget.x = desiredLeft - baseLeft;
        this.workCtaTarget.y = desiredTop + 34;
      } else if (this.workCta) {
        this.workCtaTarget.x = 0;
        this.workCtaTarget.y = 0;
      }
      const m = e.target.closest ? e.target.closest('[data-magnet]') : null;
      if (m !== this.magnet) { if (this.magnet) this.magnet.style.transform = 'translate3d(0,0,0)'; this.magnet = m; }
      if (m) {
        const r = m.getBoundingClientRect();
        m.style.transition = 'transform .35s cubic-bezier(.16,1,.3,1)';
        m.style.transform = `translate3d(${(e.clientX - (r.left + r.width / 2)) * 0.35}px,${(e.clientY - (r.top + r.height / 2)) * 0.4}px,0)`;
      }
    };
    addEventListener('scroll', this.onScroll, { passive: true });
    addEventListener('resize', this.onScroll);
    addEventListener('mousemove', this.onMove, { passive: true });

    this.workItems = [
      { title: 'Novus Finance', industry: 'DIGITAL TRANSFORMATION', description: 'One connected financial ecosystem designed to turn complex treasury decisions into clear, confident action.', services: 'UX / UI · DEVELOPMENT · STRATEGY', category: 'FINTECH PLATFORM', year: '2026', src: './assets/work/dignisys-finance.png', alt: 'Enterprise finance analytics platform on a widescreen display', focusY: 50 },
      { title: 'Aster Health', industry: 'DIGITAL HEALTH', description: 'A calmer digital care journey connecting patients, clinicians and everyday health insight.', services: 'PRODUCT DESIGN · RESEARCH · MOBILE', category: 'HEALTH ECOSYSTEM', year: '2026', src: './assets/work/dignisys-health.png', alt: 'Two mobile devices presenting a digital health experience', focusY: 50 },
      { title: 'Northline', industry: 'CONNECTED OPERATIONS', description: 'A real-time operational twin that gives global logistics teams one precise view of movement and risk.', services: 'SERVICE DESIGN · 3D · ENGINEERING', category: 'LOGISTICS SYSTEM', year: '2025', src: './assets/work/dignisys-logistics.png', alt: 'Digital twin of a connected logistics distribution centre', focusY: 50 },
      { title: 'CoreVista', industry: 'ENTERPRISE INTELLIGENCE', description: 'A decision platform that brings fragmented commercial data into one focused executive experience.', services: 'DATA EXPERIENCE · AI · DESIGN SYSTEM', category: 'DATA PLATFORM', year: '2025', src: './assets/work/dignisys-finance.png', alt: 'Detailed enterprise intelligence interface', focusY: 54 },
      { title: 'Morrow Care', industry: 'PATIENT EXPERIENCE', description: 'An accessible companion that turns continuous health data into useful, human daily guidance.', services: 'ACCESSIBILITY · UX / UI · DEVELOPMENT', category: 'CARE PLATFORM', year: '2025', src: './assets/work/dignisys-health.png', alt: 'Accessible mobile patient experience', focusY: 48 },
      { title: 'Axis Global', industry: 'SUPPLY CHAIN', description: 'A resilient supply-chain command centre built to surface exceptions before they become disruption.', services: 'STRATEGY · PLATFORM · OPTIMISATION', category: 'OPERATIONS PLATFORM', year: '2024', src: './assets/work/dignisys-logistics.png', alt: 'Enterprise supply-chain command centre visualisation', focusY: 52 }
    ];
    this.workPreloads = this.workItems.map(item => {
      const image = new Image();
      image.src = item.src;
      if (image.decode) image.decode().catch(() => {});
      return image;
    });
    this.flipIndex = 0;
    this.flipAngle = 0;
    this.flipFaces = { a: 0, b: 1 };
    this.flipTilt = root.querySelector('[data-el="workFlipTilt"]');
    this.flipCard = root.querySelector('[data-el="workFlipCard"]');
    this.flipViewport = root.querySelector('[data-el="workFlipViewport"]');
    this.workCta = root.querySelector('.work-floating-cta');
    this.workCtaPos = { x: 0, y: 0 };
    this.workCtaTarget = { x: 0, y: 0 };
    this.procPath = root.querySelector('[data-el="procPath"]');
    this.procProgress = 0;
    this.procTarget = 0;
    if (this.procPath) {
      this.procPathLength = this.procPath.getTotalLength();
      this.procPath.style.strokeDasharray = `${this.procPathLength} ${this.procPathLength}`;
      this.procPath.style.strokeDashoffset = String(this.procPathLength);
    }
    this.flipCopy = root.querySelector('.work-flip-copy');
    this.flipImages = { a: root.querySelector('[data-el="flipImageA"]'), b: root.querySelector('[data-el="flipImageB"]') };
    const flipField = name => root.querySelector(`[data-el="${name}"]`);
    this.renderFlipMeta = index => {
      const item = this.workItems[index];
      if (!item) return;
      flipField('flipNumber').textContent = String(index + 1).padStart(2, '0');
      flipField('flipIndustry').textContent = item.industry;
      flipField('flipTitle').textContent = item.title;
      const services = flipField('flipServices');
      services.replaceChildren(...item.services.split('·').map(label => {
        const chip = document.createElement('span');
        chip.textContent = label.trim().toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
        return chip;
      }));
      flipField('flipCategory').textContent = item.category;
      flipField('flipYear').textContent = item.year;
    };
    this.flipTo = (next, preferredDirection) => {
      const n = this.workItems.length;
      next = (next + n) % n;
      if (next === this.flipIndex || next === this.flipTarget || !this.flipViewport) return;
      const direction = preferredDirection || (next > this.flipIndex ? 1 : -1);
      const item = this.workItems[next];
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.flipTarget = next;
      clearTimeout(this.flipSwapTimer);
      clearTimeout(this.flipEndTimer);
      this.flipViewport.classList.remove('is-flipping-next', 'is-flipping-prev');
      void this.flipViewport.offsetWidth;
      if (!reduced) this.flipViewport.classList.add(direction > 0 ? 'is-flipping-next' : 'is-flipping-prev');
      const swap = () => {
        const image = this.flipImages.a;
        image.src = item.src;
        image.alt = item.alt;
        image.parentElement.style.setProperty('--focus-y', `${item.focusY}%`);
        this.renderFlipMeta(next);
        this.flipCopy?.classList.remove('is-text-flipping');
        if (!reduced && this.flipCopy) {
          void this.flipCopy.offsetWidth;
          this.flipCopy.classList.add('is-text-flipping');
          clearTimeout(this.flipTextTimer);
          this.flipTextTimer = setTimeout(() => this.flipCopy?.classList.remove('is-text-flipping'), 650);
        }
        this.flipIndex = next;
        this.flipTarget = null;
      };
      if (reduced) {
        swap();
      } else {
        this.flipSwapTimer = setTimeout(swap, 390);
        this.flipEndTimer = setTimeout(() => this.flipViewport.classList.remove('is-flipping-next', 'is-flipping-prev'), 810);
      }
    };
    this.goToWorkIndex = next => {
      const track = root.querySelector('[data-track="work"]');
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const target = (next + this.workItems.length) % this.workItems.length;
      const y = scrollY + rect.top + (track.offsetHeight - innerHeight) * (target / Math.max(1, this.workItems.length - 1));
      window.scrollTo({ top: y, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    };
    this.onFlipPrev = () => this.goToWorkIndex(this.flipIndex - 1);
    this.onFlipNext = () => this.goToWorkIndex(this.flipIndex + 1);
    flipField('flipPrev')?.addEventListener('click', this.onFlipPrev);
    flipField('flipNext')?.addEventListener('click', this.onFlipNext);
    const flipViewport = root.querySelector('[data-el="workFlipViewport"]');
    this.onFlipPointerDown = e => { this.flipPointerX = e.clientX; };
    this.onFlipPointerUp = e => {
      const delta = e.clientX - (this.flipPointerX ?? e.clientX);
      if (Math.abs(delta) > 45) (delta < 0 ? this.onFlipNext : this.onFlipPrev)();
    };
    flipViewport?.addEventListener('pointerdown', this.onFlipPointerDown);
    flipViewport?.addEventListener('pointerup', this.onFlipPointerUp);

    this.onKeyDown = e => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      const track = root.querySelector('[data-track="work"]');
      if (!track) return;
      const rect = track.getBoundingClientRect();
      if (rect.top > innerHeight || rect.bottom < 0) return;
      const stage = root.querySelector('.work-stage');
      const current = Number(stage?.dataset.slot || 0);
      const target = Math.max(0, Math.min(5, current + (e.key === 'ArrowRight' ? 1 : -1)));
      const y = scrollY + rect.top + (track.offsetHeight - innerHeight) * (target / 5);
      window.scrollTo({ top: y, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      e.preventDefault();
    };
    addEventListener('keydown', this.onKeyDown);

    const clock = root.querySelector('[data-el="clock"]');
    const tick = () => { if (clock) clock.textContent = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' WEST'; };
    tick(); this.clockId = setInterval(tick, 20000);

    this.dirty = true;
    const loop = () => {
      this.pos.x += (this.mouse.x - this.pos.x) * 0.16;
      this.pos.y += (this.mouse.y - this.pos.y) * 0.16;
      if (this.cursor) this.cursor.style.transform = `translate3d(${this.pos.x}px,${this.pos.y}px,0)`;
      if (this.workCta) {
        this.workCtaPos.x += (this.workCtaTarget.x - this.workCtaPos.x) * .18;
        this.workCtaPos.y += (this.workCtaTarget.y - this.workCtaPos.y) * .18;
        this.workCta.style.setProperty('--cta-x', `${this.workCtaPos.x}px`);
        this.workCta.style.setProperty('--cta-y', `${this.workCtaPos.y}px`);
      }
      if (this.procPath) {
        const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
        const delta = this.procTarget - this.procProgress;
        this.procProgress = reduced || Math.abs(delta) < .0001
          ? this.procTarget
          : this.procProgress + delta * .095;
        this.procPath.style.strokeDashoffset = String(this.procPathLength * (1 - this.procProgress));
      }
      if (this.dirty) { this.dirty = false; this.update(); }
      this.raf = requestAnimationFrame(loop);
    };
    loop();
  }
  componentWillUnmount() {
    removeEventListener('scroll', this.onScroll); removeEventListener('resize', this.onScroll);
    removeEventListener('mousemove', this.onMove);
    removeEventListener('keydown', this.onKeyDown);
    root.querySelector('[data-el="flipPrev"]')?.removeEventListener('click', this.onFlipPrev);
    root.querySelector('[data-el="flipNext"]')?.removeEventListener('click', this.onFlipNext);
    root.querySelector('[data-el="workFlipViewport"]')?.removeEventListener('pointerdown', this.onFlipPointerDown);
    root.querySelector('[data-el="workFlipViewport"]')?.removeEventListener('pointerup', this.onFlipPointerUp);
    clearTimeout(this.flipCopyTimer);
    clearTimeout(this.flipSwapTimer);
    clearTimeout(this.flipEndTimer);
    clearTimeout(this.flipTextTimer);
    cancelAnimationFrame(this.raf); clearInterval(this.clockId);
  }
  setCursor(on) {
    if (on === this.cursorOn) return;
    this.cursorOn = on;
    if (this.clabel) { this.clabel.style.opacity = on ? '1' : '0'; this.clabel.style.transform = `translate(-50%,-50%) scale(${on ? 1 : 0.5})`; }
    if (this.cdot) this.cdot.style.opacity = on ? '0' : '1';
  }
  update() {
    const vh = innerHeight, vw = innerWidth;
    const cl = (v, a, b) => Math.min(b, Math.max(a, v));
    const seg = (p, a, b) => cl((p - a) / (b - a), 0, 1);
    const ease = t => 1 - Math.pow(1 - t, 3);
    for (const t of this.tracks) {
      const r = t.el.getBoundingClientRect();
      const total = r.height - vh;
      const p = cl(-r.top / (total || 1), 0, 1);
      const vis = r.top < vh && r.bottom > 0;
      if (!vis && t.done === p) continue;
      t.done = p;
      const q = s => t.el.querySelector(`[data-el="${s}"]`);
      const qa = s => t.el.querySelectorAll(s);
      if (t.name === 'hero') {
        const ht = q('heroType');
        if (ht) { const s = 1 - 0.55 * ease(p); ht.style.transform = `translate3d(0,${-p * 16}vh,0) scale(${s})`; ht.style.opacity = String(cl(1 - seg(p, 0.72, 0.98), 0, 1)); }
        const line = q('heroLine');
        if (line) line.style.transform = `translate3d(0,${seg(p, 0.55, 0.85) * 120}%,0)`;
        const gallery = q('heroGallery');
        if (gallery) gallery.style.transform = `translate3d(0,${p * -1.5}vh,0) scale(${1.03 + p * .2})`;
        const g = q('heroGlow'); if (g) g.style.transform = `translate3d(${(this.pos.x / vw - 0.5) * 40}px,${-p * 18 + (this.pos.y / vh - 0.5) * 30}px,0)`;
        qa('[data-frag]').forEach(f => {
          const sp = +f.dataset.speed, rot = +f.dataset.rot;
          const mx = (this.pos.x / vw - 0.5) * sp * 0.5, my = (this.pos.y / vh - 0.5) * sp * 0.35;
          f.style.transform = `translate3d(${mx}px,${-p * sp * 3.2 + my}px,0) rotate(${rot * (0.3 + p * 1.6)}deg) scale(${1 - p * 0.25})`;
          f.style.opacity = String(cl(1 - seg(p, 0.6, 0.95), 0, 1));
        });
        const sc = q('heroScroll'); if (sc) sc.style.opacity = String(cl(1 - seg(p, 0, 0.15), 0, 1));
      } else if (t.name === 'work') {
        const panelCount = this.workItems.length;
        const x = p * (panelCount - 1);
        const active = Math.min(this.workItems.length - 1, Math.max(0, Math.floor(x + .48)));
        if (active !== this.flipIndex) this.flipTo(active, active > this.flipIndex ? 1 : -1);
        const stage = t.el.querySelector('.work-stage');
        if (stage) {
          stage.dataset.slot = String(Math.min(panelCount - 1, Math.max(0, Math.round(x))));
          stage.dataset.activeTitle = this.workItems[active].title.toUpperCase();
        }
        const current = q('workCurrent');
        if (current) current.textContent = String(active + 1).padStart(2, '0');
        const progress = q('workProgress');
        if (progress) progress.style.transform = `scaleX(${p})`;
      } else if (t.name && t.name[0] === 'p' && t.name.length === 2) {
        const inP = ease(seg(p, 0, 0.45)), out = seg(p, 0.82, 1);
        const scene = q('scene');
        if (scene) {
          const s = (0.68 + 0.32 * inP) * (1 - out * 0.35);
          scene.style.transform = `translate3d(${out * 30}vw,0,0) scale(${s}) rotate(${out * 8}deg)`;
          scene.style.opacity = String(1 - out);
          scene.style.filter = `blur(${out * 14}px)`;
        }
        qa('[data-layer]').forEach((l, i) => {
          const k = (i + 1) * (i === 0 ? 1 : 1.6);
          l.style.transform = `translate3d(${(inP - 0.3) * k * 40}px,${(0.3 - inP) * k * 34}px,0) rotate(${(inP - 0.5) * k * 3}deg)`;
          l.style.opacity = String(cl(seg(p, 0.12, 0.4) * (1 - out), 0, 1));
        });
        const title = q('title');
        if (title) {
          const tp = seg(p, 0.05, 0.9);
          title.style.transform = `translate3d(0,${(0.5 - tp) * 78}vh,0)`;
          title.style.opacity = String(cl(seg(p, 0.02, 0.16) - out, 0, 1));
        }
        const num = q('num'); if (num) num.style.transform = `translate3d(${-out * 30}vw,0,0)`;
        qa('[data-metaline]').forEach((m, i) => {
          const mp = cl((p - 0.4 - i * 0.09) / 0.22, 0, 1) * (1 - out);
          m.style.transform = `translate3d(${(1 - ease(mp)) * 40}px,0,0)`;
          m.style.opacity = String(mp);
        });
        const bg = q('bg'); if (bg) bg.style.opacity = String(cl(0.3 + inP * 0.7 - out, 0, 1));
      } else if (t.name === 'seq') {
        const total = 180, f = Math.max(1, Math.round(p * total));
        const fr = q('frame'); if (fr) fr.textContent = `FRAME ${String(f).padStart(3, '0')} / ${total}`;
        const stages = qa('[data-seq]'), n = stages.length;
        const x = p * (n - 1);
        stages.forEach((s, i) => {
          const d = Math.abs(x - i);
          const o = cl(1 - d, 0, 1);
          s.style.opacity = String(i === 0 ? Math.max(o, x < 0.001 ? 1 : o) : o);
          s.style.transform = `scale(${1 - Math.min(d, 1) * 0.06}) translate3d(0,${(x - i) * -18}px,0)`;
          s.style.filter = `blur(${Math.min(d, 1) * 6}px)`;
        });
        qa('[data-seqlabel]').forEach((l, i) => {
          const on = Math.round(x) === i;
          l.style.color = on ? 'rgb(255 90 36)' : 'rgba(23,23,24,.3)';
        });
      } else if (t.name === 'proc') {
        const steps = [...qa('[data-step]')];
        let active = 0;
        let closest = Infinity;
        steps.forEach((step, i) => {
          const card = step.getBoundingClientRect();
          const reveal = cl((vh * .9 - card.top) / (vh * .42), 0, 1);
          step.style.setProperty('--proc-opacity', String(reveal));
          step.style.setProperty('--proc-y', `${(1 - ease(reveal)) * 70}px`);
          step.setAttribute('aria-hidden', reveal > .15 ? 'false' : 'true');
          const distance = Math.abs(card.top + card.height / 2 - vh / 2);
          if (distance < closest) { closest = distance; active = i; }
        });
        const current = q('procCurrent');
        if (current) current.textContent = String(active + 1).padStart(2, '0');
        this.procTarget = p;
      } else if (t.name === 'contact') {
        const cta = q('cta');
        if (cta) cta.style.transform = `scale(${0.82 + ease(seg(p, 0, 0.7)) * 0.3})`;
        const st = q('stage');
        if (st) { const k = seg(p, 0.2, 0.9); st.style.background = `radial-gradient(70% 70% at 50% 60%, rgb(255 90 36 / ${(0.16 * k).toFixed(3)}), rgba(247,244,238,0) 70%)`; }
        const info = q('contactInfo');
        if (info) { const ip = seg(p, 0.45, 0.75); info.style.opacity = String(ip); info.style.transform = `translate3d(0,${(1 - ease(ip)) * 40}px,0)`; }
      }
    }
  }
  renderVals() { return {}; }
}

function enableStyleHover(root) {
  root.querySelectorAll('[style-hover]').forEach((element) => {
    const hoverRules = element.getAttribute('style-hover')
      .split(';')
      .map((rule) => rule.trim())
      .filter(Boolean)
      .map((rule) => {
        const separator = rule.indexOf(':');
        return [rule.slice(0, separator).trim(), rule.slice(separator + 1).trim()];
      });
    const original = new Map(hoverRules.map(([property]) => [property, element.style.getPropertyValue(property)]));
    element.addEventListener('mouseenter', () => hoverRules.forEach(([property, value]) => element.style.setProperty(property, value)));
    element.addEventListener('mouseleave', () => hoverRules.forEach(([property]) => element.style.setProperty(property, original.get(property))));
  });
}

const portfolio = new Component();
window.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('[data-root]');
  if (root) enableStyleHover(root);
  portfolio.componentDidMount();
});
window.addEventListener('pagehide', () => portfolio.componentWillUnmount());
