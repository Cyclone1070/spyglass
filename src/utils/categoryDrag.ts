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
