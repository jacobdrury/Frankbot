import { CommandInteraction } from 'discord.js';
import BaseCommand from '../../utils/structures/BaseModels/BaseCommand';
import DiscordClient from '../../client/client';
import { AccessLevel } from '../../utils/structures/Enums/AccessLevel';
import { Colors } from '../../utils/helpers/Colors';
import { GetMemberFromInteraction } from '../../utils/helpers/UserHelpers';
import Users, { UserSchemaInterface } from '../../database/models/Users';

export default class WhoTfIsCommand extends BaseCommand {
    constructor() {
        super('whotfis', 'Moderator', AccessLevel.Staff);
        this.description = 'Sends a list of the users matching the search';
        this.options = [
            {
                name: 'firstname',
                description: 'First name to lookup',
                type: 'STRING',
                required: true,
            },
            {
                name: 'lastname',
                description: 'Last name to lookup',
                type: 'STRING',
            },
        ];
    }

    async run(client: DiscordClient, interaction: CommandInteraction, args: string[]): Promise<void> {
        await interaction.deferReply({
            ephemeral: true,
        });

        const firstName = interaction.options.getString('firstname', true);
        const lastName = interaction.options.getString('lastname');

        let users: Array<UserSchemaInterface> = [...client.guildMembers.values(), ...client.staffMembers.values()];

        users = users.filter((u) => u.firstName?.toLowerCase().includes(firstName.toLowerCase()));

        if (lastName) {
            users = users.filter((u) => u?.lastName.includes(lastName));
        }

        let names = '';
        let handles = '';

        if (users.length) {
            users.forEach((u) => {
                names += `\n${u.firstName} ${u.lastName}`;
                handles += `\n${u.username}`;
            });

            await interaction.followUp({
                embeds: [
                    {
                        color: Colors.Blue,
                        title: 'Results',
                        fields: [
                            { name: 'Student Name', value: names, inline: true },
                            { name: 'Discord Handle', value: handles, inline: true },
                        ],
                    },
                ],
            });
        }

        await interaction.followUp({
            embeds: [
                {
                    color: Colors.Blue,
                    title: 'Results',
                    description: `Could not find any users named ${firstName} ${lastName ?? ''}`,
                },
            ],
        });
    }
}
