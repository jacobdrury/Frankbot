import BaseEvent from '../../utils/structures/BaseModels/BaseEvent';
import DiscordClient from '../../client/client';
import Member from '../../utils/structures/Member';
import VerificationResponse from '../../utils/structures/VerificationResponse';
import { ButtonInteraction, MessageActionRow, MessageButton, TextChannel } from 'discord.js';
import { Colors } from '../../utils/helpers/Colors';
import { VerificationStatus } from '../../utils/structures/Enums/VerificationStatus';
import { GetMemberFromInteraction } from '../../utils/helpers/UserHelpers';
import { GetMemberFromID } from '../../utils/helpers/GuildHelpers';
import { userMention } from '@discordjs/builders';

export default class OnVerificationButtonEvent extends BaseEvent {
    constructor() {
        super('OnVerificationButtonEvent');
    }

    async run(client: DiscordClient, interaction: ButtonInteraction, status: VerificationStatus) {
        const [embed] = interaction.message.embeds;
        const userTag = embed.fields.filter((field) => field.name == 'User Tag')[0].value;
        const userId = userTag.replace(/<@|>/g, '');

        client.refreshUserCache(userId);
        const member = await GetMemberFromID(client, interaction.guild, userId);

        switch (status) {
            case VerificationStatus.Approved:
                this.verify(interaction, member);
                break;
            case VerificationStatus.Denied:
                this.deny(interaction, member);
                break;
        }

        client.guildMembers.set(member.guildMember.id, member);
    }

    async verify(interaction: ButtonInteraction, member: Member) {
        const verifiedRole = await interaction.guild.roles.fetch('668602593022443520');
        await member.guildMember.roles.add(verifiedRole);
        await member.verify();

        try {
            await member.guildMember.send({
                embeds: [
                    {
                        color: Colors.Blue,
                        title: 'You have been approved!',
                        description: `A staff member has approved your join request!\nYou have been given the ${member.major} role!`,
                        timestamp: Date.now(),
                    },
                ],
            });
        } catch (ex) {}

        await interaction.update({
            embeds: [
                {
                    title: 'Verification Approved',
                    color: Colors.Blue,
                    fields: [
                        ...interaction.message.embeds[0].fields,
                        { name: 'Approved By', value: `${userMention(interaction.member.user.id)}` },
                    ],
                    timestamp: Date.now(),
                },
            ],
            components: [],
        });

        await interaction.followUp({
            ephemeral: true,
            content: `${member.guildMember.user.tag} has been approved!`,
        });
    }

    async deny(interaction: ButtonInteraction, member: Member) {
        try {
            await member.guildMember.send({
                embeds: [
                    {
                        color: Colors.Red,
                        title: 'You have been denied',
                        description: `A staff member has denied your join request.\nIf you believe this is a mistake please reach out to a staff member`,
                        timestamp: Date.now(),
                    },
                ],
            });
        } catch (ex) {}

        await member.guildMember.kick(
            `User was denied entry by ${interaction.member.user.username}#${interaction.member.user.discriminator}`
        );

        await member.setVerificationStatus(VerificationStatus.Denied);

        const interactionEmbed = interaction.message.embeds[0];

        await interaction.update({
            embeds: [
                {
                    title: 'Verification Denied',
                    color: Colors.Red,
                    fields: [
                        ...interactionEmbed.fields,
                        { name: 'Denied By', value: `${userMention(interaction.member.user.id)}` },
                    ],
                    image: interactionEmbed.thumbnail,
                    timestamp: Date.now(),
                },
            ],
            components: [],
        });

        await interaction.followUp({
            ephemeral: true,
            content: `${member.guildMember.user.tag} has been denied and kicked from the server`,
        });
    }
}
