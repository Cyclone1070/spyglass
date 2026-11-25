export const CATEGORY_DRAG_THRESHOLD_PX = 4;

export function isCategoryDrag(startX: number, currentX: number): boolean {
	return Math.abs(currentX - startX) >= CATEGORY_DRAG_THRESHOLD_PX;
}

export function getDragScrollLeft(
	startScrollLeft: number,
	startX: number,
	currentX: number,
): number {
	return startScrollLeft - (currentX - startX);
}

const OVERSCROLL_RESISTANCE = 0.35;
const OVERSCROLL_LIMIT_PX = 72;

export function getCategoryOverscrollOffset(
	rawScrollLeft: number,
	maxScrollLeft: number,
): number {
	const clamped = Math.max(0, Math.min(maxScrollLeft, rawScrollLeft));
	const overflow = rawScrollLeft - clamped;
	if (overflow === 0) return 0;

	return Math.max(
		-OVERSCROLL_LIMIT_PX,
		Math.min(OVERSCROLL_LIMIT_PX, -overflow * OVERSCROLL_RESISTANCE),
	);
}
