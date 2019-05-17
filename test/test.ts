import * as assert from 'assert';
import keyframes from '../src/index';

require('console-group').install();

describe('smooth-keyframes', () => {
	it('returns an exact value', () => {
		const y = keyframes([
			[0, 10],
			[1, 20],
			[2, 30]
		]);


		assert.equal(y(1), 20);
	});

	it('returns an intermedia value', () => {
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