// Enemies our player must avoid

/**
 * Creates a new enemy bug to travel across the road
 *
 * @constructor
 * @this {Enemy}
 * @param {number} row=4 - Either 2, 3, or 4 = the row the bug will appear on
 * @param {number} speed - Speed bug will travel (ideal between 250-450)
 */
var Enemy = function(row, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = - (Math.floor(Math.random() * 600) + 100);
    this.y = row === 2 ? 60: (row === 3) ? 142: 225;
    this.speed = speed;
    this.row = row; // to compare with player
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

/**
 * Update the enemy's position, required method for game
 *
 * @param {number} dt - a time delta between ticks provided by engine.js
 */
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;
    //console.log(dt);
};


/**
 * Draw the enemy on the canvas, required method for game
 *
 */
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
 * Moves enemy so it will re-cross the canvas with new row
 */
Enemy.prototype.recycle = function() {
    if (this.x > 600){
        this.x = -(Math.floor(Math.random() * 400) + 100)
        let newRow = Math.floor((Math.random() * 3)+ 2);
        this.row = newRow;
        this.y = newRow === 2 ? 60: (newRow === 3) ? 142: 225;
    }
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

/**
 * Creates a player object
 *
 * @constructor
 * @param {number} x
 * @param {number} y
 */
const Player = function (x, y) {
    this.x = x,
    this.y = y,
    this.sprite = 'images/char-boy.png',
    this.row = 6;
    this.lives = 3;
}

/**
 * Check status of player - win or loss
 *
 * @this {Player}
 * @param {number} dt - a time delta between ticks provided by engine.js
 */
Player.prototype.update = function (dt) {
    if (this.row === 1) {
        player.row = 6;
        window.setTimeout( () => {
            endGame(); // pop-up div
            player.x = 202;
            player.y = 400;
        }, 300);
        return;
    }

    if (this.lives === 0) {
        this.lives = -1;
        endGame(); // pop-up div
    }

}

/**
 * Draws the player on the canvas
 *
 * @this {Player}
 */
Player.prototype.render = function () {
ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}


/**
 * Moves player when a keycode is passed from event listener
 *
 * @this {Player}
 * @param {string} keyCode - provided by event listener on key-ups
 */
Player.prototype.handleInput = function (keyCode) {
    if(paused) {
        return;
    }

    let adjustX = 0,
        adjustY = 0,
        adjustRow = 0;

    switch (keyCode) {
        case 'up':
            adjustY = (player.y <= -15) ? 0 : -83;
            adjustRow = adjustY ? - 1 : 0;
            break;
            case 'left':
            adjustX = (player.x <= 0) ? 0 : -101;
            break;
            case 'right':
            adjustX = (player.x >= 404) ? 0 : 101;
            break;
            case 'down':
            adjustY = (player.y >= 400) ? 0 : 83;
            adjustRow = adjustY ? 1 : 0;
            break;
        default:
            ;
    }

    player.x += adjustX;
    player.y += adjustY;
    player.row += adjustRow;

    console.log(`Player x: ${player.x}, Player y: ${player.y}
        Player.row: ${player.row}`);
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
const player = new Player(202, 400);
const allEnemies = [];
const menu = document.querySelector('.win-lose');
const menuMessage = document.querySelector('.message');


/**
 * Instantiates 9 enemies with random rows & speeds
 */
(function addEnemies() {
    while (allEnemies.length < 9) {
        let row = Math.floor((Math.random() * 3)+ 2);
        speed = Math.floor((Math.random() + 2) * 125);
        newEnemy = new Enemy(row, speed);
        allEnemies.push(newEnemy);
    }
})();



/**
 * Listens for key presses (directional), converts to an
 * appropriate string, sends to Player.handleInput() method
 *
 * @event keyup
 * @returns {string} 'left', 'up', 'right', or 'down'
 */
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

/**
 * Allows player to select from 3 avatars
 *
 * @listens
 */
document.querySelector('.avatar-selector').addEventListener('click', (event) => {
    document.querySelector('.selected').classList.toggle('selected');

    let selection = event.target.classList;

    if (selection.contains('avatar-1')) {
        player.sprite = 'images/char-boy.png';
    }
    else if (selection.contains('avatar-2')) {
        player.sprite = 'images/char-horn-girl.png'
    }
    else if (selection.contains('avatar-3')) {
        player.sprite = 'images/char-princess-girl.png';
    }

    selection.toggle('selected')
});


document.querySelector('button').addEventListener('click', () => {
    restartGame();
})

/**
 * resets players lives, hides the menu with the "Play Again" button
 */
function restartGame() {
    pause(); // unpause game
    player.lives = 3;
    menu.classList.toggle('hidden'); // hide menu
    document.querySelector('button').setAttribute('disabled', '');
}

/**
 * Display's the win/lost message, and presents a "Play Again" button
 *
 */
function endGame() {
    pause();
    document.querySelector('button').removeAttribute('disabled');
    document.querySelector('button').focus();

    if(player.lives !== -1) {
        menuMessage.textContent = 'You Won! Amazing!'
    }
    else {
        menuMessage.textContent = 'Uh oh! You lost!'
    }

    menu.classList.toggle('hidden');
}