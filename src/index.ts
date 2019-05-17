function sign(x: number) {
	return x < 0 ? -1 : 1;
}

// Calculate the slopes of the tangents (Hermite-type interpolation) based on
// the following paper: Steffen, M. 1990. A Simple Method for Monotonic
// Interpolation in One Dimension. Astronomy and Astrophysics, Vol. 239, NO.
// NOV(II), P. 443, 1990.
function slope3({ _x0, _x1, _y0, _y1 }: { _x0: number, _x1: number, _y0: number, _y1: number }, x2: number, y2: number) {
	var h0 = _x1 - _x0,
		h1 = x2 - _x1,
		s0 = (_y1 - _y0) / (h0 || (h1 < 0 && -0)),
		s1 = (y2 - _y1) / (h1 || (h0 < 0 && -0)),
		p = (s0 * h1 + s1 * h0) / (h0 + h1);
	return (
		(sign(s0) + sign(s1)) *
			Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(p)) || 0
	);
}

export default function keyframes(frames: Array<[number, number]>) {
	if (!frames || frames.length === 0) {
		throw new Error(`You must provide at least one point`);
	}

	frames = frames.slice().sort((a, b) => a[0] - b[0]);

	const segments: Array<{ x1: number, y1: number, c1x: number, c1y: number, c2x: number, c2y: number, x2: number, y2: number }> = [];

	let _x0 = NaN;
	let _x1 = NaN;
	let _y0 = NaN;
	let _y1 = NaN;
	let _t0 = NaN;
	let _point = 1;

	function handle_point(t0: number, t1: number) {
		var dx = (_x1 - _x0) / 3;

		segments.push({
			x1: _x0,
			y1: _y0,
			c1x: _x0 + dx,
			c1y: _y0 + dx * t0,
			c2x: _x1 - dx,
			c2y: _y1 - dx * t1,
			x2: _x1,
			y2: _y1
		});
	}

	frames.forEach((point, i) => {
		let [x, y] = point;

		var t1 = NaN;

		switch (_point) {
			case 1:
				_point = 2;
				break;
			case 2:
				_point = 3;
				t1 = slope3({ _x0, _x1, _y0, _y1 }, x, y);
				break;
			default:
				handle_point(_t0, (t1 = slope3({ _x0, _x1, _y0, _y1 }, x, y)));
				break;
		}

		(_x0 = _x1), (_x1 = x);
		(_y0 = _y1), (_y1 = y);
		_t0 = t1;
	});

	const first = frames[0];
	const last = frames[frames.length - 1];

	handle_point(_t0, (slope3({ _x0, _x1, _y0, _y1 }, last[0] + 1, last[1])));

	function y(x: number) {
		if (x <= first[0]) return first[1];
		if (x >= last[0]) return last[1];

		const segment = segments.find(segment => {
			return x >= segment.x1 && x < segment.x2;
		});

		const t = (x - segment.x1) / (segment.x2 - segment.x1);

		// extrapolate control point 1 to x2
		// extrapolate control point 2 to x1
		const control_point_1_y_at_x2 = segment.y1 + (segment.c1y - segment.y1) * 3;
		const control_point_2_y_at_x1 = segment.y2 + (segment.c2y - segment.y2) * 3;

		let y = segment.y1 + t * (segment.y2 - segment.y1);

		const control_point_1_y_at_t = segment.y1 + t * (control_point_1_y_at_x2 - segment.y1);
		const control_point_2_y_at_t = control_point_2_y_at_x1 + t * (segment.y2 - control_point_2_y_at_x1);

		const control_point_1_dy_at_t = control_point_1_y_at_t - y;
		const control_point_2_dy_at_t = control_point_2_y_at_t - y;

		y += ((1 - t) ** 2) * control_point_1_dy_at_t;
		y += (t ** 2) * control_point_2_dy_at_t;

		return y;
	}

	y.segments = segments;

	return y;
}
