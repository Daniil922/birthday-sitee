const canvas = document.getElementById('birthdayCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

// Anpassung bei Fenstergröße
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// --- Herz in der Mitte ---
let heartPulse = 0;
function drawHeart(ctx, x, y, baseSize, color) {
    const size = baseSize * (1 + 0.05 * Math.sin(heartPulse));
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size / 100, size / 100);
    ctx.beginPath();
    ctx.moveTo(0, -40);
    ctx.bezierCurveTo(-90, -120, -180, 20, 0, 100);
    ctx.bezierCurveTo(180, 20, 90, -120, 0, -40);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
}

// --- Realistische Rosen (hineinblühen) ---
function drawRose(ctx, x, y, scale, color, progress) {
    ctx.save();
    ctx.translate(x, y);
    const rotation = Math.random() * 2 * Math.PI;
    ctx.rotate(rotation);
    const numPetals = 4 + Math.floor(Math.random() * 3);
    const grow = Math.min(progress, 1);

    for (let i = 0; i < numPetals; i++) {
        const petalLength = (8 + Math.random() * 4) * grow;
        const petalWidth = (4 + Math.random() * 3) * grow;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(petalWidth, -petalLength, petalWidth * 2, -petalLength, 0, 0);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.rotate((2 * Math.PI) / numPetals);
    }

    // Blütenmitte
    ctx.beginPath();
    ctx.arc(0, 0, 1 * grow, 0, 2 * Math.PI);
    ctx.fillStyle = "#ffe6f0";
    ctx.fill();

    ctx.restore();
}

// --- Rosenkranz vorbereiten ---
const colors = ["#ff4d6d", "#ff6680", "#ff7fa7", "#ff99c9", "#ffb3d9"];
const numRoses = 12;
const radius = 200;
const roses = [];

for (let i = 0; i < numRoses; i++) {
    const angle = (i * 2 * Math.PI) / numRoses;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    const scale = 14 + Math.random() * 6;
    const color = colors[Math.floor(Math.random() * colors.length)];
    roses.push({ x, y, scale, progress: 0, color });
}

// --- Smooth Text ---
const message = "С прошедшим днём рождения, Витя! ❤️";
let textIndex = 0;

// --- Animation Loop ---
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Herz pulsiert
    heartPulse += 0.05;
    drawHeart(ctx, centerX, centerY, 180, "#ff4d6d");

    // Rosen „hineinblühen“
    roses.forEach((r) => {
        if (r.progress < 1) r.progress += 0.02; // Geschwindigkeit
        drawRose(ctx, r.x, r.y, r.scale, r.color, r.progress);
    });

    // Smooth Text über Herz
    ctx.fillStyle = "white";
    ctx.font = "28px Arial";

    const displayedText = message.slice(0, Math.floor(textIndex));
    const textWidth = ctx.measureText(displayedText).width;
    const textX = centerX - textWidth / 2;
    const textY = centerY - 220; // über Herz

    ctx.fillText(displayedText, textX, textY);

    if (textIndex < message.length) textIndex += 0.3;

    requestAnimationFrame(animate);
}

animate();
