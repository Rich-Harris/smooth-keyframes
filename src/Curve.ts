import { Keyframe, KeyframeData } from './Keyframe';
import { Segment } from './Segment';

export type CurveOptions = {
	tension?: number;
	samples?: number;
}

export class Curve {
	tension: number;
	samples: number;
	frames: Keyframe[];
	segments: Segment[];
	points: Array<{ time: number, value: number }>;

	_dirty: boolean;

	constructor(frames: KeyframeData[], opts?: CurveOptions) {
		this.tension = opts && 'tension' in opts ? opts.tension : 0.5;
		this.samples = opts && 'samples' in opts ? opts.samples : 100;

		this.frames = frames
			.map((data: KeyframeData) => new Keyframe(this, data))
			.sort((a: Keyframe, b: Keyframe) => {
				if (a.time === b.time) {
					throw new Error('Cannot have multiple keyframes with the same `time`');
				}

				return a.time - b.time;
			});

		this.frames.forEach((frame, i) => {
			frame._link(this.frames[i - 1], this.frames[i + 1]);
		});

		this.segments = [];
		for (let i = 0; i < this.frames.length - 1; i += 1) {
			this.segments[i] = new Segment(
				this.frames[i],
				this.frames[i + 1]
			);
		}

		const first = this.frames[0];
		const last = this.frames[this.frames.length - 1];

		const start = first.time;
		const end = last.time;
		const duration = end - start;

		const n = opts && 'samples' in opts ? opts.samples : duration / (1 / 30);
		const step = (end - start) / n;

		this.points = [];

		this.segments.forEach(segment => {
			segment.points(
				n * segment.duration / duration,
				this.points
			);
		});

		this.points.push({
			time: last.time,
			value: last.value
		});
	}

	at(time: number) {
		const first = this.frames[0];
		const last = this.frames[this.frames.length - 1];

		if (time <= first.time) return first.value;
		if (time >= last.time) return last.value;

		for (let i = 0; i < this.points.length - 1; i += 1) {
			const a = this.points[i];
			const b = this.points[i + 1];

			if (a.time <= time && time < b.time) {
				return a.value + (time - a.time) * (b.value - a.value);
			}
		}
	}
}