/**
 * Starts a countdown timer with tick callbacks
 * @param timerSeconds Total duration in seconds
 * @param tickIntervalSeconds Interval between ticks in seconds
 * @param onTick Callback fired each tick with seconds left
 * @param onDone Callback fired when timer completes
 * @returns Timer ID that can be used to clear the timer
 */
export function startTimer(
	timerSeconds: number, 
	tickIntervalSeconds: number,
	onTick: (secondsLeft: number) => void, 
	onDone: () => void | Promise<void>
): NodeJS.Timeout {
	let secondsLeft = timerSeconds;

	const timerId = setInterval(() => {
		secondsLeft--;
		onTick(secondsLeft);
		if (secondsLeft <= 0) {
			clearInterval(timerId);
			onDone();
		}
	}, tickIntervalSeconds * 1000);

	return timerId;
}