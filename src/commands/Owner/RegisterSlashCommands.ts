import { CommandInteraction, Message } from 'discord.js';
import BaseCommand from '../../utils/structures/BaseModels/BaseCommand';
import DiscordClient from '../../client/client';
import { AccessLevel } from '../../utils/structures/Enums/AccessLevel';
import { registerSlashCommands } from '../../utils/registry';
import { Colors } from '../../utils/helpers/Colors';

export default class RegisterSlashCommands extends BaseCommand {
    constructor() {
        super('register', 'Owner', AccessLevel.Owner);
        this.description = 'Manually Register all the Slash commands';
        this.registerIgnore = true;
    }

    async run(client: DiscordClient, interaction: CommandInteraction, args: string[]): Promise<void> {
        await interaction.deferReply({
            ephemeral: true,
        });

        let count = await registerSlashCommands(client, interaction.guild, '../../commands');
        await interaction.followUp({
            embeds: [
                {
                    title: 'Slash Commands Registered',
                    color: Colors.Blue,
                    description: `Successfully registered ${count} commands`,
                },
            ],
        });
    }
}
