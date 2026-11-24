export type CategoryWheelDirection = -1 | 1;

const WHEEL_SPEED_PX_PER_MS = 0.28;
const MIN_WHEEL_STEP_MS = 80;
const MAX_WHEEL_STEP_MS = 600;

/**
 * Returns a duration that keeps the carousel moving at the same pixel speed
 * regardless of how wide the next category is. A fixed duration for every
 * step makes wide categories visibly accelerate.
 */
export function getWheelStepDuration(distancePx: number): number {
	const duration = Math.abs(distancePx) / WHEEL_SPEED_PX_PER_MS;
	return Math.round(
		Math.min(MAX_WHEEL_STEP_MS, Math.max(MIN_WHEEL_STEP_MS, duration)),
	);
}

/**
 * Serializes wheel steps so a burst of wheel events never starts a new
 * transition before the previous one has finished. Overlapping transitions
 * are what make the carousel speed up.
 */
export class CategoryWheelQueue {
	private pending = 0;
	private animating = false;
	private readonly maxPending: number;

	constructor(maxPending = 4) {
		this.maxPending = maxPending;
	}

	enqueue(direction: CategoryWheelDirection): void {
		if (this.pending !== 0 && Math.sign(this.pending) !== direction) {
			this.pending = direction;
			return;
		}

		this.pending = Math.max(
			-this.maxPending,
			Math.min(this.maxPending, this.pending + direction),
		);
	}

	next(): -1 | 0 | 1 {
		if (this.animating || this.pending === 0) return 0;

		const direction: CategoryWheelDirection = this.pending > 0 ? 1 : -1;
		this.pending -= direction;
		this.animating = true;
		return direction;
	}

	finish(): -1 | 0 | 1 {
		this.animating = false;
		return this.next();
	}

	cancel(): void {
		this.pending = 0;
		this.animating = false;
	}
}
