let rubiksCube;
const N = 2;
let angle = 0;
let COLOR;
let cameraZ;
let inp, button;
let path, solving = false;
let index = 0;
let count = 0;
let ROTATION;
let pg;
let moves = [];

function setup() {
    createCanvas(1000, 1000, WEBGL);

    rectMode(CENTER);
    noStroke();
    COLOR = {
        "WHITE": color('white'),
        "ORANGE": color('orange'),
        "RED": color('red'),
        "BLUE": color('blue'),
        "YELLOW": color('yellow'),
        "GREEN": color('green')
    }

    rubiksCube = new RubiksCube(N);

    cameraZ = height / 2;

    inp = createInput('');
    inp.input(() => null);

	button = createButton("Solve");
	button.mousePressed(solve);

	pg = createGraphics(100, 100);
	pg.textAlign(CENTER);

	// for (let i = 0; i < 3; i++){
	// 	const key = random(KEYS);
	// 	rubiksCube.rotate(key);
	// }
}

function draw() {
	if (solving){
		if (count % 100 == 0){
			index++;
			if (moves[index]){
				rubiksCube = rubiksCube.rotate(moves[index]);
			} else {
				solving = false;
			}
		}

		count ++;
	}

	if (keyIsDown(LEFT_ARROW)){
		rubiksCube.rotationY += 0.01;
	} else if (keyIsDown(RIGHT_ARROW)){
		rubiksCube.rotationY -= 0.01;
	} else if (keyIsDown(UP_ARROW)){
		rubiksCube.rotationX += 0.01;
	} else if (keyIsDown(DOWN_ARROW)){
		rubiksCube.rotationX -= 0.01;
	}
    let cameraX = cameraY = 0;
    camera(cameraX, cameraY, cameraZ / tan(PI * 30.0 / 180.0), 0, 0, 0, 0, 1, 0);
    background(175);
    rubiksCube.render();

	if (solving){
		pg.background(175);
		if (moves[index]){
			pg.text(moves[index], pg.width/2, pg.height/2);
		}
		//pass graphics as texture
		texture(pg);
		translate(- width/10, -height/10, 600);
		plane(100);
	}
}

function mouseDragged() {
    const sensitivity = 2;
    const mag = 0.01;
    const dx = pmouseX - mouseX;
    const dy = pmouseY - mouseY;
    rubiksCube.rotationY += abs(dx) > sensitivity ? dx * mag : 0
    rubiksCube.rotationX += abs(dy) > sensitivity ? dy * mag : 0
}

function keyPressed() {
    if (keyCode === 13) {
        rotateByInput();
    }

    if (key === 'Q') {
        rubiksCube = new RubiksCube(N);
    }

	if (key === 'W') {
		rubiksCube.rotationX = -QUARTER_PI;
		rubiksCube.rotationY = -QUARTER_PI;
		cameraZ = height / 2;
	}
}

function mouseWheel(event) {
    const mag = 2;
    cameraZ += event.delta;
}

function rotateByInput() {
    strings = inp.value();
    codes = strings.split(" ");


    codes.forEach((code) => {
        rubiksCube.rotate(code);
    })
}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

function solve(){
	path = a_star(rubiksCube);

	solving = true;
	index = -1;
	count = 0;

	moves = path[0].moves;
}

function reverseMove(move){
	if (move.length == 2){
		return move[0];
	} else {
		return move + "'"
	}
}
