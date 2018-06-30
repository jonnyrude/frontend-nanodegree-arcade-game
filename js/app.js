/**
 * Creates a new enemy bug to travel across the road/canvas
 *
 * @constructor
 * @param {number} row=4 - Either 2, 3, or 4 = the row the bug will appear on
 * @param {number} speed - Speed bug will travel (ideal between 250-450)
 *
 * @property {number} x - Enemy's x position, randomly set between -100 and -900
 * @property {string} sprite - Enemy's image (.png) drawn on canvas
 */
var Enemy = function(row, speed) {
    this.x = - (Math.floor(Math.random() * 900) + 100);
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
 * @function
 * @param {number} dt - a time delta between ticks (globally provided by engine.js)
 */
Enemy.prototype.update = function(dt) {
    // Multiplying any movement by the dt parameter
    // ensures the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;
};


/**
 * Draw the enemy on the canvas, required method for game
 *
 *@function
 */
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
 * Moves enemy so it will re-cross the canvas with new row
 *
 * @function
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
 * @function
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
 * @function
 * @this {Player}
 */
Player.prototype.render = function () {
ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}


/**
 * Moves player when a keycode is passed from event listener
 *
 * @function
 * @listens keyup
 * @this {Player}
 * @param {string} keyCode - provided by event listener on key-ups
 */
Player.prototype.handleInput = function (keyCode) {
    if(paused || !inPlay) {
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
}


// Now instantiate your objects.
// Place the player object in a variable called player

// Variable to record play state (no player movement after game ends)
let inPlay = true;


/**
 * Instantiate a player object
 *
 * @type {Player}
 */
const player = new Player(202, 400);


// Place all enemy objects in an array called allEnemies

/**
 * Array of enemy objects, this array is iterated and drawn to canvas
 *
 * @type {Enemy[]}
 */
const allEnemies = [];


/**
 * Instantiates 9 enemies with random rows & speeds into allEnemies array
 *
 * @function addEnemies
 */
(function addEnemies() {
    while (allEnemies.length < 9) {
        let row = Math.floor((Math.random() * 3)+ 2);
        speed = Math.floor((Math.random() * 300) + 200);
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


/**********************************************************************
 *      FEATURE:        CHANGE AVATARS
 ********************************************************************* */

/**
 * Allows player to select from 3 avatars
 *
 * @listens
 */
document.querySelector('.avatar-selector').addEventListener('click', (event) => {

    // the .selected class adds style to indicate which avater is already chosen
    // remove previous choice's selection
    document.querySelector('.selected').classList.toggle('selected');

    // get selection (indicated by it's html class)
    let selection = event.target.classList;

    // change avatar of player (player.sprite)
    if (selection.contains('avatar-1')) {
        player.sprite = 'images/char-boy.png';
    }
    else if (selection.contains('avatar-2')) {
        player.sprite = 'images/char-horn-girl.png'
    }
    else if (selection.contains('avatar-3')) {
        player.sprite = 'images/char-princess-girl.png';
    }

    // indicate which option is selected with .selected class
    selection.toggle('selected')
});

/**********************************************************************
 *       FEATURE:         WIN/LOST Message
 ********************************************************************* */
// grab the message <div> element
const menu = document.querySelector('.win-lose');

// grab the text to be displayed
const menuMessage = document.querySelector('.message');


/**
 * Fired by Player.update - Display's the win/lost message,
 * and provide a "Play Again" button
 *
 * @function endGame
 */
function endGame() {
    inPlay = false;

    // enable the button "Play Again"
    document.querySelector('button').removeAttribute('disabled');

    // focus on the button - easier to restart game with 'enter' key
    document.querySelector('button').focus();

    // Update win/lost message
    if(player.lives !== -1) {
        menuMessage.textContent = 'You Won! Amazing!'
    }
    else {
        menuMessage.textContent = 'Uh oh! You lost!'
    }

    // display the win/lost message
    menu.classList.toggle('hidden');
}


/**
 * Event listener for "Play Again" button
 *
 * @listens
 */
document.querySelector('button').addEventListener('click', () => {
    restartGame();
})


/**
 * Resets players lives, hides the menu with the "Play Again" button
 *
 * @function restartGame
 */
function restartGame() {
    inPlay = true; // unpause game
    player.lives = 3;
    menu.classList.toggle('hidden'); // hide menu
    document.querySelector('button').setAttribute('disabled', '');
}

