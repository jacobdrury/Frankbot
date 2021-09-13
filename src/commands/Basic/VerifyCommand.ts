import { CommandInteraction } from 'discord.js';
import BaseCommand from '../../utils/structures/BaseModels/BaseCommand';
import DiscordClient from '../../client/client';
import { AccessLevel } from '../../utils/structures/Enums/AccessLevel';
import { Colors } from '../../utils/helpers/Colors';
import { Majors } from '../../utils/structures/Enums/Major';
import { GetMemberFromInteraction } from '../../utils/helpers/UserHelpers';
import VerificationResponse from '../../utils/structures/VerificationResponse';
import { VerificationStatus } from '../../utils/structures/Enums/VerificationStatus';

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

        const response = new VerificationResponse(firstName, lastName, cNumber, major as Majors);

        const member = await GetMemberFromInteraction(client, interaction);

        if (member.verificationStatus == VerificationStatus.Pending) {
            await interaction.followUp({
                ephemeral: true,
                content:
                    'You currently have a pending verification request, please wait for a Staff member to review your request.',
            });
            return;
        }

        if (member.verificationStatus == VerificationStatus.Approved) {
            await interaction.followUp({
                ephemeral: true,
                content: 'You have already verified! If you need assistance please reach out to a staff member!',
            });
            return;
        }

        await member.setVerificationStatus(VerificationStatus.Pending);

        await member.setPersonalInfo(response);

        await interaction.followUp({
            embeds: [
                {
                    title: 'Verification Received',
                    color: Colors.Blue,
                    fields: [
                        { name: 'Name', value: `${response.firstName} ${response.lastName}`, inline: true },
                        { name: 'C Number', value: response.cNumber, inline: true },
                        { name: 'Major', value: response.major, inline: true },
                    ],
                    description: `Your information will be sent to an admin for approval.`,
                },
            ],
        });

        client.emit('OnVerification', member, response);
    }
}
