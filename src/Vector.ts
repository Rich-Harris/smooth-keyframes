export class Vector {
	time: number;
	value: number;

	constructor(time: number, value: number) {
		this.time = time;
		this.value = value;
	}

	add(vector: Vector) {
		return new Vector(this.time + vector.time, this.value + vector.value);
	}

	magnitude() {
		return Math.sqrt(this.time * this.time + this.value * this.value);
	}

	scale(num: number) {
		return new Vector(this.time * num, this.value * num);
	}

	subtract(vector: Vector) {
		return new Vector(this.time - vector.time, this.value - vector.value);
	}
}