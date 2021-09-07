import { Message, GuildMember, UserResolvable } from 'discord.js';

export const resolveMemberFromMessage = async (message: Message, search: any): Promise<GuildMember | null> => {
    let guildMember: GuildMember = null;

    if (message.mentions.members.size > 0) guildMember = message.mentions.members.first();
    else if (!isNaN(Number(search)) && search.length === 18)
        guildMember = await message.guild.members.fetch(search as UserResolvable);
    return guildMember;
};
