# smooth-keyframes

Generate a curve that smoothly interpolates between a set of keyframes, using a monotonicity-preserving cubic spline as proposed in [A simple method for monotonic interpolation in one dimension](http://adsabs.harvard.edu/full/1990A%26A...239..443S) and implemented in [d3-shape](https://github.com/d3/d3-shape/blob/master/src/curve/monotone.js).

Unlike normal splines, this smoothly connects a series of points without *spurious oscillations*. You can see what that means here: https://smooth-keyframes-demo.surge.sh


## API

```js
import keyframes from 'smooth-keyframes';

const y = keyframes([
	[0,0],
	[50, 100],
	[100, 50]
]);

// get the y at a given x
y(-1); // 0 — input values are clamped
y(0); // 0
y(25); // 50
y(30); // 64.8
y(50); // 100
y(100); // 50
y(101); // 50 — input values are clamped
```


## License

[MIT](LICENSE)
