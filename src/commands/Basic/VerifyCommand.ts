import { CommandInteraction } from 'discord.js';
import BaseCommand from '../../utils/structures/BaseModels/BaseCommand';
import DiscordClient from '../../client/client';
import { AccessLevel } from '../../utils/structures/Enums/AccessLevel';
import { registerSlashCommands } from '../../utils/registry';
import { Colors } from '../../utils/helpers/Colors';
import { Majors } from '../../utils/structures/Enums/Major';

export default class VerifyCommand extends BaseCommand {
    constructor() {
        super('verify', 'Basic', AccessLevel.Unenrolled);
        this.description = 'Verify a user';
        this.options = [
            {
                name: 'major',
                type: 'STRING',
                description: 'Your field of study',
                required: true,
                choices: [
                    { name: Majors.CMPS, value: Majors.CMPS },
                    { name: Majors.INFX, value: Majors.INFX },
                ],
            },
            {
                name: 'firstname',
                type: 'STRING',
                description: 'First Name',
                required: true,
            },
            {
                name: 'lastname',
                type: 'STRING',
                description: 'Last Name',
                required: true,
            },
            {
                name: 'cnumber',
                type: 'STRING',
                description: 'C Number',
                required: true,
            },
        ];
    }

    async run(client: DiscordClient, interaction: CommandInteraction, args: string[]): Promise<void> {
        await interaction.deferReply({
            ephemeral: true,
        });

        const [major, firstName, lastName, cNumber] = args;
        await interaction.followUp({
            embeds: [
                {
                    title: 'Verification Received',
                    color: Colors.Blue,
                    fields: [
                        { name: 'Name', value: `${firstName} ${lastName}`, inline: true },
                        { name: 'C Number', value: cNumber, inline: true },
                        { name: 'Major', value: major, inline: true },
                    ],
                    description: `Your information will be sent to an admin for approval.`,
                },
            ],
        });
    }
}
