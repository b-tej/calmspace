const quoteEl = document.getElementById("quote");
const instructionEl = document.getElementById("instruction");

// --- Mood images + sounds ---
const moods = [
  {
    name: "Ocean",
    bg: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80')",
    color: "#A7D3F2",
    sound: "sounds/ocean.mp3"
  },
  {
    name: "Forest",
    bg: "url('https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1600&q=80')",
    color: "#A2C99E",
    sound: "sounds/forest.mp3"
  },
  {
    name: "Mountain",
    bg: "url('https://images.unsplash.com/photo-1455156218388-5e61b526818b?auto=format&fit=crop&w=1600&q=80')",
    color: "#c4eceeff",
    sound: "sounds/mountain.mp3"
  },
  {
    name: "Sunset",
    bg: "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80')",
    color: "#F5B8A0",
    sound: "sounds/sunset.mp3"
  }
];


let moodIndex = 0;
let currentAudio = null;

// --- breathing text ---
setInterval(() => {
  instructionEl.textContent =
    instructionEl.textContent === "Breathe in..." ? "Breathe out..." : "Breathe in...";
}, 6000);



// --- quote fetch ---
async function getQuote() {
  try {
    const res = await fetch('https://quoteslate.vercel.app/api/quotes/random?category=relaxation&peace');
    const data = await res.json();
    console.log(data);
    quoteEl.textContent = `"${data.quote}" — ${data.author}`;
  } catch (err) {
    console.error("Error fetching quote:", err);
    quoteEl.textContent = "Take a deep breath — quote unavailable right now.";
  }
}


// --- mood + audio change ---
function changeMood() {
  moodIndex = (moodIndex + 1) % moods.length;
  const mood = moods[moodIndex];
  document.body.style.backgroundImage = mood.bg;
  playAmbient(mood.sound);
}

// --- ambient playback ---
function playAmbient(src) {
  // stop current
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }

  // start new
  const audio = new Audio(src);
  audio.loop = true;
  audio.volume = 0.25;
  audio.play().catch(() => {}); // ignore autoplay block
  audio.addEventListener("play", () => console.log("Playing:", src));
  audio.addEventListener("error", () => console.log("Error loading:", src));
  currentAudio = audio;
}

// --- buttons ---
document.getElementById("newQuote").addEventListener("click", getQuote);
document.getElementById("changeMood").addEventListener("click", changeMood);

// --- initialize ---
const firstMood = moods[0];
document.body.style.backgroundImage = firstMood.bg;
playAmbient(firstMood.sound);
getQuote();

// === Wind particle effect ===
const canvas = document.getElementById("windCanvas");
const ctx = canvas.getContext("2d");

let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

const numParticles = 280;
let particles = [];
let mouse = { x: width / 2, y: height / 2 };

// use your mood colors so wind matches the current one
function currentWindColor() {
  return moods[moodIndex].color + "40"; // add transparency
}

function createParticles() {
  particles = [];
  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 3 + 1,
    });
  }
}

function drawParticles() {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = currentWindColor();
  for (let p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function updateParticles() {
  for (let p of particles) {
    p.x += p.vx;
    p.y += p.vy;

    // gentle wrap-around
    if (p.x > width) p.x = 0;
    if (p.x < 0) p.x = width;
    if (p.y > height) p.y = 0;
    if (p.y < 0) p.y = height;

    // light push from mouse
    const dx = p.x - mouse.x;
    const dy = p.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 120) {
      p.vx -= dx * 0.0003;
      p.vy -= dy * 0.0003;
    } else {
      p.vx *= 0.995;
      p.vy *= 0.995;
    }
  }
}

function animateWind() {
  updateParticles();
  drawParticles();
  requestAnimationFrame(animateWind);
}

document.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener("resize", () => {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
  createParticles();
});

function refreshWind() {
  ctx.fillStyle = currentWindColor();
}

createParticles();
animateWind();

