// Define the game constants
var KEY = { ESC: 27, SPACE: 32, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40 },
    DIR = { UP: 0, RIGHT: 1, DOWN: 2, LEFT: 3, MIN: 0, MAX: 3 },
    stats = new Stats(),
    canvas = get('canvas'),
    ctx = canvas.getContext('2d'),
    ucanvas = get('upcoming'),
    uctx = ucanvas.getContext('2d'),
    speed = { start: 0.6, decrement: 0.005, min: 0.1 }, // seconds until current piece drops 1 row
    nx = 10, // width of tetris court (in blocks)
    ny = 20, // height of tetris court (in blocks)
    nu = 5; // width/height of upcoming preview (in blocks)

// Define the game variables
var dx, dy, // pixel size of a single tetris block
    blocks, // 2 dimensional array (nx*ny) representing tetris court - either empty block or occupied by a 'piece'
    actions, // queue of user actions (inputs)
    playing, // true|false - game is in progress
    dt, // time since starting this game
    current, // the current piece
    next, // the next piece
    score, // the current score
    rows, // number of completed rows in the current game
    step; // how long before current piece drops by 1 row

// Define the game logic
function update(idt) {
    if (playing) {
        handle(actions.shift());
        dt = dt + idt;
        if (dt > step) {
            dt = dt - step;
            drop();
        } 
    }
};

function handle(action) {
    switch(action) {
        case DIR.LEFT: move(DIR.LEFT); break;
        case DIR.RIGHT: move(DIR.RIGHT); break;
        case DIR.UP: rotate(); break;
        case DIR.DOWN: drop(); break;
    }
};

function move(dir) {
    var x = current.x, y = current.y;
    switch(dir) {
        case DIR.RIGHT: x = x + 1; break;
        case DIR.LEFT: x = x - 1; break;
        case DIR.DOWN: y = y + 1; break;
    }
    if (unoccupied(current.type, x, y, current.dir)) {
        current.x = x;
        current.y = y;
        invalidate();
        return true;
    } else {
        return false;
    }
};

function rotate(dir) {
    var newdir = (current.dir == DIR.MAX ? DIR.MIN : current.dir + 1);
    if (unoccupied(current.type, current.x, current.y, newdir)) {
        current.dir = newdir;
        invalidate();
    }
};

function drop() {
    if (!move(DIR.DOWN)) {
        addScore(10);
        dropPiece();
        removeLines();
        setCurrentPiece(next);
        setNextPiece(randomPiece());
        if (occupied(current.type, current.x, current.y, current.dir)) {
            lose();
        }
    }
};

function dropPiece() {
    eachblock(current.type, current.x, current.y, current.dir, function(x, y) {
        setBlock(x, y, current.type);
    });
};

// Define the rendering logic
function draw() {
    ctx.save();
    ctx.lineWidth = 1;
    ctx.translate(0.5, 0.5); // for crisp 1px black lines
    drawCourt();
    drawNext();
    drawScore();
    drawRows();
    ctx.restore();
};

function drawCourt() {
    if (invalid.court) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (playing)
            drawPiece(ctx, current.type, current.x, current.y, current.dir);
        var x, y, block;
        for(y = 0 ; y < ny ; y++) {
            for (x = 0 ; x < nx ; x++) {
                if (block = getBlock(x,y))
                    drawBlock(ctx, x, y, block.color);
            }
        }
        ctx.strokeRect(0, 0, nx*dx - 1, ny*dy - 1); // court boundary
        invalid.court = false;
    }
};

function drawNext() {
    if (invalid.next) {
        var padding = (nu - next.type.size) / 2; // half-arsed attempt at centering next piece display
        uctx.save();
        uctx.translate(0.5, 