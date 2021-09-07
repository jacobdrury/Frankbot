import { CommandInteraction, Message } from 'discord.js';
import BaseCommand from '../../utils/structures/BaseModels/BaseCommand';
import DiscordClient from '../../client/client';

export default class TestCommand extends BaseCommand {
    constructor() {
        super('test', 'test');
    }

    async run(client: DiscordClient, interaction: CommandInteraction, args: string[]): Promise<void> {
        await interaction.reply({
            content: 'Pong',
        });
    }
}
