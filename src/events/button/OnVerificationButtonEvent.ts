import BaseEvent from '../../utils/structures/BaseModels/BaseEvent';
import DiscordClient from '../../client/client';
import Member from '../../utils/structures/Member';
import { ButtonInteraction, Role } from 'discord.js';
import { Colors } from '../../utils/helpers/Colors';
import { VerificationStatus } from '../../utils/structures/Enums/VerificationStatus';
import { GetMemberFromID } from '../../utils/helpers/GuildHelpers';
import { userMention } from '@discordjs/builders';
import { Majors } from '../../utils/structures/Enums/Major';
import { AccessLevel } from '../../utils/structures/Enums/AccessLevel';

export default class OnVerificationButtonEvent extends BaseEvent {
    constructor() {
        super('OnVerificationButtonEvent');
    }

    async run(client: DiscordClient, interaction: ButtonInteraction, status: VerificationStatus) {
        const [embed] = interaction.message.embeds;
        const userTag = embed.fields.filter((field) => field.name == 'User Tag')[0].value;
        const userId = userTag.replace(/<@|>/g, '');

        const member = await GetMemberFromID(client, interaction.guild, userId);

        switch (status) {
            case VerificationStatus.Approved:
                this.verify(client, interaction, member);
                break;
            case VerificationStatus.Denied:
                this.deny(interaction, member);
                break;
        }
    }

    async verify(client: DiscordClient, interaction: ButtonInteraction, member: Member) {
        const rolesToAdd = [client.config.enrolledRoleId];
        let accessLevel: AccessLevel = AccessLevel.Enrolled;

        if (member.guildMember.roles.cache.has(client.config.adminId)) {
            rolesToAdd.push(client.config.adminId, client.config.modId);
            accessLevel = AccessLevel.Admin;
        } else if (member.guildMember.roles.cache.has(client.config.modId)) {
            rolesToAdd.push(client.config.modId);
            accessLevel = AccessLevel.Moderator;
        } else if (member.guildMember.roles.cache.has(client.config.retiredId)) {
            rolesToAdd.push(client.config.retiredId);
            accessLevel = AccessLevel.Retired;
        }

        const isAlumni: boolean = member.guildMember.roles.cache.some((role: Role) =>
            role.name.toLowerCase().includes('alumni')
        );

        if (member.major == Majors.CMPS) {
            rolesToAdd.push(client.config.CMPSRoleId);
            if (isAlumni) {
                rolesToAdd.push(client.config.CMPSAlumniID);
                accessLevel = AccessLevel.Alumni;
            }
        } else if (member.major == Majors.INFX) {
            rolesToAdd.push(client.config.INFXRoleId);
            if (isAlumni) {
                rolesToAdd.push(client.config.INFXAlumniId);
                accessLevel = AccessLevel.Alumni;
            }
        }

        await member.guildMember.roles.set(rolesToAdd);

        await member.verify(accessLevel);

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
    }
}
