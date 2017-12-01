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
		this.p1 = this.p0.add(p0.rightControlPoint);
		this.p2 = this.p3.add(p3.leftControlPoint);

		/*
			is there a point t such that `p0.add(p0_p1.scale(t)).time > p2.add(p2_p3.scale(t)).time`?

			find the 'crossover point' — i.e. `t` such that q0, q1 and q2 all sit on the same line between

			X0 = p0.time;
			X1 = p1.time;
			X2 = p2.time;
			X3 = p3.time;

			Y0 = p0.value;
			Y1 = p1.value;
			Y2 = p2.value;
			Y3 = p3.value;

			qX0 = X0 + (X1 - X0) * t;
			qX1 = X1 + (X2 - X1) * t;
			qX2 = X2 + (X3 - X2) * t;

			qY0 = Y0 + (Y1 - Y0) * t;
			qY1 = Y1 + (Y2 - Y1) * t;
			qY2 = Y2 + (Y3 - Y2) * t;

			SOLVE FOR t:

			(qX1 - qX0) / (qY1 - qY0) === (qX2 - qX0) / (qY2 - qX0)


		*/
	}

	points(n: number, points: Array<{ time: number, value: number }>) {
		const { p0, p1, p2, p3 } = this;

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
