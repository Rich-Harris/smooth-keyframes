import { Keyframe } from './Keyframe';
import { Vector } from './Vector';

export class Segment {
	start: number;
	end: number;
	duration: number;

	p0: Vector;
	p1: Vector;
	p2: Vector;
	p3: Vector;

	p0_p1: Vector;
	p1_p2: Vector;
	p2_p3: Vector;

	magnitude: number;

	constructor(p0: Keyframe, p3: Keyframe) {
		this.start = p0.time;
		this.end = p3.time;
		this.duration = this.end - this.start;

		this.p0 = new Vector(p0.time, p0.value);
		this.p3 = new Vector(p3.time, p3.value);
		this.p1 = this.p0.add(p0.control[1]);
		this.p2 = this.p3.add(p3.control[0]);

		this.magnitude = this.p3.subtract(this.p0).magnitude();
	}

	points(n: number, points: Array<{ time: number, value: number }>) {
		const { p0, p1, p2, p3 } = this;

		if (p3.value === p0.value) n = 1;

		for (let t = 0; t < 1; t += 1 / n) {
			// https://stackoverflow.com/a/8218244/2742396
			const time = (
				(p0.time * Math.pow(1 - t, 3)) +
				(p1.time * 3 * Math.pow(1 - t, 2) * t) +
				(p2.time * 3 * (1 - t) * Math.pow(t, 2)) +
				(p3.time * Math.pow(t, 3))
			);

			const value = (
				(p0.value * Math.pow(1 - t, 3)) +
				(p1.value * 3 * Math.pow(1 - t, 2) * t) +
				(p2.value * 3 * (1 - t) * Math.pow(t, 2)) +
				(p3.value * Math.pow(t, 3))
			);

			points.push({ time, value });
		}
	}
}
