export default function keyframes(frames: Array<[number, number]>) {
	frames = frames.slice().sort((a, b) => a[0] - b[0]);

	// Get consecutive differences and slopes
	const dxs = [];
	const dys = [];
	const ms = [];

	for (let i = 0; i < frames.length - 1; i += 1) {
		const a = frames[i];
		const b = frames[i + 1];

		dxs[i] = b[0] - a[0];
		dys[i] = b[1] - a[1];
		ms[i] = dys[i] / dxs[i];
	}

	// Get degree-1 coefficients
	const c1s = [ms[0]];
	for (let i = 0; i < dxs.length - 1; i++) {
		const m = ms[i];
		const m_next = ms[i + 1];

		if (m * m_next <= 0) {
			c1s[i] = 0;
		} else {
			const dx = dxs[i];
			const dx_next = dxs[i + 1];
			const common = dx + dx_next;

			c1s[i] = 3 * common / ((common + dx_next) / m + (common + dx) / m_next);
		}
	}

	c1s.push(ms[ms.length - 1]);

	// Get degree-2 and degree-3 coefficients
	const c2s: number[] = [];
	const c3s: number[] = [];

	for (let i = 0; i < c1s.length - 1; i++) {
		const c1 = c1s[i];
		const m = ms[i];
		const inv_dx = 1/dxs[i];
		const common = c1 + c1s[i + 1] - m - m;

		c2s[i] = (m - c1 - common) * inv_dx;
		c3s[i] = common * inv_dx * inv_dx;
	}

	const first = frames[0];
	const last = frames[frames.length - 1];

	return (x: number) => {
		// clamp
		if (x <= first[0]) return first[1];
		if (x >= last[0]) return last[1];

		// Search for the interval x is in, returning the corresponding y if x is one of the original xs
		let low = 0;
		let high = c3s.length - 1;

		while (low <= high) {
			const mid = Math.floor(0.5 * (low + high));

			var x_here = frames[mid][0];

			if (x_here < x) {
				low = mid + 1;
			} else if (x_here > x) {
				high = mid - 1;
			} else {
				return frames[mid][1];
			}
		}

		const i = Math.max(0, high);

		// Interpolate
		const diff = x - frames[i][0];
		const diff_sq = diff * diff;

		return frames[i][1] + c1s[i] * diff + c2s[i] * diff_sq + c3s[i] * diff * diff_sq;
	};
}