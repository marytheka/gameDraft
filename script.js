
let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");



let ball = {
    r: 12,
    x: canvas.width/2,
    y: canvas.height-30,
    xDelta: 5,
    yDelta: -5
};

let paddleWidth = 100;
let paddle = {
    height: 13,
    width: paddleWidth,
    x: (canvas.width - paddleWidth)/2
};

let brick = {
    rowCount: 7,
    columnCount:4,
    width: 75,
    height: 20,
    padding: 10,
    offsetTop: 30,
    offsetLeft: 30
};

let rand = function(n) {
    return Math.floor((Math.random() * n) + 1);
};

let collisionAudio = new Audio("collide.mp3");
let lostBallAudio = new Audio("lostBall.mp3");
let collisionPaddle = new Audio("click.mp3");
let winAudio = new Audio("win.mp3");
let rightPressed = false;
let leftPressed = false;
let score = 0;
let lives = 4;
let colors = ["#b41c28", "#f69970"]
let bricks = [];


for(i=0; i<brick.columnCount; i++) {
    bricks[i] = [];
    for(j=0; j<brick.rowCount; j++) {
        bricks[i][j] = {
            x: 0,
            y: 0,
            status: 1
        };
    }
}
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.keyCode===39) {
        rightPressed = true;
    }
    else if(e.keyCode===37) {
        leftPressed = true;
    }
}
function keyUpHandler(e) {
    if(e.keyCode===39) {
        rightPressed = false;
    }
    else if(e.keyCode===37) {
        leftPressed = false;
    }
}

function collisionDetection() {
    for(i=0; i<brick.columnCount; i++) {
        for(j=0; j<brick.rowCount; j++) {
            let b = bricks[i][j];
            if(b.status===1) {

                if(ball.x > b.x && ball.x < b.x+brick.width && ball.y > b.y && ball.y < b.y+brick.height) {
                    collisionAudio.play();
                    ball.yDelta = -ball.yDelta;
                    b.status = 0;
                    score++;
                }
            }
        }
    }
}
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI*2);
    ctx.fillStyle = "#f8fafc";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.fillStyle = "#f69970";
    ctx.fillRect(paddle.x, canvas.height-paddle.height, paddle.width, paddle.height);
}

function drawBricks() {
    for(i=0; i<brick.columnCount; i++) {
        for(j=0; j<brick.rowCount; j++) {
            if(bricks[i][j].status===1) {
                let brickX = (j*(brick.width+brick.padding))+brick.offsetLeft;
                let brickY = (i*(brick.height+brick.padding))+brick.offsetTop;
                bricks[i][j].x = brickX;
                bricks[i][j].y = brickY;
                ctx.fillStyle = colors[rand(2)-1];
                ctx.fillRect(brickX, brickY, brick.width, brick.height);
            }
        }
    }
}
function drawScore() {
    ctx.font = "bold 16px Calibri";
    ctx.fillStyle = "#f8fafc";
    ctx.fillText("Score: "+score, 8, 20);
}
function drawLives() {
    ctx.font = "bold 16px Calibri";
    ctx.fillStyle = "#f8fafc";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}
function draw() {

    // ball.xDelta = 7;
    // ball.yDelta = -7;
    // paddleWidth = 85;
    // //brick.columnCount =5;
    // lives = 3;

    ctx.clearRect(0, 0, canvas.width, canvas.height);


    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();
    if(ball.x + ball.xDelta > canvas.width-ball.r || ball.x + ball.xDelta < ball.r) {
        //wall sound
        ball.xDelta = -ball.xDelta;
    }
    if(ball.y + ball.yDelta < ball.r) {
        //wall sound
        ball.yDelta = -ball.yDelta;
    }
    else if(ball.y + ball.yDelta > canvas.height-ball.r) {
        if(ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
            collisionPaddle.play();
            ball.yDelta = -ball.yDelta;
        } else if(score === brick.rowCount*brick.columnCount) {
            winAudio.play();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.font = "40px Cabin";
            ctx.fillStyle = "#b41c28";
            ctx.fillText("YOU WIN, YOUR SCORE: " + score, 40, canvas.height/2);

            setTimeout(function(){end() }, 5000);
            return;
        }
        else {
            lostBallAudio.play();
            lives--;
            if(!lives) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.font = "40px Cabin";
                ctx.fillStyle = "#b41c28";
                ctx.fillText("GAME OVER, YOUR SCORE: " + score, 50, canvas.height/2);

                setTimeout(function(){end() }, 5000);
                return;
            }
            else {
                ball.x = canvas.width/2;
                ball.y = canvas.height-30;
                paddle.x = (canvas.width-paddle.width)/2;
            }
        }
    }
    if(rightPressed && paddle.x < canvas.width-paddle.width) {
        paddle.x += 7;
    }
    else if(leftPressed && paddle.x > 0) {
        paddle.x -= 7;
    }
    ball.x += ball.xDelta;
    ball.y += ball.yDelta;
    requestAnimationFrame(draw);
}

const end = function () {
    document.location.reload();
};
const helper  = function (xD,yD,w,c,l) {
    ball.xDelta = xD;
    ball.yDelta = yD;
    paddleWidth = w;
    brick.columnCount =c;
    lives = l;

    draw();
};