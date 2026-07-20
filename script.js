const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

$("#year").textContent = new Date().getFullYear();

// Navigation state
const navWrap = $(".nav-wrap");
window.addEventListener("scroll", () => navWrap.classList.toggle("scrolled", window.scrollY > 24), { passive: true });

const menuButton = $("#menu-button");
const mobileMenu = $("#mobile-menu");
menuButton.addEventListener("click", () => {
  const open = mobileMenu.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
});
$$(".mobile-menu a").forEach(link => link.addEventListener("click", () => {
  mobileMenu.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
}));

// Reveal elements
$$(".reveal").forEach(el => {
  if (el.dataset.delay) el.style.setProperty("--delay", `${el.dataset.delay}ms`);
});
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
$$(".reveal").forEach(el => revealObserver.observe(el));

// Rotating hero word
const rotatingWord = $(".rotating-word");
const words = rotatingWord.dataset.words.split(",");
let wordIndex = 0;
setInterval(() => {
  rotatingWord.classList.add("word-out");
  setTimeout(() => {
    wordIndex = (wordIndex + 1) % words.length;
    rotatingWord.textContent = words[wordIndex];
    rotatingWord.classList.remove("word-out");
    rotatingWord.classList.add("word-in");
    setTimeout(() => rotatingWord.classList.remove("word-in"), 500);
  }, 350);
}, 2600);

// Cursor glow and magnetic buttons
const glow = $(".cursor-glow");
window.addEventListener("pointermove", event => {
  glow.style.left = `${event.clientX}px`;
  glow.style.top = `${event.clientY}px`;
}, { passive: true });

$$(".magnetic").forEach(button => {
  button.addEventListener("pointermove", event => {
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    button.style.transform = `translate(${x * 0.08}px, ${y * 0.12}px)`;
  });
  button.addEventListener("pointerleave", () => button.style.transform = "");
});

// Project filters
$$(".filter-button").forEach(button => {
  button.addEventListener("click", () => {
    $$(".filter-button").forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    const filter = button.dataset.filter;
    $$(".project-card").forEach(card => {
      card.classList.toggle("hidden", filter !== "all" && card.dataset.category !== filter);
    });
  });
});

// Project modal
const projectData = {
  retinopathy: {
    title: "Diabetic Retinopathy Detection",
    eyebrow: "MACHINE LEARNING CASE STUDY",
    body: `
      <p>The project explored whether clinical retinal indicators could be used to classify signs of diabetic retinopathy accurately and consistently.</p>
      <h3>What I did</h3>
      <ul>
        <li>Prepared a dataset containing 1,150 instances and 20 attributes.</li>
        <li>Compared Random Forest, Logistic Regression and Naive Bayes.</li>
        <li>Used preprocessing and 10-fold cross-validation to create a fair comparison.</li>
        <li>Analysed model performance rather than relying on accuracy alone.</li>
      </ul>
      <h3>What it demonstrates</h3>
      <p>Structured experimentation, model evaluation, data preprocessing and the ability to explain technical results clearly.</p>`
  },
  sentinel: {
    title: "Sentinel Incident Automation",
    eyebrow: "CYBERSECURITY CASE STUDY",
    body: `
      <p>This lab focused on reducing repetitive SOC work by automating parts of the incident response process in Microsoft Sentinel.</p>
      <h3>What I did</h3>
      <ul>
        <li>Created an automation rule to trigger a Logic App.</li>
        <li>Used an HTTP action and Parse JSON step to process incident data.</li>
        <li>Updated incident details automatically and explored response actions such as blocking malicious IP addresses.</li>
        <li>Worked with Sentinel workbooks and KQL-based investigation concepts.</li>
      </ul>
      <h3>What it demonstrates</h3>
      <p>Awareness of SIEM/SOAR workflows, automation logic, incident handling and the practical value of reducing analyst workload.</p>`
  },
  voting: {
    title: "Distributed Vote Counting",
    eyebrow: "SOFTWARE ENGINEERING CASE STUDY",
    body: `
      <p>A distributed Java system designed to coordinate vote data between a central node and multiple clients.</p>
      <h3>What I did</h3>
      <ul>
        <li>Built a central server and multiple voting clients.</li>
        <li>Used socket communication and concurrent processing.</li>
        <li>Designed message handling so results could be aggregated reliably.</li>
        <li>Considered coordination, failure points and consistency across nodes.</li>
      </ul>
      <h3>What it demonstrates</h3>
      <p>Networking fundamentals, Java programming, concurrency and the ability to reason about distributed behaviour.</p>`
  },
  football: {
    title: "Football Data Exploration",
    eyebrow: "DATA ANALYSIS CASE STUDY",
    body: `
      <p>An exploratory analysis project using football match data to identify patterns and present findings visually.</p>
      <h3>What I did</h3>
      <ul>
        <li>Loaded and cleaned structured data using pandas.</li>
        <li>Investigated distributions, team performance and match-level trends.</li>
        <li>Created clear visualisations using Matplotlib.</li>
        <li>Translated findings into concise, non-technical explanations.</li>
      </ul>
      <h3>What it demonstrates</h3>
      <p>Data cleaning, exploratory analysis, visual communication and practical Python usage.</p>`
  }
};

const modal = $("#project-modal");
const modalTitle = $("#modal-title");
const modalEyebrow = $("#modal-eyebrow");
const modalBody = $("#modal-body");

function openProjectModal(key) {
  const data = projectData[key];
  if (!data) return;
  modalTitle.textContent = data.title;
  modalEyebrow.textContent = data.eyebrow;
  modalBody.innerHTML = data.body;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  $("#modal-close").focus();
}
function closeProjectModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}
$$(".details-button").forEach(button => button.addEventListener("click", () => openProjectModal(button.dataset.project)));
$("#modal-close").addEventListener("click", closeProjectModal);
modal.addEventListener("click", event => { if (event.target === modal) closeProjectModal(); });

// Command palette
const commandMenu = $("#command-menu");
const commandInput = $("#command-input");
const commandItems = $$(".command-results > *");
let selectedIndex = 0;

function setSelected(index) {
  commandItems.forEach(item => item.classList.remove("selected"));
  selectedIndex = Math.max(0, Math.min(index, commandItems.length - 1));
  commandItems[selectedIndex]?.classList.add("selected");
}
function openCommand() {
  commandMenu.classList.add("open");
  commandMenu.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  commandInput.value = "";
  filterCommands("");
  setSelected(0);
  setTimeout(() => commandInput.focus(), 50);
}
function closeCommand() {
  commandMenu.classList.remove("open");
  commandMenu.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}
function activateCommand(item) {
  if (!item) return;
  const target = item.dataset.target;
  closeCommand();
  if (target) document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  else if (item.href) window.open(item.href, "_blank", "noopener");
}
function filterCommands(value) {
  const query = value.toLowerCase();
  commandItems.forEach(item => {
    item.style.display = item.textContent.toLowerCase().includes(query) ? "" : "none";
  });
  const visible = commandItems.filter(item => item.style.display !== "none");
  setSelected(commandItems.indexOf(visible[0]));
}

$("#command-button").addEventListener("click", openCommand);
commandMenu.addEventListener("click", event => { if (event.target === commandMenu) closeCommand(); });
commandInput.addEventListener("input", event => filterCommands(event.target.value));
commandItems.forEach(item => item.addEventListener("click", event => {
  if (item.tagName === "A") return;
  event.preventDefault();
  activateCommand(item);
}));
document.addEventListener("keydown", event => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    commandMenu.classList.contains("open") ? closeCommand() : openCommand();
  }
  if (event.key === "Escape") {
    closeCommand();
    closeProjectModal();
  }
  if (commandMenu.classList.contains("open")) {
    const visible = commandItems.filter(item => item.style.display !== "none");
    const currentVisibleIndex = visible.indexOf(commandItems[selectedIndex]);
    if (event.key === "ArrowDown") {
      event.preventDefault();
      const next = visible[(currentVisibleIndex + 1) % visible.length];
      setSelected(commandItems.indexOf(next));
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      const prev = visible[(currentVisibleIndex - 1 + visible.length) % visible.length];
      setSelected(commandItems.indexOf(prev));
    }
    if (event.key === "Enter") {
      event.preventDefault();
      activateCommand(commandItems[selectedIndex]);
    }
  }
});

// Animated network background
const canvas = $("#network-canvas");
const ctx = canvas.getContext("2d");
let particles = [];
let width = 0;
let height = 0;
let dpr = Math.min(window.devicePixelRatio || 1, 2);

function resizeCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const count = Math.min(80, Math.floor((width * height) / 18000));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - .5) * .18,
    vy: (Math.random() - .5) * .18,
    r: Math.random() * 1.3 + .4
  }));
}
function animateCanvas() {
  ctx.clearRect(0, 0, width, height);
  for (const p of particles) {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > width) p.vx *= -1;
    if (p.y < 0 || p.y > height) p.vy *= -1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(150,175,220,.34)";
    ctx.fill();
  }
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i], b = particles[j];
      const dx = a.x - b.x, dy = a.y - b.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 125) {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(94,231,243,${(1 - dist / 125) * .08})`;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animateCanvas);
}
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  resizeCanvas();
  animateCanvas();
  window.addEventListener("resize", resizeCanvas);
}


// Version 2: theme toggle
const themeButton = document.querySelector("#theme-button");
const themeIcon = document.querySelector("#theme-icon");
const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme === "light") document.body.classList.add("light");
function syncThemeIcon() {
  if (themeIcon) themeIcon.textContent = document.body.classList.contains("light") ? "◑" : "◐";
}
syncThemeIcon();
themeButton?.addEventListener("click", () => {
  document.body.classList.toggle("light");
  const mode = document.body.classList.contains("light") ? "light" : "dark";
  localStorage.setItem("portfolio-theme", mode);
  syncThemeIcon();
});

// Version 2: animated counters
const statNumbers = [...document.querySelectorAll(".stat-number")];
const statObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count || 0);
    const duration = 1100;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    statObserver.unobserve(el);
  });
}, { threshold: .6 });
statNumbers.forEach(el => statObserver.observe(el));

// Version 2: interactive pseudo-3D sphere
const heroCanvas = document.querySelector("#hero-3d");
if (heroCanvas) {
  const heroCtx = heroCanvas.getContext("2d");
  let hw = 0, hh = 0, hdpr = Math.min(window.devicePixelRatio || 1, 2);
  let pointerX = 0, pointerY = 0;
  const points = [];
  const POINT_COUNT = 95;
  const golden = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < POINT_COUNT; i++) {
    const y = 1 - (i / (POINT_COUNT - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = golden * i;
    points.push({
      x: Math.cos(theta) * radius,
      y,
      z: Math.sin(theta) * radius,
      size: Math.random() * 1.2 + .6
    });
  }

  function resizeHero() {
    const rect = heroCanvas.getBoundingClientRect();
    hw = rect.width;
    hh = rect.height;
    heroCanvas.width = hw * hdpr;
    heroCanvas.height = hh * hdpr;
    heroCtx.setTransform(hdpr, 0, 0, hdpr, 0, 0);
  }

  const stage = document.querySelector("#hero-stage");
  stage?.addEventListener("pointermove", e => {
    const rect = stage.getBoundingClientRect();
    pointerX = ((e.clientX - rect.left) / rect.width - .5) * .8;
    pointerY = ((e.clientY - rect.top) / rect.height - .5) * .8;
  });
  stage?.addEventListener("pointerleave", () => { pointerX = 0; pointerY = 0; });

  function rotatePoint(p, ax, ay) {
    let x = p.x, y = p.y, z = p.z;
    const cy = Math.cos(ay), sy = Math.sin(ay);
    let x1 = x * cy - z * sy;
    let z1 = x * sy + z * cy;
    const cx = Math.cos(ax), sx = Math.sin(ax);
    let y1 = y * cx - z1 * sx;
    let z2 = y * sx + z1 * cx;
    return { x: x1, y: y1, z: z2 };
  }

  function drawHero(time) {
    heroCtx.clearRect(0, 0, hw, hh);
    const base = time * .00025;
    const rotated = points.map(p => rotatePoint(p, base * .55 + pointerY, base + pointerX));
    const radius = Math.min(hw, hh) * .255;
    const cx = hw / 2, cy = hh * .43;

    heroCtx.save();
    const glow = heroCtx.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.6);
    glow.addColorStop(0, "rgba(94,231,243,.10)");
    glow.addColorStop(.55, "rgba(102,134,255,.05)");
    glow.addColorStop(1, "rgba(0,0,0,0)");
    heroCtx.fillStyle = glow;
    heroCtx.beginPath();
    heroCtx.arc(cx, cy, radius * 1.65, 0, Math.PI * 2);
    heroCtx.fill();
    heroCtx.restore();

    for (let i = 0; i < rotated.length; i++) {
      for (let j = i + 1; j < rotated.length; j++) {
        const a = rotated[i], b = rotated[j];
        const dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z;
        const d = Math.sqrt(dx*dx + dy*dy + dz*dz);
        if (d < .42 && a.z > -.45 && b.z > -.45) {
          heroCtx.beginPath();
          heroCtx.moveTo(cx + a.x * radius, cy + a.y * radius);
          heroCtx.lineTo(cx + b.x * radius, cy + b.y * radius);
          heroCtx.strokeStyle = `rgba(94,231,243,${(1 - d/.42) * .18 * ((a.z+b.z+2)/4)})`;
          heroCtx.lineWidth = .7;
          heroCtx.stroke();
        }
      }
    }

    rotated.sort((a,b) => a.z - b.z).forEach((p, idx) => {
      const depth = (p.z + 1) / 2;
      const x = cx + p.x * radius;
      const y = cy + p.y * radius;
      const size = .8 + depth * 2.3;
      heroCtx.beginPath();
      heroCtx.arc(x, y, size, 0, Math.PI * 2);
      heroCtx.fillStyle = `rgba(${depth > .62 ? "94,231,243" : "157,114,255"},${.22 + depth * .62})`;
      heroCtx.shadowBlur = depth > .7 ? 12 : 0;
      heroCtx.shadowColor = depth > .62 ? "rgba(94,231,243,.7)" : "rgba(157,114,255,.45)";
      heroCtx.fill();
      heroCtx.shadowBlur = 0;
    });

    heroCtx.beginPath();
    heroCtx.arc(cx, cy, radius * .42, 0, Math.PI * 2);
    const core = heroCtx.createRadialGradient(cx, cy, 0, cx, cy, radius * .42);
    core.addColorStop(0, "rgba(94,231,243,.18)");
    core.addColorStop(1, "rgba(94,231,243,0)");
    heroCtx.fillStyle = core;
    heroCtx.fill();

    requestAnimationFrame(drawHero);
  }

  resizeHero();
  window.addEventListener("resize", resizeHero);
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    requestAnimationFrame(drawHero);
  }
}
