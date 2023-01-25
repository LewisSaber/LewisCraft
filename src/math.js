


export class Vector {
    constructor(x = 0.0, y = 0.0) {
        this.x = x;
        this.y = y;
    }

    scale(factor) {
        let result = new Vector(this.x, this.y)
        result.x *= factor
        result.y *= factor
        return result
    }
    add_vec(vector) {
        return new Vector(this.x + vector.x, this.y + vector.y)

    }
    vectorize() {
        let distance = this.x && this.y ? Math.abs(this.x / 2) + Math.abs(this.y / 2) : 0
        let hipon = (this.x ** 2 + this.y ** 2) ** 0.5
        let scale = (distance / hipon) || 1

        return new Vector(this.x * scale, this.y * scale)
    }
    multiply(vector) {
        return new Vector(this.x * vector.x, this.y * vector.y)
    }
    hasZeroAxis() {
        return this.x == 0 || this.y == 0
    }
    toString() {
        return `(${this.x}, ${this.y})`
    }
}


export class M3x3 {
    constructor() {
        this.matrix = [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ]
    }
    multiply(m) {
        var output = new M3x3();
        output.matrix = [
            this.matrix[M3x3.M00] * m.matrix[M3x3.M00] + this.matrix[M3x3.M10] * m.matrix[M3x3.M01] + this.matrix[M3x3.M20] * m.matrix[M3x3.M02],
            this.matrix[M3x3.M01] * m.matrix[M3x3.M00] + this.matrix[M3x3.M11] * m.matrix[M3x3.M01] + this.matrix[M3x3.M21] * m.matrix[M3x3.M02],
            this.matrix[M3x3.M02] * m.matrix[M3x3.M00] + this.matrix[M3x3.M12] * m.matrix[M3x3.M01] + this.matrix[M3x3.M22] * m.matrix[M3x3.M02],

            this.matrix[M3x3.M00] * m.matrix[M3x3.M10] + this.matrix[M3x3.M10] * m.matrix[M3x3.M11] + this.matrix[M3x3.M20] * m.matrix[M3x3.M12],
            this.matrix[M3x3.M01] * m.matrix[M3x3.M10] + this.matrix[M3x3.M11] * m.matrix[M3x3.M11] + this.matrix[M3x3.M21] * m.matrix[M3x3.M12],
            this.matrix[M3x3.M02] * m.matrix[M3x3.M10] + this.matrix[M3x3.M12] * m.matrix[M3x3.M11] + this.matrix[M3x3.M22] * m.matrix[M3x3.M12],

            this.matrix[M3x3.M00] * m.matrix[M3x3.M20] + this.matrix[M3x3.M10] * m.matrix[M3x3.M21] + this.matrix[M3x3.M20] * m.matrix[M3x3.M22],
            this.matrix[M3x3.M01] * m.matrix[M3x3.M20] + this.matrix[M3x3.M11] * m.matrix[M3x3.M21] + this.matrix[M3x3.M21] * m.matrix[M3x3.M22],
            this.matrix[M3x3.M02] * m.matrix[M3x3.M20] + this.matrix[M3x3.M12] * m.matrix[M3x3.M21] + this.matrix[M3x3.M22] * m.matrix[M3x3.M22]
        ];
        return output;
    }
    transition(x, y) {
        var output = new M3x3();
        output.matrix = [
            this.matrix[M3x3.M00],
            this.matrix[M3x3.M01],
            this.matrix[M3x3.M02],

            this.matrix[M3x3.M10],
            this.matrix[M3x3.M11],
            this.matrix[M3x3.M12],

            x * this.matrix[M3x3.M00] + y * this.matrix[M3x3.M10] + this.matrix[M3x3.M20],
            x * this.matrix[M3x3.M01] + y * this.matrix[M3x3.M11] + this.matrix[M3x3.M21],
            x * this.matrix[M3x3.M02] + y * this.matrix[M3x3.M12] + this.matrix[M3x3.M22]
        ];
        return output;
    }
    scale(x, y) {
        var output = new M3x3();
        output.matrix = [
            this.matrix[M3x3.M00] * x,
            this.matrix[M3x3.M01] * x,
            this.matrix[M3x3.M02] * x,

            this.matrix[M3x3.M10] * y,
            this.matrix[M3x3.M11] * y,
            this.matrix[M3x3.M12] * y,

            this.matrix[M3x3.M20],
            this.matrix[M3x3.M21],
            this.matrix[M3x3.M22]
        ];
        return output;
    }
    getFloatArray() {
        return new Float32Array(this.matrix);
    }
}
M3x3.M00 = 0;
M3x3.M01 = 1;
M3x3.M02 = 2;
M3x3.M10 = 3;
M3x3.M11 = 4;
M3x3.M12 = 5;
M3x3.M20 = 6;
M3x3.M21 = 7;
M3x3.M22 = 8;
