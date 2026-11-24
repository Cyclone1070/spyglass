type WheelLike = Pick<
	WheelEvent,
	"deltaX" | "deltaY" | "shiftKey" | "ctrlKey" | "metaKey" | "altKey"
>;

export type CategoryWheelAction = {
	handled: boolean;
	direction: -1 | 0 | 1;
};

const NOT_HANDLED: CategoryWheelAction = { handled: false, direction: 0 };

/**
 * Maps a wheel gesture over the category bar to a carousel action.
 * Shift + wheel is always consumed while the pointer is over the bar,
 * including at either end, so the browser's previous-page gesture cannot
 * fire. Plain vertical wheels stay with the page; horizontal trackpad
 * gestures move the bar.
 */
export function getCategoryWheelAction(
	event: WheelLike,
	canScrollPrev: boolean,
	canScrollNext: boolean,
): CategoryWheelAction {
	if (event.ctrlKey || event.metaKey || event.altKey) return NOT_HANDLED;

	const delta =
		Math.abs(event.deltaX) > Math.abs(event.deltaY)
			? event.deltaX
			: event.deltaY;
	if (delta === 0) return NOT_HANDLED;

	const direction: -1 | 0 | 1 =
		delta > 0 ? (canScrollNext ? 1 : 0) : canScrollPrev ? -1 : 0;

	if (event.shiftKey) {
		return { handled: true, direction };
	}

	const isHorizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY);
	if (!isHorizontal || direction === 0) return NOT_HANDLED;

	return { handled: true, direction };
}
