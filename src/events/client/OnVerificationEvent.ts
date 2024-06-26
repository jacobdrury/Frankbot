import BaseEvent from '../../utils/structures/BaseModels/BaseEvent';
import DiscordClient from '../../client/client';
import Member from '../../utils/structures/Member';
import VerificationResponse from '../../utils/structures/VerificationResponse';
import { MessageActionRow, MessageButton, TextChannel } from 'discord.js';
import { Colors } from '../../utils/helpers/Colors';
import { roleMention, userMention } from '@discordjs/builders';

export default class InteractionCreateEvent extends BaseEvent {
    constructor() {
        super('OnVerification');
    }

    async run(client: DiscordClient, member: Member, response: VerificationResponse) {
        const logChannel = (await member.guildMember.guild.channels.fetch(client.config.logChannelId)) as TextChannel;

        const row = new MessageActionRow().addComponents(
            new MessageButton().setCustomId('denied').setLabel('Deny').setStyle('DANGER'),
            new MessageButton().setCustomId('approved').setLabel('Approve').setStyle('PRIMARY').setEmoji('✅')
        );

        logChannel.send({
            content: roleMention(client.config.userVerificationRole),
            embeds: [
                {
                    title: 'Verification Received',
                    color: Colors.Orange,
                    fields: [
                        {
                            name: 'User',
                            value: `${member.guildMember.displayName}`,
                        },
                        {
                            name: 'User Tag',
                            value: `${userMention(member.guildMember.id)}`,
                        },
                        { name: 'Name', value: `${response.firstName} ${response.lastName}`, inline: true },
                        { name: 'C Number', value: response.cNumber, inline: true },
                        { name: 'Major', value: response.major, inline: true },
                    ],
                    thumbnail: {
                        url: member.guildMember.user.avatarURL({ dynamic: true }),
                    },
                    description: `User verification required.`,
                },
            ],
            components: [row],
        });
    }
}
