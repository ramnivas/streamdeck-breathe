import streamDeck, { LogLevel } from "@elgato/streamdeck";

import { Breathe } from "./actions/breathe";

streamDeck.logger.setLevel(LogLevel.TRACE);
streamDeck.actions.registerAction(new Breathe());
streamDeck.connect();
