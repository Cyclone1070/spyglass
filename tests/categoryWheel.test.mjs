import test from "node:test";
import assert from "node:assert/strict";

import { getCategoryWheelScroll } from "../src/utils/categoryWheel.ts";

const wheel = (overrides = {}) => ({
	deltaX: 0,
	deltaY: 0,
	deltaMode: 0,
	shiftKey: false,
	ctrlKey: false,
	metaKey: false,
	altKey: false,
	...overrides,
});

test("shift + wheel down scrolls the bar right", () => {
	assert.deepEqual(
		getCategoryWheelScroll(wheel({ shiftKey: true, deltaY: 100 })),
		{ handled: true, delta: 100 },
	);
});

test("shift + wheel up scrolls the bar left", () => {
	assert.deepEqual(
		getCategoryWheelScroll(wheel({ shiftKey: true, deltaY: -100 })),
		{ handled: true, delta: -100 },
	);
});

test("a plain vertical wheel is left for the page to scroll", () => {
	assert.deepEqual(getCategoryWheelScroll(wheel({ deltaY: 100 })), {
		handled: false,
		delta: 0,
	});
});

test("a horizontal trackpad gesture scrolls the bar", () => {
	assert.deepEqual(getCategoryWheelScroll(wheel({ deltaX: 100 })), {
		handled: true,
		delta: 100,
	});
});

test("ctrl, meta and alt wheels are left for the browser", () => {
	for (const modifier of ["ctrlKey", "metaKey", "altKey"]) {
		assert.deepEqual(
			getCategoryWheelScroll(wheel({ deltaY: 100, [modifier]: true })),
			{ handled: false, delta: 0 },
		);
	}
});

test("an empty wheel gesture does nothing", () => {
	assert.deepEqual(getCategoryWheelScroll(wheel()), {
		handled: false,
		delta: 0,
	});
});
