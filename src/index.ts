import { registerCommands, registerEvents } from './utils/registry';
import DiscordClient from './client/client';
import { Intents } from 'discord.js';
import { connectDatabase } from './database/Mongoose';
import { Config } from './utils/structures/configSchema';

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

const config: Config = {
    name: 'Frankbot',
    language: 'typescript',
    manager: 'npm',
    token: process.env.token,
    prefix: process.env.prefix,
    MONGO_URI: process.env.MONGO_URI,
    LogChannelId: process.env.LogChannelId,
    enrolledRoleId: process.env.enrolledRoleId,
    CMPSRoleId: process.env.CMPSRoleId,
    INFXRoleId: process.env.INFXRoleId,
    unverifiedRoleId: process.env.unverifiedRoleId,
    CMPSAlumniID: process.env.CMPSAlumniID,
    INFXAlumniId: process.env.INFXAlumniId,
    welcomeId: process.env.welcomeId,
    modId: process.env.modId,
    adminId: process.env.adminId,
    retiredId: process.env.retiredId,
    userVerificationRole: process.env.userVerificationRole,
    alumniId: process.env.alumniId,
};

const client = new DiscordClient(config, {
    partials: ['MESSAGE', 'REACTION'],
    allowedMentions: { parse: ['users', 'roles'], repliedUser: true },
    intents,
});

(async () => {
    client.prefix = config.prefix || client.prefix;

    await registerCommands(client, '../commands');
    await registerEvents(client, '../events');

    await connectDatabase(config.MONGO_URI);

    await client.login(config.token);
})();

export default client;
