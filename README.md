# spline-keyframes

## work in progress...

Generate a spline that smoothly interpolates between a set of keyframes. Demo TODO.

Based on http://scaledinnovation.com/analytics/splines/aboutSplines.html.


## API

```js
import keyframes from 'spline-keyframes';

const curve = keyframes([
	{
		time: 0,
		value: 0
	},
	{
		time: 50,
		value: 100
	},
	{
		time: 100,
		value: 50,
		tension: 0.5 // local tension — multiplies global tension, defaults to 1
	}
], {
	tension: 0.75 // 0-1. Higher = smoother curves. Default is 0.5
});

// get the value at a given time
curve.at(-1); // 0
curve.at(0); // 0
curve.at(25); // TODO
curve.at(50); // 100
curve.at(75); // TOD
curve.at(100); // 50
curve.at(101); // 50
```


## License

[LIL](LICENSE)
