import { Curve, CurveOptions } from './Curve';
import { KeyframeData } from './Keyframe';

export default function keyframes(frames: KeyframeData[], opts?: CurveOptions) {
	return new Curve(frames, opts);
}