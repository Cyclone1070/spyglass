import test from "node:test";
import assert from "node:assert/strict";

import { getCategoryWheelDirection } from "../src/utils/categoryWheel.ts";

const wheel = (overrides = {}) => ({
	deltaX: 0,
	deltaY: 0,
	shiftKey: false,
	...overrides,
});

test("shift + wheel down scrolls to the next category", () => {
	assert.equal(
		getCategoryWheelDirection(wheel({ shiftKey: true, deltaY: 100 }), true, true),
		1,
	);
});

test("shift + wheel up scrolls to the previous category", () => {
	assert.equal(
		getCategoryWheelDirection(wheel({ shiftKey: true, deltaY: -100 }), true, true),
		-1,
	);
});

test("shift + wheel down does nothing at the end of the list", () => {
	assert.equal(
		getCategoryWheelDirection(wheel({ shiftKey: true, deltaY: 100 }), true, false),
		0,
	);
});

test("shift + wheel up does nothing at the start of the list", () => {
	assert.equal(
		getCategoryWheelDirection(wheel({ shiftKey: true, deltaY: -100 }), false, true),
		0,
	);
});

test("a plain vertical wheel is left for the page to scroll", () => {
	assert.equal(getCategoryWheelDirection(wheel({ deltaY: 100 }), true, true), 0);
});

test("a horizontal trackpad gesture scrolls without shift", () => {
	assert.equal(getCategoryWheelDirection(wheel({ deltaX: 100 }), true, true), 1);
});

test("an empty wheel gesture does nothing", () => {
	assert.equal(
		getCategoryWheelDirection(wheel({ shiftKey: true }), true, true),
		0,
	);
});
