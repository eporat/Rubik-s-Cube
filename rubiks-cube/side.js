class Rotator {
    //https://en.wikipedia.org/wiki/Rotation_matrix
    constructor(rotation) {
        [this.rotationX, this.rotationY, this.rotationZ] = rotation;
    }

    rotate(vector) {
        return this.rotateZ(this.rotateY(this.rotateX(vector)));
    }

    rotateX(vector) {
        return createVector(
            vector.x,
            cos(this.rotationX) * vector.y - sin(this.rotationX) * vector.z,
            sin(this.rotationX) * vector.y + cos(this.rotationX) * vector.z
        );
    }

    rotateY(vector) {
        return createVector(
            cos(this.rotationY) * vector.x + sin(this.rotationY) * vector.z,
            vector.y,
            -sin(this.rotationY) * vector.x + cos(this.rotationY) * vector.z
        );
    }

    rotateZ(vector) {
        return createVector(
            cos(this.rotationZ) * vector.x - sin(this.rotationZ) * vector.y,
            sin(this.rotationZ) * vector.x + cos(this.rotationZ) * vector.y,
            vector.z
        );
    }
}

class Side {
    constructor(n, color, rotation, specs, size = 150) {
        this.n = n;
        this.size = size;
        this.color = color;
        this.rotation = rotation;
        [this.rotationX, this.rotationY, this.rotationZ] = this.rotation;
        if (specs){
            let {locs, rotator, blocks} = specs;
            this.locs = locs;
            this.rotator = rotator || new Rotator(rotation);
            this.blocks = blocks;
        } else {
            this.rotator = new Rotator(rotation);
            this.locs = this.initLocs();
            this.blocks = this.initBlocks();
        }
        this.spinX = 0;
        this.spinY = 0;
    }

    forEach(func) {
        this.blocks.forEach((row, i) => {
            row.forEach((block, j) => {
                func(block, i, j);
            })
        });
    }

    initBlocks() {
        return new Array(this.n).fill().map((row, i) => {
            return new Array(this.n).fill().map((value, j) => {
                return new Block(this.color, this.locs[i][j]);
            })
        });
    }

    initLocs(){
        return new Array(this.n).fill().map((row, i) => {
            return new Array(this.n).fill().map((value, j) => {
                return this.calculatePos(j, i);
            })
        });
    }

    calculatePos(j, i) {
        let x = (i - (this.n - 1) / 2);
        let y = (j - (this.n - 1) / 2);
        const v = createVector(x, y, this.n / 2);
        return this.rotator.rotate(v);
    }

    getRow(row) {
        return this.blocks[row];
    }

    setRow(rowIndex, row) {
        this.blocks[rowIndex] = row;
    }

    getColumn(col) {
        return this.blocks.map(row => row[col]);
    }

    setColumn(colIndex, col) {
        this.blocks.forEach((row, rowIndex) => {
            row[colIndex] = col[rowIndex];
        });
    }

    rotate(clockwise) {
        if (clockwise) {
            this.blocks.reverse();

            for (var i = 0; i < this.blocks.length; i++) {
                for (var j = 0; j < i; j++) {
                    const temp = this.blocks[i][j];
                    this.blocks[i][j] = this.blocks[j][i];
                    this.blocks[j][i] = temp;
                }
            }
        } else {
            this.blocks = this.blocks.map(row => row.reverse());

            for (var i = 0; i < this.blocks.length; i++) {
                for (var j = 0; j < i; j++) {
                    const temp = this.blocks[i][j];
                    this.blocks[i][j] = this.blocks[j][i];
                    this.blocks[j][i] = temp;
                }
            }
        }
    }

    render() {
        for (let i = 0; i < this.n; i++) {
            let x = (i - (this.n - 1) / 2) * this.size;
            for (let j = 0; j < this.n; j++) {
                let y = (j - (this.n - 1) / 2) * this.size;

                push();
                fill(this.blocks[j][i].color);
                // rotateY(this.spinY);
                // rotateX(this.spinX);
                rotateX(this.rotationX);
                rotateY(this.rotationY);
                rotateZ(this.rotationZ);

                translate(x, y, this.size * this.n / 2);
                strokeWeight(5);
                stroke(0);

                if (i != this.n - 1)
                    line(this.size / 2, -this.size / 2, this.size / 2, this.size / 2);

                if (j != this.n - 1)
                    line(-this.size / 2, this.size / 2, this.size / 2, this.size / 2);

                noStroke();
                rect(0, 0, this.size, this.size);
                pop();
            }
        }
    }

    toString() {
        return this.blocks
            .map(row => row.map(block => getKeyByValue(COLOR, block.color)[0]))
            .join().toString();
    }

    hash(){
        return JSON.stringify({
            n: this.n,
            color: this.color,
            rotation: this.rotation,
            locs: this.locs.map(row => row.map(loc => {
                    return [loc.x, loc.y, loc.z];
            })),
            blocks: this.blocks.map(row => row.map(block => {
                return {
                    pos: [block.pos.x, block.pos.y, block.pos.z],
                    color: block.color.toString()
                }
            }))
        });
    }

    static unhash(hash){
        const unhashed = JSON.parse(hash);
        return new Side(unhashed.n, unhashed.color, unhashed.rotation,
                        {locs: unhashed.locs, blocks: unhashed.blocks}
                    );
    }

    clone(){
        const newSide = new Side(this.n, this.color, this.rotation, {
            locs: this.locs,
            rotator: this.rotator,
            blocks: this.blocks.map(row => row.slice())
        });

        return newSide;
    }
}
