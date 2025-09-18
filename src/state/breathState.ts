import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

import { JsonObject, WillAppearEvent, DidReceiveSettingsEvent, KeyDownEvent } from "@elgato/streamdeck";
import { BreathingAnimator, ReminderAnimator } from "../animation";
import { SoundPlayer } from "../audio/soundPlayer";

export interface BreathSettings extends JsonObject {
	breathForMinutes?: number;
	everyMinutes?: number;
	sound?: boolean;
	inhaleSeconds?: number;
	holdInhaleSeconds?: number;
	exhaleSeconds?: number;
	holdExhaleSeconds?: number;
}

export class BreathState {
	private timerId?: NodeJS.Timeout;
	private breathingAnimator: BreathingAnimator = new BreathingAnimator();
	private reminderAnimator: ReminderAnimator = new ReminderAnimator();

	private soundPlayer: SoundPlayer = new SoundPlayer(resolve(dirname(fileURLToPath(import.meta.url)), '../sounds/gong.wav'))
	private tikSoundPlayer: SoundPlayer = new SoundPlayer(resolve(dirname(fileURLToPath(import.meta.url)), '../sounds/tick.wav'))
	private completionChimePlayer: SoundPlayer = new SoundPlayer(resolve(dirname(fileURLToPath(import.meta.url)), '../sounds/completion-chime.wav'))

	private stop(ev: WillAppearEvent<BreathSettings> | DidReceiveSettingsEvent<BreathSettings> | KeyDownEvent<BreathSettings>): void {
		if (this.timerId) {
			clearInterval(this.timerId);
			this.timerId = undefined;
		}
		this.reminderAnimator.stop(ev);
		this.breathingAnimator.stop(ev);
	}

	startReminderTimer(
		ev: WillAppearEvent<BreathSettings> | DidReceiveSettingsEvent<BreathSettings> | KeyDownEvent<BreathSettings>,
		settings: Required<BreathSettings>,
	): void {
		this.stop(ev);

		const timerId = setTimeout(async () => {
			await this.soundPlayer.playSound(settings.sound);
			this.reminderAnimator.start(ev);
		}, settings.everyMinutes * 60 * 1000);

		this.timerId = timerId;
	}

	startBreathingTimer(
		ev: KeyDownEvent<BreathSettings>,
		settings: Required<BreathSettings>
	): void {
		this.stop(ev);

		const breathingSeconds = settings.breathForMinutes * 60;
		this.breathingAnimator.start(ev, breathingSeconds, async () => {
			// Play tik sound after each cycle completes
			await this.tikSoundPlayer.playSound(settings.sound);
		});

		const timerId = setTimeout(async () => {
			// Play completion chime when all breathing cycles are done
			await this.completionChimePlayer.playSound(settings.sound);

			this.stop(ev);

			// Restart the reminder timer after breathing session completes
			this.startReminderTimer(ev, settings);
		}, breathingSeconds * 1000);

		this.timerId = timerId;
	}

	static getDefaultSettings(): Required<BreathSettings> {
		return {
			breathForMinutes: 1,
			everyMinutes: 60,
			sound: true,
			inhaleSeconds: 4,
			holdInhaleSeconds: 2,
			exhaleSeconds: 4,
			holdExhaleSeconds: 2
		};
	}

	static extractSettings(settings?: BreathSettings): Required<BreathSettings> {
		const defaults = BreathState.getDefaultSettings();
		return {
			breathForMinutes: settings?.breathForMinutes ?? defaults.breathForMinutes,
			everyMinutes: settings?.everyMinutes ?? defaults.everyMinutes,
			sound: settings?.sound ?? defaults.sound,
			inhaleSeconds: settings?.inhaleSeconds ?? defaults.inhaleSeconds,
			holdInhaleSeconds: settings?.holdInhaleSeconds ?? defaults.holdInhaleSeconds,
			exhaleSeconds: settings?.exhaleSeconds ?? defaults.exhaleSeconds,
			holdExhaleSeconds: settings?.holdExhaleSeconds ?? defaults.holdExhaleSeconds
		};
	}
}