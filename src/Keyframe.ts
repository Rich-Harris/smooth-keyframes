import { Curve } from './Curve';
import { Vector } from './Vector';

export type KeyframeData = {
	time: number;
	value: number;
	tension?: number;
}

function clamp(n: number, min: number, max: number) {
	return n < min ? min : n > max ? max : n;
}

export class Keyframe {
	curve: Curve;
	time: number;
	value: number;
	tension: number;

	previous: Keyframe;
	next: Keyframe;

	control: [Vector, Vector];

	constructor(curve: Curve, data: KeyframeData) {
		this.curve = curve;
		this.time = data.time;
		this.value = data.value;
		this.tension = curve.tension * ('tension' in data ? data.tension : 1);
	}

	_link(previous: Keyframe, next: Keyframe) {
		this.previous = previous;
		this.next = next;

		this.control = [null, null];

		if (previous && next) {
			const line = new Vector(next.time - previous.time, next.value - previous.value).scale(this.tension);

			const d0 = new Vector(this.time - previous.time, this.value - previous.value).magnitude();
			const d1 = new Vector(next.time - this.time, next.value - this.value).magnitude();

			this.control[0] = line.scale(-d0 / (d0 + d1));
			this.control[1] = line.scale(d1 / (d1 + d0));

			const value_multiplier = clamp(Math.min(
				0.5 * (previous.value - this.value) / this.control[0].value,
				0.5 * (next.value - this.value) / this.control[1].value
			) || 0, 0, 1);

			const time_multiplier = Math.min(
				0.5 * (previous.time - this.time) / this.control[0].time,
				0.5 * (next.time - this.time) / this.control[1].time,
				1
			);

			this.control[0].time *= time_multiplier;
			this.control[1].time *= time_multiplier;

			this.control[0].value *= value_multiplier;
			this.control[1].value *= value_multiplier;
		} else if (previous) {
			this.control[0] = new Vector(previous.time - this.time, 0).scale(Math.min(this.tension, 0.5));
		} else if (next) {
			this.control[1] = new Vector(next.time - this.time, 0).scale(Math.min(this.tension, 0.5));
		}
	}
}