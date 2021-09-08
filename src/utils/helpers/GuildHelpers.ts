import { Message, GuildMember, UserResolvable, Guild } from 'discord.js';
import DiscordClient from '../../client/client';
import Member from '../structures/Member';
import User from '../../database/models/Users';
import { AccessLevel } from '../structures/Enums/AccessLevel';

export const resolveMemberFromMessage = async (message: Message, search: any): Promise<GuildMember | null> => {
    let guildMember: GuildMember = null;

    if (message.mentions.members.size > 0) guildMember = message.mentions.members.first();
    else if (!isNaN(Number(search)) && search.length === 18)
        guildMember = await message.guild.members.fetch(search as UserResolvable);
    return guildMember;
};

export const GetMemberFromID = async (client: DiscordClient, guild: Guild, id: string): Promise<Member> => {
    const guildMember = await guild.members.fetch(id);
    let dbGuildMember = client.staffMembers.get(guildMember.id) ?? client.guildMembers.get(guildMember.id);

    // If user is not cached, check DB for user
    if (!dbGuildMember) {
        const search = await User.findOne({ inServer: true, discordId: guildMember.id });
        if (!search) {
            return;
        }

        if (search.accessLevel >= AccessLevel.Staff) client.staffMembers.set(search.discordId, search);
        else client.guildMembers.set(search.discordId, search);

        dbGuildMember = search;
    }

    return new Member(guildMember, dbGuildMember);
};
