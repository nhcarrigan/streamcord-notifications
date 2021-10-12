import { RewriteFrames } from "@sentry/integrations";
import * as Sentry from "@sentry/node";
import { Client } from "discord.js";

import { IntentOptions } from "./config/IntentOptions";
import { onInteraction } from "./events/onInteraction";
import { onReady } from "./events/onReady";
import { Bot } from "./interfaces/Bot";
import { loadCommands } from "./utils/loadCommands";
import { logHandler } from "./utils/logHandler";
import { registerCommands } from "./utils/registerCommands";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  integrations: [
    new RewriteFrames({
      root: global.__dirname,
    }),
  ],
});

(async () => {
  const BOT = new Client({ intents: IntentOptions }) as Bot;

  const token = process.env.DISCORD_TOKEN;
  const botId = process.env.BOT_ID;
  const homeId = process.env.HOME_ID;

  if (!token || !botId || !homeId) {
    logHandler.log("error", "Missing environment variables!");
    return;
  }

  BOT.token = token;
  BOT.botId = botId;
  BOT.homeId = homeId;
  BOT.notifications = [];
  BOT.intervals = [];

  BOT.commands = await loadCommands();

  if (!BOT.commands.length) {
    logHandler.log("error", "No commands found!");
    return;
  }

  await registerCommands(BOT);

  BOT.on("ready", async () => await onReady(BOT));

  BOT.on(
    "interactionCreate",
    async (interaction) => await onInteraction(BOT, interaction)
  );

  await BOT.login(token);
})();
