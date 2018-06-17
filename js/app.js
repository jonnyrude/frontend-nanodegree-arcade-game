// Enemies our player must avoid
var Enemy = function(row, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = -100;
    this.y = row === 2 ? 60: (row === 3) ? 142: 225;
    this.speed = speed;
    this.row = row; // to compare with player
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;
    //console.log(dt);
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
const Player = function (x, y) {
    this.x = x,
    this.y = y,
    this.sprite = 'images/char-boy.png',
    this.row = 6;
}


Player.prototype.update = function (dt) {
    // this.x += x;
    // this.y += y;

}

Player.prototype.render = function () {
ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.handleInput = function (keyCode) {
    console.log(keyCode);
    let adjustX = 0;
    let adjustY = 0;
    switch (keyCode) {
        case 'up':
            adjustY = (player.y <= -15) ? 0 : -83;
            player.row -= 1;
            break;
        case 'left':
            adjustX = (player.x <= 0) ? 0 : -101;
            break;
        case 'right':
            adjustX = (player.x >= 404) ? 0 : 101;
            break;
        case 'down':
            adjustY = (player.y >= 400) ?0 : 83;
            player.row += 1;
            break;
        default:
            ;
    }

    player.x += adjustX;
    player.y += adjustY;

    console.log(`Player x: ${player.x}, Player y: ${player.y}
        Player.row: ${player.row}`);
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
const player = new Player(202, 400);

let enemy1 = new Enemy(2, 60);
let enemy2 = new Enemy(3, 60);
let enemy3 = new Enemy(4, 60);

const allEnemies = [enemy1, enemy2, enemy3];

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
