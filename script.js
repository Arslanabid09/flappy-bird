let board = document.getElementById('canvas');
let ctx = board.getContext('2d');

let boardwidth = 360;
let boardHeight = 540;

let birdWidth = 34;
let birdHeight = 24;
let birdImg = new Image();
birdImg.src = '/imgs/flappybird.png';
let gravity = 0.9;

// Pipes
let pipeWidth = 64;
let pipeHeight = 512;
let topPipeImg = new Image();
topPipeImg.src = '/imgs/topPipe.png';
let bottomPipeImg = new Image();
bottomPipeImg.src = '/imgs/bottomPipe.png';
let pipeArr = [];
let pipeGap = 150;
let pipeSpeed = -2;

let isGameOver = false;

// Create initial pipe
// createPipe(); 

function createPipe() {
    // Top pipe
    let topPipeY = Math.random() * (boardHeight / 2); // Random y position for top pipe
    let pipe = {
        x: boardwidth +2,
        y: topPipeY - pipeHeight,
        width: pipeWidth,
        height: pipeHeight,
        img: topPipeImg,
        passed: false
    };
    pipeArr.push(pipe);

    // Bottom pipe
    let bottomPipeY = topPipeY + pipeGap;
    let bottomPipe = {
        x: boardwidth,
        y: bottomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        img: bottomPipeImg,
        passed: false
    };
    pipeArr.push(bottomPipe);
}

let bird = {
    x: boardwidth / 4 - birdWidth / 2,
    y: boardHeight / 2 - birdHeight / 2,
    width: birdWidth,
    height: birdHeight,
    img: birdImg,
    yVelocity: 0,

    jump: function () {
        this.yVelocity = -10            ; // Adjust the jump strength
    },

    draw: function () {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        this.y += this.yVelocity;
        this.yVelocity += gravity;

        // Prevent the bird from going off-screen
        if (this.y + this.height > boardHeight) {
            this.y = boardHeight - this.height;
            this.yVelocity = 0;
            gameOver();  // Trigger game over if bird hits the ground
        } else if (this.y < 0) {
            this.y = 0;
            this.yVelocity = 0;
            gameOver();  // Trigger game over if bird hits the top
        }
    }
}

window.onload = () => {
    board.width = boardwidth;
    board.height = boardHeight;
    bird.draw();
    setInterval(createPipe, 2000); // Create a new pipe every 1 second
    requestAnimationFrame(Move); 
}

// Main game loop
function Move() {
    if (isGameOver) return;  // Stop the game loop if game over

    requestAnimationFrame(Move);
    ctx.clearRect(0, 0, boardwidth, boardHeight);
    bird.draw();

    for (let i = 0; i < pipeArr.length; i++) {
        const pipe = pipeArr[i];
        pipe.x += pipeSpeed;
        ctx.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        // Remove pipes that go off-screen
        if (pipe.x + pipe.width < 0) {
            pipeArr.splice(i, 1);
            i--;
        }

        // Check for collision
        if (collide(bird, pipe)) {
            gameOver();
        }
    }
}

// Event listener for key presses
window.addEventListener('keydown', JumpBird);
 function JumpBird(e){
    if (e.keyCode === 32 && !isGameOver) {
        bird.jump();
    } else if (e.keyCode === 32 && isGameOver) {
        resetGame();
    }
 }

function collide(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}

function gameOver() {
    isGameOver = true;
    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.fillText("Game Over", boardwidth / 4, boardHeight / 2);
}

function resetGame() {
    isGameOver = false;
    bird.y = boardHeight / 2 - birdHeight / 2;
    bird.yVelocity = 0;
    pipeArr = [];
    createPipe();
    requestAnimationFrame(Move);
}
