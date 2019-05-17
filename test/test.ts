import * as assert from 'assert';
import keyframes from '../src/index';

require('console-group').install();

describe('smooth-keyframes', () => {
	it('errors if no frames provided', () => {
		assert.throws(() => {
			keyframes([]);
		}, /You must provide at least one point/);
	});

	it('handles a single point', () => {
		const y = keyframes([[5, 5]]);

		assert.equal(y(0), 5);
		assert.equal(y(5), 5);
		assert.equal(y(10), 5);
	});

	it('handles two points', () => {
		const y = keyframes([[4, 4], [6, 6]]);

		assert.equal(y(4), 4);
		assert.equal(y(5), 5);
		assert.equal(y(6), 6);
	});

	it('returns an intermediate value', () => {
		const y = keyframes([
			[0, 0],
			[1, 100],
			[2, 50]
		]);

		const v = y(0.5);
		assert.ok(0 < v && v < 100);
	});

	it('clamps values', () => {
		const y = keyframes([
			[0, 10],
			[1, 20],
			[2, 30]
		]);

		assert.equal(y(-1), 10);
		assert.equal(y(3), 30);
	});
});