type WheelLike = Pick<
	WheelEvent,
	"deltaX" | "deltaY" | "shiftKey" | "ctrlKey" | "metaKey" | "altKey"
>;

/**
 * Maps a wheel gesture over the category bar to a carousel direction.
 * Plain vertical wheel and horizontal trackpad gestures scroll the bar;
 * modified wheels are left for the browser (for example, Shift+wheel is
 * the browser's previous-page gesture).
 */
export function getCategoryWheelDirection(
	event: WheelLike,
	canScrollPrev: boolean,
	canScrollNext: boolean,
): -1 | 0 | 1 {
	if (event.shiftKey || event.ctrlKey || event.metaKey || event.altKey) {
		return 0;
	}

	const delta =
		Math.abs(event.deltaX) > Math.abs(event.deltaY)
			? event.deltaX
			: event.deltaY;
	if (delta === 0) return 0;

	if (delta > 0) return canScrollNext ? 1 : 0;
	return canScrollPrev ? -1 : 0;
}
