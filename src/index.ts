import { Curve, CurveOptions } from './Curve';

export default function keyframes(opts?: CurveOptions) {
	return new Curve(opts);
}