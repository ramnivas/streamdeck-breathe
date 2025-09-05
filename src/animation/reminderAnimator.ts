import { DidReceiveSettingsEvent, KeyDownEvent, WillAppearEvent } from "@elgato/streamdeck";
import { generateReminderSVG } from "../utils/svg-animation-utils";
import { BreathSettings } from "../state";

export class ReminderAnimator {
	private blinkTimerId?: NodeJS.Timeout;
	private isBlinking = false;

	start(ev: WillAppearEvent<BreathSettings> | DidReceiveSettingsEvent<BreathSettings> | KeyDownEvent<BreathSettings>): void {
		if (this.isBlinking) return;

		this.isBlinking = true;
		let blinkCount = 0;

		const blink = () => {
			// Flash red background on even counts
			const showRedBackground = blinkCount % 2 === 0;
			const breatheImage = generateReminderSVG(showRedBackground);
			const breatheImageBase64 = Buffer.from(breatheImage).toString('base64');
			const breatheDataUri = `data:image/svg+xml;base64,${breatheImageBase64}`;

			ev.action.setImage(breatheDataUri);
			blinkCount++;

			// Fast blinking for first minute (500ms intervals)
			// Slow blinking after that (3 second intervals)
			const interval = blinkCount < 120 ? 500 : 3000; // 120 blinks = 1 minute at 500ms

			this.blinkTimerId = setTimeout(blink, interval);
		};

		// Start the blinking
		blink();
	}

	stop(ev: WillAppearEvent<BreathSettings> | DidReceiveSettingsEvent<BreathSettings> | KeyDownEvent<BreathSettings>): void {
		if (this.blinkTimerId) {
			clearTimeout(this.blinkTimerId);
			this.blinkTimerId = undefined;
		}
		this.isBlinking = false;
		ev.action.setImage(undefined);
		ev.action.setTitle("");
	}
}