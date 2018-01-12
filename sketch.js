var source, destination, auxiliary;
var colors = ['blue', 'red', 'darkgrey', 'green', 'grey', 'magenta', 'purple', 'lightblue', 'darkred', 'darkblue'];
var stackSize, stepTime;

var dW, dH;

// p5 setup function
function setup() {
    createCanvas(windowWidth, 600);

    // Default: initialize with 5 disks and 500ms per step
    start(5, 500);
}

// Recalculate values / Resize canvas on window resize
window.addEventListener('resize', () => {
    resizeCanvas(windowWidth, windowHeight);
    calcSizes();
});

// p5 draw function
function draw() {
    background(255);

    // Helper variables for positioning
    var s = width / 10;
    var w = width - s;
    var w3 = w / 3;

    // Draw Base & Poles
    fill('brown');
    rect(w3 - 2.5 * s, height - dH * (stackSize - 1), w, dH * 1.3, 20);
    rect(w3 - s - dH / 2, height - dH * stackSize - dH * stackSize, dH, dH * (stackSize + 1), 10, 10, 0, 0);
    rect(w3 * 2 - s - dH / 2, height - dH * stackSize  - dH * stackSize, dH, dH * (stackSize + 1), 10, 10, 0, 0);
    rect(w - s - dH / 2, height - dH * stackSize - dH * stackSize, dH, dH * (stackSize + 1), 10, 10, 0, 0);

    // Draw Stacks
    drawStack(source, w3 - s); // Source

    if(stackSize % 2 != 0) {
        drawStack(auxiliary, w3 * 2 - s); // Auxiliary
        drawStack(destination, w - s); // Destination
    } else {
        drawStack(destination, w3 * 2 - s); // Auxiliary
        drawStack(auxiliary, w - s); // Destination
    }
}

function start(sz, st) {
    // Initialize / Clear stacks
    source = [];
    destination = [];
    auxiliary = [];

    if (sz > 10)
        throw 'Max Stacksize is 10!';

    // Setup variables
    stackSize = sz;
    stepTime = st;
    calcSizes();

    // Fill source stack with appropriate amount of disks
    for (var i = stackSize; i > 0; i--) {
        console.log(colors[i - 1]);
        source.push({
            value: i,
            color: colors[i - 1]
        });
    }

    // Start the solving process
    hanoi();
}

// Calculate disk sizes based on the window width
function calcSizes() {
    dW = width / 5 / stackSize;
    dH = dW / 3 * 1.4;
}

// Draw all disks in a given stack at a given location
function drawStack(stack, x) {
    var counter = 0;
    stack.forEach(function (element) {
        let eW = dW * element.value;

        fill(element.color);
        rect(x - eW / 2, height - dH * stackSize - counter * dH, eW, dH, 20);

        fill('white');
        textSize(dH - 3);
        textAlign(CENTER);
        text(element.value, x - eW / 2 + textWidth(element.value) / 4, height - dH * stackSize - counter * dH + 1, eW, dH);
        counter++;
    })
}

function hanoi() {
    // Calculate total moves required to solve
    var totalMoves = Math.pow(2, source.length);

    // Execute step function as often as required
    var loop = function (i) {
        step(i, function () {
            i += 1;
            if (i < totalMoves) loop(i);
        });
    }
    loop(1);
}

// Do one step in solving
function step(i, callback) {
    setTimeout(function () {

        // Execute legal movement check
        if (i % 3 == 1)
            move(source, destination);
        else if (i % 3 == 2)
            move(source, auxiliary);
        else if (i % 3 == 0)
            move(auxiliary, destination);

        callback();
    }, stepTime);
}

// Check for legal movement & execute
function move(source, destination) {
    var disk1 = source.pop();
    var disk2 = destination.pop();

    if (!disk1) {
        source.push(disk2);
    } else if (!disk2) {
        destination.push(disk1);
    } else if (disk1.value > disk2.value) {
        source.push(disk1);
        source.push(disk2);
    } else {
        destination.push(disk2);
        destination.push(disk1);
    }
}