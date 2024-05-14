import dotenv from 'dotenv';
import { registerCommands, registerEvents } from './utils/registry';
import DiscordClient from './client/client';
import { Intents } from 'discord.js';
import { connectDatabase } from './database/Mongoose';
import { Config } from './utils/structures/configSchema';

dotenv.config();

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
    discordToken: process.env.DISCORD_TOKEN,
    prefix: process.env.PREFIX,
    mongoUri: process.env.MONGO_URI,
    logChannelId: process.env.LOG_CHANNEL_ID,
    enrolledRoleId: process.env.ENROLLED_ROLE_ID,
    cmpsRoleId: process.env.CMPS_ROLE_ID,
    infxRoleId: process.env.INFX_ROLE_ID,
    unverifiedRoleId: process.env.UNVERIFIED_ROLE_ID,
    cmpsAlumniID: process.env.CMPS_ALUMNI_ID,
    infoAlumniId: process.env.INFX_ALUMNI_ID,
    welcomeId: process.env.WELCOME_ID,
    modId: process.env.MOD_ID,
    adminId: process.env.ADMIN_ID,
    retiredId: process.env.RETIRED_ID,
    userVerificationRole: process.env.USER_VERIFICATION_ROLE,
    alumniId: process.env.ALUMNI_ID,
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

    await connectDatabase(config.mongoUri);

    await client.login(config.discordToken);
})();

export default client;
