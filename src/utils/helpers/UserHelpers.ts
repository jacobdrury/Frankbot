import { ButtonInteraction, CommandInteraction, GuildMember, Message } from 'discord.js';
import DiscordClient from '../../client/client';
import Guild from '../../database/models/Guilds';
import User from '../../database/models/Users';
import { AccessLevel } from '../structures/Enums/AccessLevel';
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
    let dbGuildMember = client.staffMembers.get(guildMember.id) ?? client.guildMembers.get(guildMember.id);

    // If user is not cached, check DB for user
    if (!dbGuildMember) {
        const search = await User.findOne({ inServer: true, discordId: guildMember.id });
        if (!search) {
            message.channel.send({
                content: 'Something went wrong',
                reply: {
                    messageReference: message,
                },
            });
            return null;
        }

        if (search.accessLevel >= AccessLevel.Staff) client.staffMembers.set(search.discordId, search);
        else client.guildMembers.set(search.discordId, search);

        dbGuildMember = search;
    }

    return new Member(guildMember, dbGuildMember);
};

export const GetMemberFromInteraction = async (
    client: DiscordClient,
    interaction: CommandInteraction | ButtonInteraction
): Promise<Member | null> => {
    const guildMember = interaction.member as GuildMember;
    let dbGuildMember = client.staffMembers.get(guildMember.id) ?? client.guildMembers.get(guildMember.id);

    // If user is not cached, check DB for user
    if (!dbGuildMember) {
        const search = await User.findOne({ inServer: true, discordId: guildMember.id });
        if (!search) {
            await interaction.followUp('Something went wrong');
            return null;
        }

        if (search.accessLevel >= AccessLevel.Staff) client.staffMembers.set(search.discordId, search);
        else client.guildMembers.set(search.discordId, search);

        dbGuildMember = search;
    }

    return new Member(guildMember, dbGuildMember);
};
