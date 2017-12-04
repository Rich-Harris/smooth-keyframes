import * as assert from 'assert';
import keyframes from '../src/index';

require('console-group').install();

describe('spline-keyframes', () => {
	it('returns an exact value', () => {
		const curve = keyframes([
			{ time: 0, value: 10 },
			{ time: 1, value: 20 },
			{ time: 2, value: 30 }
		]);


		assert.equal(curve.at(1), 20);
	});

	it('returns an intermedia value', () => {
		const curve = keyframes([
			{ time: 0, value: 0 },
			{ time: 1, value: 100 },
			{ time: 2, value: 50 }
		]);

		const v = curve.at(0.5);
		assert.ok(0 < v && v < 100);
	});

	it('clamps values', () => {
		const curve = keyframes([
			{ time: 0, value: 10 },
			{ time: 1, value: 20 },
			{ time: 2, value: 30 }
		]);

		assert.equal(curve.at(-1), 10);
		assert.equal(curve.at(3), 30);
	});
});