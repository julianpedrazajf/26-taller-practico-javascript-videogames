const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const pResult = document.querySelector('#result');
const reset_button = document.querySelector('#reset_button');

let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;

let timeStart;
let timePlayer;
let timeInterval;

const playerPosition = {
    x: undefined,
    y: undefined,
};

const giftPosition = {
    x: undefined,
    x: undefined,
};

let enemyPositions = [];

window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);

function fixNumber(n) {
    return Number(n.toFixed(2));
}

function setCanvasSize() {
    windowHeight = window.innerHeight * 0.7;
    windowWidth = window.innerWidth * 0.7;

    /* if(window.innerHeight > window.innerWidth) {
        canvasSize = window.innerWidth * 0.8;
    } else {
        canvasSize = window.innerHeight * 0.8;
    } */
    if (window.innerHeight > window.innerWidth) {
        if ((windowWidth % 10) !== 0) {
             canvasSize = Math.ceil(windowWidth / 10) * 10;
        } else {
             canvasSize = windowWidth;
        }} 
    else {
        if ((windowHeight % 10) !== 0) {
             canvasSize = Math.ceil(windowHeight / 10) * 10;
        } else {
             canvasSize = windowHeight;
        }
    }

    /* canvasSize = Number(canvasSize.toFixed(0));

    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);

    elementsSize = canvasSize / 10;

    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();  */   

    canvas.setAttribute('width', canvasSize);
     canvas.setAttribute('height', canvasSize);
     elementsSize = (canvasSize / 10);

    playerPosition.x = undefined;
    playerPosition.y = undefined;

     startGame();
}

function startGame() {

    console.log({ canvasSize, elementsSize});
    //console.log(window.innerWidth, window.innerHeight);

    game.font = elementsSize + 'px Verdana';
    game.textAlign = 'end';

    const map = maps[level];

    if (!map) {
        gameWin();
        return;
    }

    if(!timeStart) {
        timeStart = Date.now();
        timeInterval = setInterval(showTime, 100);
        showRecord();
    }

    const mapRows = map.trim().split('\n');
    const mapRowCols = mapRows.map(row => row.trim().split('')); 
    console.log({map,mapRows, mapRowCols});

    showLives();

    enemyPositions = [];
    game.clearRect(0,0, canvasSize, canvasSize);

    mapRowCols.forEach((row, rowI) => {
        row.forEach((col, colI) =>{
            const emoji  = emojis[col];
            const posX = elementsSize * (colI + 1);
            const posY = elementsSize * (rowI + 1);

            if (col == 'O') {
                if (!playerPosition.x && !playerPosition.y ){
                    playerPosition.x = posX;
                    playerPosition.y = posY;
                    //console.log({playerPosition});
                }
            } else if (col == 'I') {
                giftPosition.x = posX;
                giftPosition.y = posY;
            } else if (col == 'X') {
                enemyPositions.push({
                    x: posX,
                    y: posY,
                });
            }

            game.fillText(emoji, posX, posY);
        });
    });

    movePlayer();
}

function movePlayer() {
    const giftCollisionX = playerPosition.x.toFixed(3)  == giftPosition.x.toFixed(3);
    const giftCollisionY = playerPosition.y.toFixed(3)  == giftPosition.y.toFixed(3);
    const giftCollision = giftCollisionX && giftCollisionY;

    if (giftCollision){
        levelWin();
        return;
    }

    const enemyCollision =enemyPositions.find(enemy => {
        const enemyCollisionX = enemy.x.toFixed(3) == playerPosition.x.toFixed(3);
        const enemyCollisionY = enemy.y.toFixed(3) == playerPosition.y.toFixed(3);
        return enemyCollisionX && enemyCollisionY;
    });

    if (enemyCollision){
        levelFail();
    }

    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
}

function levelWin() {
    console.log('You leveled Up!');
    level++;
    startGame();
}

function levelFail() {
    console.log('You crashed into a meteorite 🥲');
    lives--;


    if (lives <= 0) {
        level = 0;
        lives = 3;
        timeStart = undefined;
    }

    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
}

function gameWin() {
    console.log('Game over!');
    clearInterval(timeInterval);

    const recordTime = localStorage.getItem('record_time');
    const playerTime = Date.now() - timeStart;

    if(recordTime) {
        if (recordTime > playerTime) {
            localStorage.setItem('record_time', playerTime);
            pResult.innerHTML = 'You broke the record! 😎';
        } else {
            pResult.innerHTML = 'Sorry, you do not beat the record 🥲';
        }
    } else {
        localStorage.setItem('record_time', playerTime);
        pResult.innerHTML = 'First time? But now try to beat your time. 😁';
    }

    console.log({recordTime, playerTime});
} 

function showLives() {
    const heartsArray = Array(lives).fill(emojis['HEART']) // [1,2,3,]
    // console.log(heartsArray);

    spanLives.innerHTML = "";
    heartsArray.forEach(heart => spanLives.append(heart));
}

function showTime() {
    spanTime.innerHTML = Date.now() - timeStart;
}

function showRecord() {
    spanRecord.innerHTML = localStorage.getItem('record_time');
}

window.addEventListener('keydown', moveByKeys);
btnUp.addEventListener('click', moveUp);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnDown.addEventListener('click', moveDown);
reset_button.addEventListener('click', resetGame);

function moveByKeys(event) {
    if (event.key == 'ArrowUp') {
        moveUp();
    } else if (event.key == 'ArrowLeft') {
        moveLeft();
    } else if (event.key == 'ArrowRight') {
        moveRight();
    } else if (event.key == 'ArrowDown') {
        moveDown();
    }
}

function moveUp() {
    console.log('I want to move up');
    if ((playerPosition.y - elementsSize) < elementsSize) {
        console.log('OUT');
    } else {
    playerPosition.y -= elementsSize;
    startGame();
    }
}
function moveLeft() {
    console.log('I want to move left');
    if ((playerPosition.x - elementsSize) < elementsSize) {
        console.log('OUT');
    } else {
    playerPosition.x -= elementsSize;
    startGame();
    }
}
function moveRight() {
    console.log('I want to move right');
    if ((playerPosition.x + elementsSize) > canvasSize) {
        console.log('OUT');
    } else {
    playerPosition.x += elementsSize;
    startGame();
    }
}
function moveDown() {
    console.log('I want to move down');
    if ((playerPosition.y + elementsSize) > canvasSize) {
        console.log('OUT');
    } else {
    playerPosition.y += elementsSize;
    startGame();
    }
}

function resetGame() {
    location.reload();
}