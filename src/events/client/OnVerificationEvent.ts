import BaseEvent from '../../utils/structures/BaseModels/BaseEvent';
import DiscordClient from '../../client/client';
import Member from '../../utils/structures/Member';
import VerificationResponse from '../../utils/structures/VerificationResponse';
import { MessageActionRow, MessageButton, TextChannel } from 'discord.js';
import { Colors } from '../../utils/helpers/Colors';

export default class InteractionCreateEvent extends BaseEvent {
    constructor() {
        super('OnVerification');
    }

    async run(client: DiscordClient, member: Member, response: VerificationResponse) {
        const logChannel = (await member.guildMember.guild.channels.fetch('781254715677081660')) as TextChannel;

        const row = new MessageActionRow().addComponents(
            new MessageButton().setCustomId('approve').setLabel('Approve').setStyle('PRIMARY').setEmoji('✅'),
            new MessageButton().setCustomId('deny').setLabel('Deny').setStyle('DANGER').setEmoji('❌')
        );

        logChannel.send({
            embeds: [
                {
                    title: 'Verification Received',
                    color: Colors.Orange,
                    fields: [
                        { name: 'Name', value: `${response.firstName} ${response.lastName}`, inline: true },
                        { name: 'C Number', value: response.cNumber, inline: true },
                        { name: 'Major', value: response.major, inline: true },
                    ],
                    description: `User verification required.`,
                },
            ],
            components: [row],
        });
    }
}
