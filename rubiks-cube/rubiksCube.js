//https://en.wikipedia.org/wiki/Rubik%27s_Cube
const KEYS = ["R", "R'", "L", "L'", "U", "U'", "D", "D'", "F", "F'", "B", "B'"];
class RubiksCube {
    constructor(n, sides, moves) {
        this.n = n;
        this.rotationX = -QUARTER_PI;
        this.rotationY = -QUARTER_PI;
        this.zOffset = 0;

        if (moves){
            this.moves = moves;
        } else {
            this.moves = [];
        }
        if (sides){
            [
                this.up,
                this.down,
                this.left,
                this.right,
                this.front,
                this.back
            ] = sides;
        } else {
            this.up = new Side(this.n, COLOR.WHITE, [HALF_PI, 0, 0]);
            this.down = new Side(this.n, COLOR.YELLOW, [-HALF_PI, 0, 0]);
            this.left = new Side(this.n, COLOR.BLUE, [0, -HALF_PI, 0]);
            this.right = new Side(this.n, COLOR.GREEN, [0, HALF_PI, 0]);
            this.front = new Side(this.n, COLOR.ORANGE, [0, 0, 0]);
            this.back = new Side(this.n, COLOR.RED, [PI, 0, PI]);
        }
        this.sides = [
            this.up,
            this.down,
            this.left,
            this.right,
            this.front,
            this.back
        ];
    }

    forEach(func){
        this.sides.forEach(side => side.forEach(func));
    }

    isTerminal(){
        for (let side of this.sides){
            for (let row of side.blocks){
                for (let block of row){
                    if (block.color !== side.color){
                        return false;
                    }
                }
            }
        }
        return true;
    }

    heuristic(){
        let distance = 0;
        this.sides.forEach(side => {
            side.forEach((block, i, j) => {
                const blockPos = side.blocks[i][j].pos;
                const initialPos = side.locs[i][j];
                distance +=
                    abs(blockPos.x - initialPos.x) +
                    abs(blockPos.y - initialPos.y) +
                    abs(blockPos.z - initialPos.z);
            })
        });

        return distance;
    }

    nextCubes(){
        return KEYS.map(key => this.clone().rotate(key));
    }

    rotate(key) {
        this.moves.push(key);

        switch (key) {
            case "R":
                this.rotateRight(true);
                break;
            case "R'":
                this.rotateRight(false);
                break;
            case "L":
                this.rotateLeft(true);
                break;
            case "L'":
                this.rotateLeft(false);
                break;
            case "U":
                this.rotateUp(true);
                break;
            case "U'":
                this.rotateUp(false);
                break;
            case "D":
                this.rotateDown(true);
                break;
            case "D'":
                this.rotateDown(false);
                break;
            case "B":
                this.rotateBack(true);
                break;
            case "B'":
                this.rotateBack(false);
                break;
            case "F":
                this.rotateFront(true);
                break;
            case "F'":
                this.rotateFront(false);
                break;
        }

        return this;
    }

    rotateUp(clockwise = true) {
        this.up.rotate(clockwise);

        const sides = [
            this.front.getRow(0),
            this.left.getRow(0),
            this.back.getRow(0),
            this.right.getRow(0)
        ];

        if (clockwise) {
            this.front.setRow(0, sides[3]);
            this.left.setRow(0, sides[0]);
            this.back.setRow(0, sides[1]);
            this.right.setRow(0, sides[2]);
        } else {
            this.front.setRow(0, sides[1]);
            this.left.setRow(0, sides[2]);
            this.back.setRow(0, sides[3]);
            this.right.setRow(0, sides[0]);
        }
    }

    rotateDown(clockwise = true) {
        this.down.rotate(clockwise);

        const sides = [
            this.front.getRow(this.n - 1),
            this.left.getRow(this.n - 1),
            this.back.getRow(this.n - 1),
            this.right.getRow(this.n - 1)
        ];

        if (clockwise) {
            this.front.setRow(this.n - 1, sides[1]);
            this.left.setRow(this.n - 1, sides[2]);
            this.back.setRow(this.n - 1, sides[3]);
            this.right.setRow(this.n - 1, sides[0]);
        } else {
            this.front.setRow(this.n - 1, sides[3]);
            this.left.setRow(this.n - 1, sides[0]);
            this.back.setRow(this.n - 1, sides[1]);
            this.right.setRow(this.n - 1, sides[2]);
        }
    }

    rotateLeft(clockwise = true) {
        this.left.rotate(clockwise);

        const sides = [
            this.front.getColumn(0),
            this.up.getColumn(0),
            this.back.getColumn(this.n - 1),
            this.down.getColumn(0)
        ];

        if (clockwise) {
            this.front.setColumn(0, sides[1]);
            this.up.setColumn(0, sides[2].slice().reverse());
            this.back.setColumn(this.n - 1, sides[3].slice().reverse());
            this.down.setColumn(0, sides[0]);
        } else {
            this.front.setColumn(0, sides[3]);
            this.up.setColumn(0, sides[0]);
            this.back.setColumn(this.n - 1, sides[1].slice().reverse());
            this.down.setColumn(0, sides[2].slice().reverse());
        }
    }

    rotateRight(clockwise = true) {
        this.right.rotate(clockwise);

        const sides = [
            this.front.getColumn(this.n - 1),
            this.up.getColumn(this.n - 1),
            this.back.getColumn(0),
            this.down.getColumn(this.n - 1)
        ];

        if (clockwise) {
            this.front.setColumn(this.n - 1, sides[3]);
            this.up.setColumn(this.n - 1, sides[0]);
            this.back.setColumn(0, sides[1].slice().reverse());
            this.down.setColumn(this.n - 1, sides[2].slice().reverse());
        } else {
            this.front.setColumn(this.n - 1, sides[1]);
            this.up.setColumn(this.n - 1, sides[2].slice().reverse());
            this.back.setColumn(0, sides[3].slice().reverse());
            this.down.setColumn(this.n - 1, sides[0]);
        }
    }

    rotateFront(clockwise = true) {
        this.front.rotate(clockwise);

        const sides = [
            this.up.getRow(this.n - 1),
            this.right.getColumn(0),
            this.down.getRow(0),
            this.left.getColumn(this.n - 1)
        ];

        if (clockwise) {
            this.up.setRow(this.n - 1, sides[3].reverse()),
                this.right.setColumn(0, sides[0]),
                this.down.setRow(0, sides[1].slice().reverse()),
                this.left.setColumn(this.n - 1, sides[2])
        } else {
            this.up.setRow(this.n - 1, sides[1]),
                this.right.setColumn(0, sides[2].slice().reverse()),
                this.down.setRow(0, sides[3]),
                this.left.setColumn(this.n - 1, sides[0].reverse())
        }
    }

    rotateBack(clockwise = true) {
        this.back.rotate(clockwise);

        const sides = [
            this.up.getRow(0),
            this.right.getColumn(this.n - 1),
            this.down.getRow(this.n - 1),
            this.left.getColumn(0)
        ];

        if (clockwise) {
            this.up.setRow(0, sides[1]),
                this.right.setColumn(this.n - 1, sides[2].slice().reverse()),
                this.down.setRow(this.n - 1, sides[3]),
                this.left.setColumn(0, sides[0].slice().reverse())
        } else {
            this.up.setRow(0, sides[3].slice().reverse()),
                this.right.setColumn(this.n - 1, sides[0]),
                this.down.setRow(this.n - 1, sides[1].slice().reverse()),
                this.left.setColumn(0, sides[2])
        }
    }

    render() {
        push();
        rotateX(this.rotationX);
        rotateY(this.rotationY);
        translate(0, 0, this.zOffset);
        this.sides.forEach(side => side.render());
        pop();
    }

    clone(){
        return new RubiksCube(this.n, this.sides.map(side => side.clone()), this.moves.slice());
    }

    hash(){
        return JSON.stringify({
            n: this.n,
            sides: this.sides.map(side => side.hash()),
            moves: this.moves
        });
    }

    toString(){
        return this.sides.map(side => side.toString());
    }

    static unhash(hash){
        const unhashed = JSON.parse(hash);
        const newCube = new RubiksCube(unhashed.n, unhashed.sides.map(side => Side.unhash(side)));
        newCube.moves = unhashed.moves;
        return newCube;
    }
}
