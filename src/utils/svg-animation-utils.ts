// Import the SVG as a string at build time
import logoSvg from '@imgs/logo.svg';

/**
 * Generates breathing circle SVG with animated circles and timer display
 */
export function generateBreathingCircleSVG(phase: number, phaseType: string, timeString: string): string {
	let radius: number;

	switch (phaseType) {
		case 'inhale':
			radius = 30 + (phase * 25);
			break;
		case 'hold-inhale':
			radius = 55;
			break;
		case 'exhale':
			radius = 55 - (phase * 25);
			break;
		case 'hold-exhale':
			radius = 30;
			break;
		default:
			radius = 30;
	}

	const opacity = 0.7;

	return `
	<svg width="144" height="144" viewBox="0 0 144 144" xmlns="http://www.w3.org/2000/svg">
		<rect width="144" height="144" fill="#1e1e1e"/>
		<circle cx="72" cy="72" r="${radius}" fill="none" stroke="#4a9eff" stroke-width="3" opacity="${opacity}"/>
		<circle cx="72" cy="72" r="${radius - 10}" fill="none" stroke="#6bb6ff" stroke-width="2" opacity="${opacity * 0.8}"/>
		<text x="72" y="82" text-anchor="middle" fill="white" font-family="Arial" font-size="36" font-weight="bold">${timeString}</text>
	</svg>`;
}

/**
 * Generates the Buddha logo SVG with optional colored background for reminder blinking
 */
export function generateReminderSVG(showBackground: boolean = true): string {
	const backgroundColor = showBackground ? '#0000ff' : '#1a1a1a';

	// Modify the background color in the imported SVG
	return logoSvg
		.replace(/fill="#1a1a1a"/, `fill="${backgroundColor}"`);
}