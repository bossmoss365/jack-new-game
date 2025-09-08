const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const GRAVITY = 0.25;
const JUMP = -4.6;
const PIPE_WIDTH = 60;
const PIPE_GAP = 120;
const PIPE_INTERVAL = 90; // frames

let frameCount = 0;
let score = 0;
let bestScore = 0;
let gameOver = false;

class Bird {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = 80;
        this.y = canvas.height / 2;
        this.velocity = 0;
        this.radius = 12;
    }

    update() {
        this.velocity += GRAVITY;
        this.y += this.velocity;

        if (this.y + this.radius > canvas.height) {
            this.y = canvas.height - this.radius;
            gameOver = true;
        }
        if (this.y - this.radius < 0) {
            this.y = this.radius;
            this.velocity = 0;
        }
    }

    jump() {
        this.velocity = JUMP;
    }

    draw() {
        ctx.fillStyle = '#FF0';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Pipe {
    constructor() {
        const topHeight = Math.random() * (canvas.height - PIPE_GAP - 40) + 20;
        this.top = topHeight;
        this.bottom = canvas.height - (topHeight + PIPE_GAP);
        this.x = canvas.width;
        this.width = PIPE_WIDTH;
        this.scored = false;
    }

    update() {
        this.x -= 2;
        if (!this.scored && this.x + this.width < bird.x) {
            score++;
            this.scored = true;
            if (score > bestScore) bestScore = score;
        }
    }

    draw() {
        ctx.fillStyle = '#0F0';
        ctx.fillRect(this.x, 0, this.width, this.top);
        ctx.fillRect(this.x, canvas.height - this.bottom, this.width, this.bottom);
    }

    collides(bird) {
        return (
            bird.x + bird.radius > this.x &&
            bird.x - bird.radius < this.x + this.width &&
            (bird.y - bird.radius < this.top || bird.y + bird.radius > canvas.height - this.bottom)
        );
    }
}

const bird = new Bird();
const pipes = [];

function resetGame() {
    bird.reset();
    pipes.length = 0;
    frameCount = 0;
    score = 0;
    gameOver = false;
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (frameCount % PIPE_INTERVAL === 0) {
        pipes.push(new Pipe());
    }

    pipes.forEach(p => {
        p.update();
        p.draw();
        if (p.collides(bird)) {
            gameOver = true;
        }
    });

    // remove offscreen pipes
    if (pipes.length && pipes[0].x + pipes[0].width < 0) {
        pipes.shift();
    }

    bird.update();
    bird.draw();

    ctx.fillStyle = '#000';
    ctx.font = '24px sans-serif';
    ctx.fillText(`Score: ${score}`, 10, 25);
    ctx.fillText(`Best: ${bestScore}`, 10, 50);

    if (gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#FFF';
        ctx.font = '32px sans-serif';
        ctx.fillText('Game Over', canvas.width / 2 - 80, canvas.height / 2 - 20);
        ctx.font = '20px sans-serif';
        ctx.fillText('Press Space to Restart', canvas.width / 2 - 120, canvas.height / 2 + 20);
    } else {
        frameCount++;
        requestAnimationFrame(gameLoop);
    }
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        if (gameOver) {
            resetGame();
            requestAnimationFrame(gameLoop);
        } else {
            bird.jump();
        }
    }
});

requestAnimationFrame(gameLoop);
