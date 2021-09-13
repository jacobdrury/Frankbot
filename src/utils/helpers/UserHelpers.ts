import { ButtonInteraction, CommandInteraction, GuildMember, Message } from 'discord.js';
import DiscordClient from '../../client/client';
import Guild from '../../database/models/Guilds';
import User, { UserSchemaInterface } from '../../database/models/Users';
import { AccessLevel } from '../structures/Enums/AccessLevel';
import { VerificationStatus } from '../structures/Enums/VerificationStatus';
import Member from '../structures/Member';

export const CreateUser = async (guildMember: GuildMember, modifiers = {}) => {
    let guild = await Guild.findOne({ guildId: guildMember.guild.id });

    if (!guild) {
        guild = await Guild.create({
            guildId: guildMember.guild.id,
            name: guildMember.guild.name,
        });
    }

    return await User.create({
        discordId: guildMember.id,
        username: guildMember.user.username,
        guildId: guildMember.guild.id,
        ...modifiers,
    });
};

export const GetMemberFromMessage = async (client: DiscordClient, message: Message): Promise<Member | null> => {
    const guildMember = message.member;
    if (guildMember == null) return null;
    let dbGuildMember = await User.findOne({
        inServer: true,
        discordId: guildMember.id,
        guildId: message.guild.id,
    });

    // If user is not cached, check DB for user
    if (!dbGuildMember) {
        const isOwner: boolean = guildMember.guild.ownerId == guildMember.user.id;
        dbGuildMember = await CreateUser(guildMember, {
            accessLevel: isOwner ? AccessLevel.Owner : null,
            verificationStatus: isOwner ? VerificationStatus.Approved : null,
        });
    }

    return new Member(guildMember, dbGuildMember);
};

export const GetMemberFromInteraction = async (
    client: DiscordClient,
    interaction: CommandInteraction | ButtonInteraction
): Promise<Member | null> => {
    const guildMember = interaction.member as GuildMember;
    let dbGuildMember = await User.findOne({
        inServer: true,
        discordId: guildMember.id,
        guildId: interaction.guild.id,
    });

    // If user is not cached, check DB for user
    if (!dbGuildMember) {
        const isOwner: boolean = guildMember.guild.ownerId == guildMember.user.id;
        dbGuildMember = await CreateUser(guildMember, {
            accessLevel: isOwner ? AccessLevel.Owner : null,
            verificationStatus: isOwner ? VerificationStatus.Approved : null,
        });
    }

    return new Member(guildMember, dbGuildMember);
};
