# spline-keyframes changelog

## 1.0.0

* Rewrite, update API

## 0.0.5

* Fix broken binary search that would occasionally result in infinite loop

## 0.0.4

* Binary search
* Concentrate sampling on curviest segments, omit redundant samples

## 0.0.3

* Fix NaN bug with consective frames with no change in value

## 0.0.2

* Use a different set of constraints to avoid 'overshoot' and bad curves
* Changed API. Curves are now immutable.

## 0.0.1

* First release