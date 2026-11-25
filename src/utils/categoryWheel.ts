type WheelLike = Pick<
	WheelEvent,
	"deltaX" | "deltaY" | "shiftKey" | "ctrlKey" | "metaKey" | "altKey"
>;

export type CategoryWheelScroll = {
	handled: boolean;
	delta: number;
};

const NOT_HANDLED: CategoryWheelScroll = { handled: false, delta: 0 };

/**
 * Maps a wheel gesture over the category bar to a native horizontal scroll
 * delta. Shift + wheel is always handled, including at either end, so the
 * browser's previous-page gesture cannot fire. Plain vertical wheels stay
 * with the page; horizontal trackpad gestures move the bar.
 */
export function getCategoryWheelScroll(event: WheelLike): CategoryWheelScroll {
	if (event.ctrlKey || event.metaKey || event.altKey) return NOT_HANDLED;

	const horizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY);
	const delta = horizontal ? event.deltaX : event.deltaY;
	if (delta === 0) return NOT_HANDLED;

	if (event.shiftKey) return { handled: true, delta };
	return horizontal ? { handled: true, delta } : NOT_HANDLED;
}
