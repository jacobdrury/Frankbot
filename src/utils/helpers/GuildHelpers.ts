import { Message, GuildMember, UserResolvable, Guild } from 'discord.js';
import DiscordClient from '../../client/client';
import Member from '../structures/Member';
import User from '../../database/models/Users';
import { AccessLevel } from '../structures/Enums/AccessLevel';
import { CreateUser } from './UserHelpers';
import { VerificationStatus } from '../structures/Enums/VerificationStatus';

export const resolveMemberFromMessage = async (message: Message, search: any): Promise<GuildMember | null> => {
    let guildMember: GuildMember = null;

    if (message.mentions.members.size > 0) guildMember = message.mentions.members.first();
    else if (!isNaN(Number(search)) && search.length === 18)
        guildMember = await message.guild.members.fetch(search as UserResolvable);
    return guildMember;
};

export const GetMemberFromID = async (client: DiscordClient, guild: Guild, id: string): Promise<Member> => {
    const guildMember = await guild.members.fetch(id);
    let dbGuildMember = await User.findOne({ inServer: true, discordId: guildMember.id, guildId: guild.id });
    if (!dbGuildMember) {
        const isOwner: boolean = guildMember.guild.ownerId == guildMember.user.id;
        dbGuildMember = await CreateUser(guildMember, {
            accessLevel: isOwner ? AccessLevel.Owner : null,
            verificationStatus: isOwner ? VerificationStatus.Approved : null,
        });
    }

    return new Member(guildMember, dbGuildMember);
};
