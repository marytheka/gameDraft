
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

ctx.beginPath();
ctx.moveTo(300,0);
ctx.lineTo(500,100);
ctx.stroke();

var ball = {r: 12,
    x: canvas.width/2,
    y: canvas.height-30,
    xDelta: 5,
    yDelta: -5
};

var paddleWidth = 100;
var paddle = { height: 13,
    width: paddleWidth,
    x: (canvas.width - paddleWidth)/2
};

var brick = { rowCount: 7,
    columnCount:4,
    width: 75,
    height: 20,
    padding: 10,
    offsetTop: 30,
    offsetLeft: 30
};

var rand = function(n) {
    return Math.floor((Math.random() * n) + 1);
};

var collisionAudio = new Audio("collide.mp3");
var lostBallAudio = new Audio("lostBall.mp3");
var collisionPaddle = new Audio("click.mp3");
var winAudio = new Audio("win.mp3");
var rightPressed = false;
var leftPressed = false;
var score = 0;
var lives = 4;
var colors = ["#b41c28", "#f69970"]
var bricks = [];
for(c=0; c<brick.columnCount; c++) {
    bricks[c] = [];
    for(r=0; r<brick.rowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
}
function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}
function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddle.x = relativeX - paddle.width/2;
    }
}
function collisionDetection() {
    for(c=0; c<brick.columnCount; c++) {
        for(r=0; r<brick.rowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(ball.x > b.x && ball.x < b.x+brick.width && ball.y > b.y && ball.y < b.y+brick.height) {
                    collisionAudio.play();
                    ball.yDelta = -ball.yDelta;
                    b.status = 0;
                    score++;
                    if(score == brick.rowCount*brick.columnCount) {
                        winAudio.play();
                        alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload();
                    }
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
    for(c=0; c<brick.columnCount; c++) {
        for(r=0; r<brick.rowCount; r++) {
            if(bricks[c][r].status == 1) {
                var brickX = (r*(brick.width+brick.padding))+brick.offsetLeft;
                var brickY = (c*(brick.height+brick.padding))+brick.offsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.fillStyle = colors[rand(2)-1];
                ctx.fillRect(brickX, brickY, brick.width, brick.height);
            }
        }
    }
}
function drawScore() {
    ctx.font = "bold 16px Calibri";
    ctx.fillStyle = "#50394c";
    ctx.fillText("Score: "+score, 8, 20);
}
function drawLives() {
    ctx.font = "bold 16px Calibri";
    ctx.fillStyle = "#50394c";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}
function draw() {
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
        }
        else {
            lostBallAudio.play();
            lives--;
            if(!lives) {
                alert("GAME OVER");
                document.location.reload();
            }
            else {
                ball.x = canvas.width/2;
                ball.y = canvas.height-30;
                ball.xDelta = 5;
                ball.yDelta = -5;
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

//draw();