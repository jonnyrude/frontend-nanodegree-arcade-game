/**
 * Sprite class is a parent class for Enemy, Player, and Hearts
 * (anything drawn to the screen with an image/sprite)
 *
 * @constructor
 * @param {number} x - x-position on the canvas
 * @param {number} y - y-position on the canvas
 * @param {string} sprite - the image path/file to use
 */
const Sprite = function (x, y, sprite) {
    this.x = x;
    this.y = y;
    this.sprite = sprite;
};

/**
 * Draw the Sprite on the canvas, required method for game, using
 * the this.x, this.y position and this.sprite image
 *
 *@method render
 */
Sprite.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


/**
 * Create Heart class that inherits from Sprite class
 *
 * @constructor
 * @property {number} x - x-position on canvas set to 2
 * @property {number} y - y-position on canvas, set to -10
 * @property {string} sprite - set to the path/file for this .png image
 */
const Hearts = function () {
    Sprite.call(this, 2, -10, 'images/Heart-small.png');
};

// Set Heart to inherit from Sprite
Hearts.prototype = Object.create(Sprite.prototype);

// Change Heart's constructor reference from Sprite() to Heart()
Hearts.prototype.constructor = Hearts;

/**
 * Unique render function for Hearts - renders as many images as there
 * are player.lives remaining
 *
 * @method render
 */
Hearts.prototype.render = function () {
    let heartX = this.x;
    for (let i = 0; i < player.lives; i++) {
        ctx.drawImage(Resources.get(this.sprite), heartX, this.y);
        heartX += 50; // set next heart image 50px further down x-axis of canvas
    }
}


/**
 * Creates a new Enemy (bug) class, inehrits from Sprite class, to
 * travel across the road/canvas
 *
 * @constructor
 * @param {number} row=4 - Either 2, 3, or 4 = the row the bug will appear on
 *
 * @property {number} row - Enemy's y-position, set as a parameter when instantiating
 * @property {number} speed - Speed that Enemy will move across the screen
 */
const Enemy = function (row) {
    this.row = row; // to compare with player

    // Create Enemy Object from Sprite Class
    let x = -(Math.floor(Math.random() * 900) + 100);
    let y = row === 2 ? 60 : (row === 3) ? 142 : 225;
    Sprite.call(this, x, y, 'images/enemy-bug.png');

    this.speed = Math.floor((Math.random() * 300) + 200);
};

// Set Enemy to inherit from Sprite class
Enemy.prototype = Object.create(Sprite.prototype);

// Set Enemy's constructor function to Enemy() (instead of Sprite())
Enemy.prototype.constructor = Enemy;

/**
 * Update the enemy's position, required method for game
 *
 * @method
 * @param {number} dt - a time delta between ticks (globally provided by engine.js)
 */
Enemy.prototype.update = function (dt) {
    // Multiplying any movement by the dt parameter
    // ensures the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;
    this.recycle();
};

/**
 * Moves enemy so it will re-cross the canvas with new row
 *
 * @method
 */
Enemy.prototype.recycle = function () {
    if (this.x > 600) {
        this.x = -(Math.floor(Math.random() * 400) + 100);
        let newRow = Math.floor((Math.random() * 3) + 2);
        this.row = newRow;
        this.y = newRow === 2 ? 60 : (newRow === 3) ? 142 : 225;
    }
};


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

/**
 * Creates a player object
 *
 * @constructor
 * @param {number} x - x-position on canvas
 * @param {number} y - y-position on canvas
 *
 * @property {number} row - starting at 6, row player is currently on
 * @property {number} lives - starting with 3 number of remaining lives
 */
const Player = function (x, y) {
    Sprite.call(this, x, y, 'images/char-boy.png');

    this.row = 6;
    this.lives = 3;
};

// Set Player class to inherit from Sprite class
Player.prototype = Object.create(Sprite.prototype);

// Set Player constructor to Player() (instead of Sprite())
Player.prototype.constructor = Player;

/*
 *Empty method - could be used to animate player movment
 * @method
 */
// Player.prototype.update = function () {
//     return;
// };

/**
 * Moves player when a keycode is passed from event listener
 *
 * @method
 * @listens keyup
 * @this {Player}
 * @param {string} keyCode - provided by event listener on key-ups
 */
Player.prototype.handleInput = function (keyCode) {
    // do not move player if game is lost, won, or paused
    if (paused || !inPlay) {
        return;
    }

    let adjustX = 0,
        adjustY = 0,
        adjustRow = 0;

    switch (keyCode) {
        case 'up':
            adjustY = (this.y <= -15) ? 0 : -83;
            adjustRow = adjustY ? -1 : 0;
            break;
        case 'left':
            adjustX = (this.x <= 0) ? 0 : -101;
            break;
        case 'right':
            adjustX = (this.x >= 404) ? 0 : 101;
            break;
        case 'down':
            adjustY = (this.y >= 400) ? 0 : 83;
            adjustRow = adjustY ? 1 : 0;
            break;
    }

    this.x += adjustX;
    this.y += adjustY;
    this.row += adjustRow;

    // Evaluate if player has won by reaching row 1
    if (this.row === 1) {
        this.row = 6;
        window.setTimeout(() => {
            endGame(); // pop-up div
            this.x = 202;
            this.y = 400;
        }, 300);
        return;
    }
};

/**
 * Reset player back to original position (used on win, loss, or collision)
 *
 * @method reset
 */
Player.prototype.reset = function () {
    this.x = 202;
    this.y = 400;
    this.row = 6;
};

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

/**
 * Instantiate heart object
 *
 * @type {Hearts}
 */
const lives = new Hearts();

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
        let row = Math.floor((Math.random() * 3) + 2);

        let newEnemy = new Enemy(row);
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
document.addEventListener('keyup', function (e) {
    const allowedKeys = {
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
    } else if (selection.contains('avatar-2')) {
        player.sprite = 'images/char-horn-girl.png';
    } else if (selection.contains('avatar-3')) {
        player.sprite = 'images/char-princess-girl.png';
    }

    // indicate which option is selected with .selected class
    selection.toggle('selected');
});

/**********************************************************************
 *       FEATURE:         WIN/LOST Message
 ********************************************************************* */
// grab the message <div> element
const menu = document.querySelector('.win-lose');

// grab the text to be displayed
const menuMessage = document.querySelector('.message');


/**
 * Fired by Player.handleInput - Display's the win/lost message,
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
    if (player.lives !== -1) {
        menuMessage.textContent = 'You Won! Amazing!';
    } else {
        menuMessage.textContent = 'Uh oh! You lost!';
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
});


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