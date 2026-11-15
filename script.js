
/* =====================================================
   BIRTHDAY WEBSITE - COMPLETE SCRIPT
===================================================== */


/* =====================================================
   1. CONFIGURATION
===================================================== */

const COUNTDOWN_TIME = 10;

const FORMING_TIME = 7000;

/* Số lượng hạt */

const AMBIENT_COUNT = 1200;

const HEART_COUNT = 1800;

const RING_COUNT = 450;


/* =====================================================
   2. ELEMENTS
===================================================== */

const countdownSection =
    document.getElementById("countdownSection");

const countdownElement =
    document.getElementById("countdown");

const wishContent =
    document.getElementById("wishContent");

const magicOrb =
    document.getElementById("magicOrb");

const magicHint =
    document.getElementById("magicHint");

const letterReveal =
    document.getElementById("letterReveal");

const canvas =
    document.getElementById("starCanvas");

const ctx = canvas
    ? canvas.getContext("2d")
    : null;


/* =====================================================
   3. VARIABLES
===================================================== */

let canvasWidth = window.innerWidth;

let canvasHeight = window.innerHeight;

let particles = [];

let started = false;

let completed = false;

let animationStart = 0;

let countdownTimer = null;

let animationFrame = null;


/* =====================================================
   4. RANDOM
===================================================== */

function random(min, max) {

    return Math.random() * (max - min) + min;

}


/* =====================================================
   5. COUNTDOWN
===================================================== */

function startCountdown() {

    if (!countdownElement || !countdownSection) {
        return;
    }

    let remaining = COUNTDOWN_TIME;

    countdownElement.textContent = remaining;

    countdownTimer = setInterval(() => {

        remaining--;

        countdownElement.textContent = remaining;

        if (remaining <= 0) {

            clearInterval(countdownTimer);

            countdownSection.classList.add("hidden");

            if (wishContent) {

                wishContent.classList.remove("hidden");

                wishContent.classList.add("fade-in");

            }

            if (canvas && ctx) {

                resizeCanvas();

                createAmbientParticles();

                drawParticles();

            }

        }

    }, 1000);

}


/* =====================================================
   6. CANVAS RESIZE
===================================================== */

function resizeCanvas() {

    if (!canvas || !ctx) {
        return;
    }

    canvasWidth = window.innerWidth;

    canvasHeight = window.innerHeight;

    const dpr = Math.min(
        window.devicePixelRatio || 1,
        2
    );

    canvas.width = canvasWidth * dpr;

    canvas.height = canvasHeight * dpr;

    canvas.style.width = canvasWidth + "px";

    canvas.style.height = canvasHeight + "px";

    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );

}


/* =====================================================
   7. HEART EQUATION
===================================================== */

function getHeartPoint(t, scale) {

    const x =
        16 * Math.pow(Math.sin(t), 3);

    const y =
        13 * Math.cos(t)
        - 5 * Math.cos(2 * t)
        - 2 * Math.cos(3 * t)
        - Math.cos(4 * t);

    return {

        x: x * scale,

        y: -y * scale

    };

}


/* =====================================================
   8. CREATE AMBIENT STARS
===================================================== */

function createAmbientParticles() {

    particles = [];

    for (let i = 0; i < AMBIENT_COUNT; i++) {

        particles.push({

            type: "ambient",

            x: random(0, canvasWidth),

            y: random(0, canvasHeight),

            size: random(0.4, 1.8),

            alpha: random(0.2, 0.8),

            phase: random(0, Math.PI * 2),

            speed: random(0.05, 0.35),

            drift: random(0.1, 0.5),

            color: Math.random() > 0.5
                ? "#ffffff"
                : "#ffb6df"

        });

    }

}


/* =====================================================
   9. CREATE HEART PARTICLES
===================================================== */

function createHeartParticles() {

    const centerX = canvasWidth / 2;

    const centerY = canvasHeight * 0.36;

    const scale =
        Math.min(canvasWidth, canvasHeight) * 0.014;


    /* =====================================
       HEART PARTICLES
    ===================================== */

    for (let i = 0; i < HEART_COUNT; i++) {

        const t =
            random(0, Math.PI * 2);

        const fill =
            Math.sqrt(Math.random());

        const point =
            getHeartPoint(t, scale);

        const targetX =
            centerX + point.x * fill;

        const targetY =
            centerY + point.y * fill;

        const startX =
            random(-canvasWidth * 0.2, canvasWidth * 1.2);

        const startY =
            random(-canvasHeight * 0.2, canvasHeight * 1.2);

        particles.push({

            type: "heart",

            x: startX,

            y: startY,

            startX: startX,

            startY: startY,

            targetX: targetX,

            targetY: targetY,

            baseX: targetX,

            baseY: targetY,

            size: random(0.5, 1.8),

            alpha: random(0.3, 0.9),

            phase: random(0, Math.PI * 2),

            color: Math.random() > 0.5
                ? "#ffb6df"
                : "#ff65c5"

        });

    }


    /* =====================================
       RING PARTICLES
    ===================================== */

    for (let i = 0; i < RING_COUNT; i++) {

        const angle =
            random(0, Math.PI * 2);

        const radius =
            Math.sqrt(Math.random());

        const rx =
            Math.min(canvasWidth, canvasHeight) * 0.2;

        const ry =
            Math.min(canvasWidth, canvasHeight) * 0.05;

        const targetX =
            centerX
            + Math.cos(angle) * radius * rx;

        const targetY =
            canvasHeight * 0.72
            + Math.sin(angle) * radius * ry;

        const startX =
            random(-canvasWidth * 0.2, canvasWidth * 1.2);

        const startY =
            random(-canvasHeight * 0.2, canvasHeight * 1.2);

        particles.push({

            type: "ring",

            x: startX,

            y: startY,

            startX: startX,

            startY: startY,

            targetX: targetX,

            targetY: targetY,

            baseX: targetX,

            baseY: targetY,

            size: random(0.5, 1.8),

            alpha: random(0.3, 0.9),

            phase: random(0, Math.PI * 2),

            color: Math.random() > 0.5
                ? "#ffd5f0"
                : "#ff8ed8"

        });

    }

}


/* =====================================================
   10. START MAGIC
===================================================== */

function startHeartAnimation() {

    if (started) {
        return;
    }

    if (!canvas || !ctx) {
        console.error("Canvas không tồn tại!");
        return;
    }

    started = true;

    completed = false;

    animationStart = performance.now();


    /* Ẩn quả cầu */

    if (magicOrb) {

        magicOrb.classList.add("hidden");

    }

    if (magicHint) {

        magicHint.classList.add("hidden");

    }


    /* Tạo hạt sao */

    createHeartParticles();


    /* Bắt đầu animation */

    if (animationFrame) {

        cancelAnimationFrame(animationFrame);

    }

    animationFrame =
        requestAnimationFrame(drawParticles);

}


/* =====================================================
   11. DRAW PARTICLES
===================================================== */

function drawParticles(now = performance.now()) {

    if (!ctx) {
        return;
    }

    ctx.clearRect(
        0,
        0,
        canvasWidth,
        canvasHeight
    );


    /* =====================================
       PROGRESS
    ===================================== */

    let progress = 0;

    let eased = 0;

    if (started) {

        const elapsed =
            now - animationStart;

        progress = Math.min(
            elapsed / FORMING_TIME,
            1
        );

        eased =
            1 - Math.pow(1 - progress, 3);

    }


    /* =====================================
       PARTICLES
    ===================================== */

    for (const p of particles) {


        /* ---------------------------------
           AMBIENT STARS
        --------------------------------- */

        if (p.type === "ambient") {

            p.x +=
                Math.sin(
                    now * 0.0005 + p.phase
                ) * p.drift;

            p.y -= p.speed;

            if (p.y < -10) {

                p.y = canvasHeight + 10;

                p.x = random(0, canvasWidth);

            }

            p.alpha =
                0.2
                + (
                    Math.sin(
                        now * 0.002 + p.phase
                    ) + 1
                ) * 0.35;

        }


        /* ---------------------------------
           FORMING HEART
        --------------------------------- */

        else if (!completed) {

            p.x =
                p.startX
                + (p.targetX - p.startX) * eased;

            p.y =
                p.startY
                + (p.targetY - p.startY) * eased;

            p.alpha =
                0.3
                + (
                    Math.sin(
                        now * 0.003 + p.phase
                    ) + 1
                ) * 0.35;

        }


        /* ---------------------------------
           FINISHED HEART
        --------------------------------- */

        else {

            if (p.type === "heart") {

                p.x =
                    p.baseX
                    + Math.sin(
                        now * 0.0015 + p.phase
                    ) * 1.5;

                p.y =
                    p.baseY
                    + Math.cos(
                        now * 0.0018 + p.phase
                    ) * 1.5;

                p.alpha =
                    0.35
                    + (
                        Math.sin(
                            now * 0.003 + p.phase
                        ) + 1
                    ) * 0.3;

            }

            if (p.type === "ring") {

                const wave =
                    Math.sin(
                        now * 0.002 + p.phase
                    ) * 2;

                p.x = p.baseX + wave;

                p.y = p.baseY + wave * 0.4;

            }

        }


        /* ---------------------------------
           DRAW PARTICLE
        --------------------------------- */

        ctx.globalAlpha = p.alpha;

        ctx.fillStyle = p.color;

        ctx.shadowBlur = 5;

        ctx.shadowColor = p.color;

        ctx.beginPath();

        ctx.arc(
            p.x,
            p.y,
            p.size,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }


    ctx.globalAlpha = 1;

    ctx.shadowBlur = 0;


    /* =====================================
       FINISH AFTER 7 SECONDS
    ===================================== */

    if (
        started &&
        progress >= 1 &&
        !completed
    ) {

        completed = true;

        revealLetter();

    }


    /* =====================================
       LOOP
    ===================================== */

    animationFrame =
        requestAnimationFrame(drawParticles);

}


/* =====================================================
   12. REVEAL ENVELOPE
===================================================== */

function revealLetter() {

    if (!letterReveal) {
        return;
    }

    letterReveal.classList.remove("hidden");

    letterReveal.classList.add("fade-in");

}


/* =====================================================
   13. OPEN LETTER
===================================================== */

function openLetter() {

    const envelope =
        document.getElementById("envelope");

    const letterContent =
        document.getElementById("letterContent");

    if (!envelope || !letterContent) {
        return;
    }

    envelope.classList.add("hidden");

    letterContent.classList.remove("hidden");

    letterContent.classList.add("fade-in");

    setTimeout(() => {

        letterContent.scrollIntoView({

            behavior: "smooth",

            block: "start"

        });

    }, 200);

}


/* =====================================================
   14. CLICK ORB
===================================================== */

if (magicOrb) {

    magicOrb.addEventListener(
        "click",
        startHeartAnimation
    );

}


/* =====================================================
   15. RESIZE
===================================================== */

window.addEventListener("resize", () => {

    resizeCanvas();

    if (!started) {

        createAmbientParticles();

    }

});


/* =====================================================
   16. INITIALIZE
===================================================== */

if (canvas && ctx) {

    resizeCanvas();

}

startCountdown();

console.log("Birthday website loaded successfully 💗");
