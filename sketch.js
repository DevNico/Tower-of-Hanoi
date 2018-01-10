var source, destination, auxiliary;
var colors = ['blue', 'red', 'yellow', 'green', 'darkbrown', 'magenta', 'purple', 'grey', 'white', 'darkgrey', 'pink'];
var cw, mcw, stackSize, stepTime;

function setup() {
    createCanvas(windowWidth, 600, WEBGL);

    startHanoi(5, 500);
} // https://en.wikipedia.org/wiki/Tower_of_Hanoi

window.onresize = function() {
    resizeCanvas(windowWidth, windowHeight);
    calcWidths();
};

function draw() {
    background(0);

    directionalLight(255, 255, 255, -2, -2, 1);

    var w = width - 100;
    drawStack(source, (w / 3) - mcw);
    drawStack(auxiliary, (w / 3) * 2 - mcw);
    drawStack(destination, w - mcw);
}

function startHanoi(sz, st) {
    source = [];
    destination = [];
    auxiliary = [];

    if(sz > 10)
        throw 'Max Stacksize is 10!';

    stackSize = sz;
    stepTime = st;
    calcWidths();

    for(var i = stackSize; i > 0; i--)
        source.push({ value: i, color: colors[i] });

    hanoi(source, destination, auxiliary);
}

function calcWidths() {
    cw = (width / 3 - (width / 4)) / stackSize;
    mcw = stackSize * cw;
}

function drawStack(stack, x) {
    push();

    translate(-width / 2, -height / 2, 0);
    translate(x, height - 100);

    stack.forEach(function (element) {
        ambientMaterial(element.color);
        noStroke();
        cylinder(cw * element.value, 30, 48, 32);
        translate(0, -30, 0);
    })

    pop();
}

function hanoi() {
    var totalMoves = Math.pow(2, source.length);

    var loop = function (i) {
        step(i, function () {
            i += 1;
            if (i < totalMoves)
                loop(i);
        });
    }
    loop(1);
}

function step(i, callback) {
    setTimeout(function () {
        if (i % 3 == 1)
            move(source, destination);

        else if (i % 3 == 2)
            move(source, auxiliary);

        else if (i % 3 == 0)
            move(auxiliary, destination);

        callback();
    }, stepTime);
}

function move(source, destination) {
    var pole1TopDisk = source.pop();
    var pole2TopDisk = destination.pop();

    if (!pole1TopDisk) {
        source.push(pole2TopDisk);
    } else if (!pole2TopDisk) {
        destination.push(pole1TopDisk);
    } else if (pole1TopDisk.value > pole2TopDisk.value) {
        source.push(pole1TopDisk);
        source.push(pole2TopDisk);
    } else {
        destination.push(pole2TopDisk);
        destination.push(pole1TopDisk);
    }
}