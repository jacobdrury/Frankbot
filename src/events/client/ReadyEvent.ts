import BaseEvent from '../../utils/structures/BaseModels/BaseEvent';
import DiscordClient from '../../client/client';
import { ApplicationCommandData } from 'discord.js';

export default class ReadyEvent extends BaseEvent {
    constructor() {
        super('ready');
    }

    async run(client: DiscordClient) {
        console.log('Bot has logged in.');
        await client.initialize();
        client.user.setPresence({
            status: 'dnd',
            activities: [{ type: 'WATCHING', name: 'me get developed!' }],
        });

        let cmd: ApplicationCommandData = {
            name: 'register',
            description: 'Manually Register all the Slash commands',
        };

        // await client.application.commands.create(cmd);
    }
}
