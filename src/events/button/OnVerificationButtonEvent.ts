import BaseEvent from '../../utils/structures/BaseModels/BaseEvent';
import DiscordClient from '../../client/client';
import Member from '../../utils/structures/Member';
import { ButtonInteraction, Role } from 'discord.js';
import { Colors } from '../../utils/helpers/Colors';
import { VerificationStatus } from '../../utils/structures/Enums/VerificationStatus';
import { GetMemberFromID } from '../../utils/helpers/GuildHelpers';
import { userMention } from '@discordjs/builders';
import { Majors } from '../../utils/structures/Enums/Major';

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
                this.verify(client, interaction, member);
                break;
            case VerificationStatus.Denied:
                this.deny(interaction, member);
                break;
        }

        client.guildMembers.set(member.guildMember.id, member);
    }

    async verify(client: DiscordClient, interaction: ButtonInteraction, member: Member) {
        const rolesToAdd = [];

        if (!member.guildMember.roles.cache.has(client.config.enrolledRoleId))
            rolesToAdd.push(client.config.enrolledRoleId);

        if (member.major == Majors.CMPS && !member.guildMember.roles.cache.has(client.config.CMPSRoleId))
            rolesToAdd.push(client.config.CMPSRoleId);

        if (member.major == Majors.INFX && !member.guildMember.roles.cache.has(client.config.INFXRoleId))
            rolesToAdd.push(client.config.INFXRoleId);

        await member.guildMember.roles.add(rolesToAdd);

        const isAlumni: boolean = member.guildMember.roles.cache.some((role: Role) =>
            role.name.toLowerCase().includes('alumni')
        );

        if (member.guildMember.roles.cache.has(client.config.unverifiedRoleId))
            await member.guildMember.roles.remove(client.config.unverifiedRoleId);

        await member.verify();

        if (isAlumni) member.setAlumni(client.config);

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
                    thumbnail: {
                        url: member.guildMember.user.avatarURL({ dynamic: true }),
                    },
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
                    thumbnail: {
                        url: member.guildMember.user.avatarURL({ dynamic: true }),
                    },
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
