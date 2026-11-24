import test from "node:test";
import assert from "node:assert/strict";

import {
	CategoryWheelQueue,
	getWheelStepDuration,
} from "../src/utils/categoryWheelQueue.ts";

test("runs one step at a time and queues the rest", () => {
	const queue = new CategoryWheelQueue();
	queue.enqueue(1);
	assert.equal(queue.next(), 1);

	queue.enqueue(1);
	queue.enqueue(1);
	assert.equal(queue.next(), 0);

	assert.equal(queue.finish(), 1);
	assert.equal(queue.finish(), 1);
	assert.equal(queue.finish(), 0);
});

test("caps the number of queued steps", () => {
	const queue = new CategoryWheelQueue(2);
	queue.enqueue(1);
	assert.equal(queue.next(), 1);

	queue.enqueue(1);
	queue.enqueue(1);
	queue.enqueue(1);
	assert.equal(queue.next(), 0);

	assert.equal(queue.finish(), 1);
	assert.equal(queue.finish(), 1);
	assert.equal(queue.finish(), 0);
});

test("reversing direction drops queued steps in the old direction", () => {
	const queue = new CategoryWheelQueue();
	queue.enqueue(1);
	assert.equal(queue.next(), 1);

	queue.enqueue(1);
	queue.enqueue(1);
	queue.enqueue(-1);
	assert.equal(queue.finish(), -1);
	assert.equal(queue.finish(), 0);
});

test("cancel clears the queue and the running state", () => {
	const queue = new CategoryWheelQueue();
	queue.enqueue(1);
	assert.equal(queue.next(), 1);

	queue.enqueue(1);
	queue.cancel();
	assert.equal(queue.next(), 0);
});

test("keeps a constant pixel speed for different step widths", () => {
	const short = getWheelStepDuration(50);
	const long = getWheelStepDuration(100);

	assert.ok(long > short);
	assert.ok(Math.abs(short / 50 - long / 100) < 0.02);
});

test("clamps step durations", () => {
	assert.equal(getWheelStepDuration(0), 80);
	assert.equal(getWheelStepDuration(10_000), 600);
});
