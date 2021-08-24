
import { registerCommands, registerEvents } from './utils/registry';
import config from '../slappey.json';
import DiscordClient from './client/client';
import { Intents } from 'discord.js';

const flags = Intents.FLAGS;
const intents = new Intents().add(
  flags.GUILDS,
  flags.GUILD_MEMBERS,
  flags.GUILD_BANS,
  flags.GUILD_EMOJIS_AND_STICKERS,
  flags.GUILD_INTEGRATIONS,
  flags.GUILD_WEBHOOKS,
  flags.GUILD_INVITES,
  flags.GUILD_VOICE_STATES,
  flags.GUILD_PRESENCES,
  flags.GUILD_MESSAGES,
  flags.GUILD_MESSAGE_REACTIONS,
  flags.GUILD_MESSAGE_TYPING,
  flags.DIRECT_MESSAGES,
  flags.GUILD_MESSAGE_REACTIONS,
  flags.GUILD_MESSAGE_TYPING
);

const client = new DiscordClient({
  partials: ['MESSAGE', 'REACTION'],
  allowedMentions: { parse: ['users', 'roles'], repliedUser: true },
  intents,
});

(async () => {
  client.prefix = config.prefix || client.prefix;
  await registerCommands(client, '../commands');
  await registerEvents(client, '../events');
  await client.login(config.token);
})();

