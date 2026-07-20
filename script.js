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
