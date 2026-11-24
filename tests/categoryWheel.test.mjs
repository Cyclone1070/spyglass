import test from "node:test";
import assert from "node:assert/strict";

import { getCategoryWheelDirection } from "../src/utils/categoryWheel.ts";

const wheel = (overrides = {}) => ({
	deltaX: 0,
	deltaY: 0,
	shiftKey: false,
	ctrlKey: false,
	metaKey: false,
	altKey: false,
	...overrides,
});

test("wheel down scrolls to the next category", () => {
	assert.equal(getCategoryWheelDirection(wheel({ deltaY: 100 }), true, true), 1);
});

test("wheel up scrolls to the previous category", () => {
	assert.equal(getCategoryWheelDirection(wheel({ deltaY: -100 }), true, true), -1);
});

test("wheel down does nothing at the end of the list", () => {
	assert.equal(getCategoryWheelDirection(wheel({ deltaY: 100 }), true, false), 0);
});

test("wheel up does nothing at the start of the list", () => {
	assert.equal(getCategoryWheelDirection(wheel({ deltaY: -100 }), false, true), 0);
});

test("modified wheels are left for the browser", () => {
	for (const modifier of ["shiftKey", "ctrlKey", "metaKey", "altKey"]) {
		assert.equal(
			getCategoryWheelDirection(
				wheel({ deltaY: 100, [modifier]: true }),
				true,
				true,
			),
			0,
		);
	}
});

test("a horizontal trackpad gesture scrolls without a modifier", () => {
	assert.equal(getCategoryWheelDirection(wheel({ deltaX: 100 }), true, true), 1);
});

test("an empty wheel gesture does nothing", () => {
	assert.equal(getCategoryWheelDirection(wheel(), true, true), 0);
});
