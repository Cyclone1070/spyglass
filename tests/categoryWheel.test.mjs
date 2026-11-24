import test from "node:test";
import assert from "node:assert/strict";

import { getCategoryWheelAction } from "../src/utils/categoryWheel.ts";

const wheel = (overrides = {}) => ({
	deltaX: 0,
	deltaY: 0,
	shiftKey: false,
	ctrlKey: false,
	metaKey: false,
	altKey: false,
	...overrides,
});

test("shift + wheel down scrolls to the next category", () => {
	assert.deepEqual(
		getCategoryWheelAction(wheel({ shiftKey: true, deltaY: 100 }), true, true),
		{ handled: true, direction: 1 },
	);
});

test("shift + wheel up scrolls to the previous category", () => {
	assert.deepEqual(
		getCategoryWheelAction(wheel({ shiftKey: true, deltaY: -100 }), true, true),
		{ handled: true, direction: -1 },
	);
});

test("shift + wheel is still consumed at the end of the list", () => {
	assert.deepEqual(
		getCategoryWheelAction(wheel({ shiftKey: true, deltaY: 100 }), true, false),
		{ handled: true, direction: 0 },
	);
});

test("shift + wheel is still consumed at the start of the list", () => {
	assert.deepEqual(
		getCategoryWheelAction(wheel({ shiftKey: true, deltaY: -100 }), false, true),
		{ handled: true, direction: 0 },
	);
});

test("a plain vertical wheel is left for the page to scroll", () => {
	assert.deepEqual(
		getCategoryWheelAction(wheel({ deltaY: 100 }), true, true),
		{ handled: false, direction: 0 },
	);
});

test("a horizontal trackpad gesture scrolls without shift", () => {
	assert.deepEqual(
		getCategoryWheelAction(wheel({ deltaX: 100 }), true, true),
		{ handled: true, direction: 1 },
	);
});

test("ctrl, meta and alt wheels are left for the browser", () => {
	for (const modifier of ["ctrlKey", "metaKey", "altKey"]) {
		assert.deepEqual(
			getCategoryWheelAction(
				wheel({ deltaY: 100, [modifier]: true }),
				true,
				true,
			),
			{ handled: false, direction: 0 },
		);
	}
});

test("an empty wheel gesture does nothing", () => {
	assert.deepEqual(getCategoryWheelAction(wheel(), true, true), {
		handled: false,
		direction: 0,
	});
});
