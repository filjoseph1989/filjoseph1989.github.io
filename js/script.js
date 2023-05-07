NUM_ATTRACTORS = 10;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const { innerWidth, innerHeight } = window;
const { random, floor, cos, sin } = Math;

canvas.width = innerWidth;
canvas.height = document.body.scrollHeight;

const w = innerWidth;
const h = innerHeight;

ctx.translate(w, h);
ctx.globalCompositeOperation = "lighter";

const range = n => Array(n).fill(0).map((_, i) => i);

const randomInt = (s, e) => s + floor((e - s) * random());
const drawParticle = ({ x, y, c }) => {
    ctx.beginPath();
    ctx.fillStyle = c;
    ctx.fillRect(x, y, 0.5, 0.5);
    ctx.closePath();
};

const attractors = range(NUM_ATTRACTORS).map(() => ({
    x: randomInt(-w, w),
    y: randomInt(-h, h),
    g: randomInt(0, 30),
    c: `rgba(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(
        0,
        255
    )}, ${random()})`
}));

// https://codepen.io/ge1doot/pen/ooNvgx
class Particle {
    constructor() {
        this.damp = 0.00006;
        this.accel = 3200;
        this.x = randomInt(-w, w);
        this.y = randomInt(-h, h);
        this.vx = this.accel * random();
        this.vy = this.accel * random();
        this.currentColor = "#fff";
    }
    draw() {
        const { x, y, currentColor } = this;
        drawParticle({ x, y, c: currentColor });
    }
    step() {
        const { x, y } = this;

        let color = 0;
        let largestVal = 0;

        attractors.map(a => {
            const dx = a.x - x;
            const dy = a.y - y;
            const d2 = (dx * dx + dy * dy) / a.g;
            if (d2 > 0.1) {
                this.vx += this.accel * (dx / d2);
                this.vy += this.accel * (dy / d2);
            }
            if (d2 > largestVal) {
                largestVal = d2;
                color = a.c;
            }
        });
        this.x += this.vx;
        this.y += this.vy;

        this.vx *= this.damp;
        this.vy *= this.damp;

        this.currentColor = color;
        this.draw();
    }
}

const particles = range(8000).map(() => new Particle());
const animate = () => {
    particles.map(particle => {
        particle.step();
    });
};

let iter = 0;

const update = () => {
    animate();
    iter += 1;
    if (iter < 1500) {
        requestAnimationFrame(update);
    }
};
update();
