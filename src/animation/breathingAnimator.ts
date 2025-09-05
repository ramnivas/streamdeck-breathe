import { DidReceiveSettingsEvent, KeyDownEvent, WillAppearEvent } from "@elgato/streamdeck";
import { generateBreathingCircleSVG } from "../utils/svg-animation-utils";
import { BreathSettings } from "../state";

export class BreathingAnimator {
	private animationTimerId?: NodeJS.Timeout;
	private isAnimating = false;
	private totalSeconds = 0;
	private remainingSeconds = 0;

	start(ev: KeyDownEvent<BreathSettings>, totalSeconds: number): void {
		if (this.isAnimating) return;

		this.totalSeconds = totalSeconds;
		this.remainingSeconds = totalSeconds;

		const inhaleSeconds = ev.payload.settings?.inhaleSeconds ?? 4;
		const holdInhaleSeconds = ev.payload.settings?.holdInhaleSeconds ?? 2;
		const exhaleSeconds = ev.payload.settings?.exhaleSeconds ?? 4;
		const holdExhaleSeconds = ev.payload.settings?.holdExhaleSeconds ?? 2;

		const totalCycleSeconds = inhaleSeconds + holdInhaleSeconds + exhaleSeconds + holdExhaleSeconds;
		const fps = 15;
		const frameInterval = 1000 / fps;

		this.isAnimating = true;
		let elapsedMs = 0;

		this.animationTimerId = setInterval(async () => {
			elapsedMs += frameInterval;

			// Update remaining time
			this.remainingSeconds = Math.max(0, this.totalSeconds - Math.floor(elapsedMs / 1000));

			const cycleMs = (elapsedMs % (totalCycleSeconds * 1000));
			const cycleSeconds = cycleMs / 1000;

			let phase = 0;
			let phaseType = 'inhale';

			if (cycleSeconds < inhaleSeconds) {
				phaseType = 'inhale';
				phase = cycleSeconds / inhaleSeconds;
			} else if (cycleSeconds < inhaleSeconds + holdInhaleSeconds) {
				phaseType = 'hold-inhale';
				phase = (cycleSeconds - inhaleSeconds) / holdInhaleSeconds;
			} else if (cycleSeconds < inhaleSeconds + holdInhaleSeconds + exhaleSeconds) {
				phaseType = 'exhale';
				phase = (cycleSeconds - inhaleSeconds - holdInhaleSeconds) / exhaleSeconds;
			} else {
				phaseType = 'hold-exhale';
				phase = (cycleSeconds - inhaleSeconds - holdInhaleSeconds - exhaleSeconds) / holdExhaleSeconds;
			}

			const svgString = generateBreathingCircleSVG(phase, phaseType, this.remainingSeconds.toString());
			const svgBase64 = Buffer.from(svgString).toString('base64');
			const dataUri = `data:image/svg+xml;base64,${svgBase64}`;

			await ev.action.setImage(dataUri);
		}, frameInterval);
	}

	stop(ev: WillAppearEvent<BreathSettings> | DidReceiveSettingsEvent<BreathSettings> | KeyDownEvent<BreathSettings>): void {
		if (this.animationTimerId) {
			clearInterval(this.animationTimerId);
			this.animationTimerId = undefined;
		}
		this.isAnimating = false;
		ev.action.setImage(undefined);
		ev.action.setTitle("");
	}
}