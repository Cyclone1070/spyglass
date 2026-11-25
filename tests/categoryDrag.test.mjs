import test from "node:test";
import assert from "node:assert/strict";

import {
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
