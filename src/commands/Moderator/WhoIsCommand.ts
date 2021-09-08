import { CommandInteraction, GuildMember } from 'discord.js';
import BaseCommand from '../../utils/structures/BaseModels/BaseCommand';
import DiscordClient from '../../client/client';
import { AccessLevel } from '../../utils/structures/Enums/AccessLevel';
import { Colors } from '../../utils/helpers/Colors';
import { GetMemberFromInteraction } from '../../utils/helpers/UserHelpers';
import { GetMemberFromID } from '../../utils/helpers/GuildHelpers';

export default class WhoIsCommand extends BaseCommand {
    constructor() {
        super('whois', 'Moderator', AccessLevel.Staff);
        this.description = 'Sends the real name of a user';
        this.options = [
            {
                name: 'user',
                description: 'User to lookup',
                type: 'USER',
                required: true,
            },
        ];
    }

    async run(client: DiscordClient, interaction: CommandInteraction, args: string[]): Promise<void> {
        await interaction.deferReply({
            ephemeral: true,
        });

        const user = interaction.options.getMember('user', true) as GuildMember;

        if (user.user.bot) {
            await interaction.followUp({
                embeds: [
                    {
                        color: Colors.Blue,
                        title: 'Results',
                        description: `Bots don't have real names`,
                    },
                ],
            });
            return;
        }

        const member = await GetMemberFromID(client, interaction.guild, user.id);
        await interaction.followUp({
            embeds: [
                {
                    color: Colors.Blue,
                    title: 'Results',
                    description: `${member.guildMember.user.tag} is ${member.firstName} ${member.lastName}`,
                },
            ],
        });
    }
}
