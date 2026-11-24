type WheelLike = Pick<WheelEvent, "deltaX" | "deltaY" | "shiftKey">;

/**
 * Maps a wheel gesture over the category bar to a carousel direction.
 * Shift + vertical wheel and horizontal trackpad gestures scroll the bar;
 * a plain vertical wheel is ignored so the page keeps scrolling normally.
 */
export function getCategoryWheelDirection(
	event: WheelLike,
	canScrollPrev: boolean,
	canScrollNext: boolean,
): -1 | 0 | 1 {
	const horizontalIntent =
		event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY);
	if (!horizontalIntent) return 0;

	const delta =
		Math.abs(event.deltaX) > Math.abs(event.deltaY)
			? event.deltaX
			: event.deltaY;
	if (delta === 0) return 0;

	if (delta > 0) return canScrollNext ? 1 : 0;
	return canScrollPrev ? -1 : 0;
}
