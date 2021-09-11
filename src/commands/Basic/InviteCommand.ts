import { CommandInteraction } from 'discord.js';
import BaseCommand from '../../utils/structures/BaseModels/BaseCommand';
import DiscordClient from '../../client/client';
import { AccessLevel } from '../../utils/structures/Enums/AccessLevel';
export default class InviteCommand extends BaseCommand {
    constructor() {
        super('invite', 'Basic', AccessLevel.Enrolled);
        this.description = 'Generate an invite link to the server';
    }

    async run(client: DiscordClient, interaction: CommandInteraction, args: string[]): Promise<void> {
        await interaction.deferReply({
            ephemeral: true,
        });

        const guild = interaction.guild;

        const invite = await guild.invites.create(client.config.welcomeId);
        await interaction.followUp({
            content: `Invite link: ${invite}`,
        });
    }
}
