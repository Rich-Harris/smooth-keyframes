# smooth-keyframes

## work in progress...

Generate a curve that smoothly interpolates between a set of keyframes. Demo TODO.


## API

```js
import keyframes from 'smooth-keyframes';

const curve = keyframes([
	[0,0],
	[50, 100],
	[100, 50]
]);

// get the value at a given time
curve(-1); // 0
curve(0); // 0
curve(25); // TODO
curve(50); // 100
curve(75); // TODO
curve(100); // 50
curve(101); // 50
```


## License

[MIT](LICENSE)
