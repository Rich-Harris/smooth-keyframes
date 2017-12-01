import { Keyframe, KeyframeData } from './Keyframe';
import { Segment } from './Segment';

export type CurveOptions = {
	tension?: number;
}

export class Curve {
	tension: number;
	frames: Keyframe[];
	segments: Segment[];

	_dirty: boolean;

	constructor(opts?: CurveOptions) {
		this.tension = opts && 'tension' in opts ? opts.tension : 0.5;
		this.frames = [];
		this.segments = [];
	}

	add(frames: KeyframeData[]) {
		this.frames = this.frames.concat(
			frames.map((data: KeyframeData) => new Keyframe(this, data))
		);

		this._sort();
		this._dirty = true;
	}

	points(n: number) {
		if (this._dirty) this._build();

		const first = this.frames[0];
		const last = this.frames[this.frames.length - 1];

		const start = first.time;
		const end = last.time;
		const duration = end - start;

		const step = (end - start) / n;

		let points: Array<{ time: number, value: number }> = [];

		this.segments.forEach(segment => {
			segment.points(
				n * segment.duration / duration,
				points
			);
		});

		points.push({
			time: last.time,
			value: last.value
		});

		return points;
	}

	_build() {
		this.segments = [];
		for (let i = 0; i < this.frames.length - 1; i += 1) {
			this.segments[i] = new Segment(
				this.frames[i],
				this.frames[i + 1]
			);
		}

		this._dirty = false;
	}

	_sort() {
		this.frames.sort((a: Keyframe, b: Keyframe) => {
			if (a.time === b.time) {
				throw new Error('Cannot have multiple keyframes with the same `time`');
			}

			return a.time - b.time;
		});

		this.frames.forEach((frame, i) => {
			frame._link(this.frames[i - 1], this.frames[i + 1]);
		});
	}
}