import test from "node:test";
import assert from "node:assert/strict";

import {
	getCategoryOverscrollOffset,
	getDragScrollLeft,
	isCategoryDrag,
} from "../src/utils/categoryDrag.ts";

test("starts dragging only after passing the threshold", () => {
	assert.equal(isCategoryDrag(100, 103), false);
	assert.equal(isCategoryDrag(100, 104), true);
	assert.equal(isCategoryDrag(100, 96), true);
});

test("moves scrollLeft opposite the pointer drag", () => {
	assert.equal(getDragScrollLeft(100, 200, 150), 150);
	assert.equal(getDragScrollLeft(100, 200, 250), 50);
	assert.equal(getDragScrollLeft(0, 100, 50), 50);
});

test("resists drag overscroll past each end", () => {
	assert.equal(getCategoryOverscrollOffset(250, 500), 0);
	assert.equal(getCategoryOverscrollOffset(-100, 500), 35);
	assert.equal(getCategoryOverscrollOffset(600, 500), -35);
	assert.equal(getCategoryOverscrollOffset(-1000, 500), 72);
	assert.equal(getCategoryOverscrollOffset(1500, 500), -72);
});
