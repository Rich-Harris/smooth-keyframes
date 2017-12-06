import { Curve } from './Curve';
import { Vector } from './Vector';

export type KeyframeData = {
	time: number;
	value: number;
	tension?: number;
}

export class Keyframe {
	curve: Curve;
	time: number;
	value: number;
	tension: number;

	previous: Keyframe;
	next: Keyframe;

	leftControlPoint: Vector;
	rightControlPoint: Vector;
	line: Vector;

	constructor(curve: Curve, data: KeyframeData) {
		this.curve = curve;
		this.time = data.time;
		this.value = data.value;
		this.tension = curve.tension * ('tension' in data ? data.tension : 1);
	}

	_link(previous: Keyframe, next: Keyframe) {
		this.previous = previous;
		this.next = next;

		this.leftControlPoint = null;
		this.rightControlPoint = null;

		if (previous && next) {
			const line = new Vector(next.time - previous.time, next.value - previous.value).scale(this.tension);

			const d0 = new Vector(this.time - previous.time, this.value - previous.value).magnitude();
			const d1 = new Vector(next.time - this.time, next.value - this.value).magnitude();

			this.leftControlPoint = line.scale(-d0 / (d0 + d1));
			this.rightControlPoint = line.scale(d1 / (d1 + d0));

			const value_multiplier = Math.min(
				0.5 * (previous.value - this.value) / this.leftControlPoint.value,
				0.5 * (next.value - this.value) / this.rightControlPoint.value,
				1
			);

			const time_multiplier = Math.min(
				0.5 * (previous.time - this.time) / this.leftControlPoint.time,
				0.5 * (next.time - this.time) / this.rightControlPoint.time,
				1
			);

			this.leftControlPoint.time *= time_multiplier;
			this.rightControlPoint.time *= time_multiplier;

			this.leftControlPoint.value *= value_multiplier;
			this.rightControlPoint.value *= value_multiplier;
		} else if (previous) {
			this.leftControlPoint = new Vector(previous.time - this.time, 0).scale(Math.min(this.tension, 0.5));
		} else if (next) {
			this.rightControlPoint = new Vector(next.time - this.time, 0).scale(Math.min(this.tension, 0.5));
		}
	}

	remove() {
		// TODO
	}
}