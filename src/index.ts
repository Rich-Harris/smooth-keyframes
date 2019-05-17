function sign(x: number) {
	return x < 0 ? -1 : 1;
}

// Calculate the slopes of the tangents (Hermite-type interpolation) based on
// the following paper: Steffen, M. 1990. A Simple Method for Monotonic
// Interpolation in One Dimension. Astronomy and Astrophysics, Vol. 239, NO.
// NOV(II), P. 443, 1990.
function slope3(x0: number, x1: number, x2: number, y0: number, y1: number, y2: number) {
	var h0 = x1 - x0,
		h1 = x2 - x1,
		s0 = (y1 - y0) / (h0 || (h1 < 0 && -0)),
		s1 = (y2 - y1) / (h1 || (h0 < 0 && -0)),
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

	const segments: Array<{
		x0: number,
		y0: number,
		y0c: number,
		y1c: number,
		x1: number,
		y1: number,
		width: number,
		gradient: number,
		tangent0: number,
		tangent1: number
	}> = [];

	let x0 = NaN;
	let x1 = NaN;
	let y0 = NaN;
	let y1 = NaN;
	let tangent0 = NaN;
	let state = 1;

	function handle_point(tangent0: number, tangent1: number) {
		const dx = (x1 - x0) / 3;

		segments.push({
			x0,
			y0,
			x1,
			y1,
			y0c: y0 + dx * tangent0,
			y1c: y1 - dx * tangent1,
			width: (x1 - x0),
			gradient: (y1 - y0) / (x1 - x0),
			tangent0,
			tangent1
		});
	}

	frames.forEach((point, i) => {
		const [x2, y2] = point;

		let tangent1 = NaN;

		switch (state) {
			case 1:
				state = 2;
				break;
			case 2:
				state = 3;
				tangent1 = slope3(x0, x1, x2, y0, y1, y2);
				break;
			default:
				tangent1 = slope3(x0, x1, x2, y0, y1, y2)
				handle_point(tangent0, tangent1);
				break;
		}

		x0 = x1, x1 = x2;
		y0 = y1, y1 = y2;
		tangent0 = tangent1;
	});

	const first = frames[0];
	const last = frames[frames.length - 1];

	handle_point(tangent0, 0); // final tangent, like starting tangent, is 0

	function y(x: number) {
		if (x <= first[0]) return first[1];
		if (x >= last[0]) return last[1];

		const segment = segments.find(segment => {
			return x >= segment.x0 && x < segment.x1;
		});

		const dx0 = (x - segment.x0);
		const dx1 = (x - segment.x1);

		const t = dx0 / segment.width;

		let y = segment.y0 + dx0 * segment.gradient;

		const influence0 = (segment.y0 + dx0 * segment.tangent0) - y;
		const influence1 = (segment.y1 + dx1 * segment.tangent1) - y;

		return y + (
			((1 - t) ** 2) * influence0 +
			(t ** 2) * influence1
		);
	}

	y.segments = segments;

	return y;
}
