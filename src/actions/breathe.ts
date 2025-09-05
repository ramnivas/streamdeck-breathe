import { action, KeyDownEvent, SingletonAction, WillAppearEvent, DidReceiveSettingsEvent } from "@elgato/streamdeck";
import { BreathState, BreathSettings } from "../state";

/**
 * Breathe reminder action that blinks at user-defined intervals to remind users to take a breathing break.
 * When pressed, starts a breathing timer for the configured duration.
 */
@action({ UUID: "com.ramnivas.breathe" })
export class Breathe extends SingletonAction<BreathSettings> {
	private state = new BreathState();
	private currentSettings = BreathState.getDefaultSettings();

	override async onWillAppear(ev: WillAppearEvent<BreathSettings>): Promise<void> {
		this.currentSettings = BreathState.extractSettings(ev.payload.settings);
		this.state.startReminderTimer(ev, this.currentSettings);
	}

	override async onDidReceiveSettings(ev: DidReceiveSettingsEvent<BreathSettings>): Promise<void> {
		this.currentSettings = BreathState.extractSettings(ev.payload.settings);

		// Restart with new interval settings
		this.state.startReminderTimer(ev, this.currentSettings);
	}

	override async onKeyDown(ev: KeyDownEvent<BreathSettings>): Promise<void> {
		this.state.startBreathingTimer(ev, this.currentSettings);
	}
}
