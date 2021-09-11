// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberUpdate
import { GuildMember, MessageEmbed } from 'discord.js';
import BaseEvent from '../../utils/structures/BaseModels/BaseEvent';
import DiscordClient from '../../client/client';
import { Colors } from '../../utils/helpers/Colors';

export default class GuildMemberUpdateEvent extends BaseEvent {
    constructor() {
        super('guildMemberUpdate');
    }

    async run(client: DiscordClient, oldMember: GuildMember, newMember: GuildMember) {
        return;
        let updated = false;

        const embed = new MessageEmbed({
            color: Colors.Orange,
            author: {
                name: `${newMember.user.username}#${newMember.user.discriminator}`,
                icon_url: newMember.user.displayAvatarURL({
                    dynamic: true,
                }),
            },
            thumbnail: {
                url: newMember.user.displayAvatarURL({
                    dynamic: true,
                }),
            },
            description: `**${newMember} updated their profile!**`,
            timestamp: new Date(),
        });

        //Check nickname
        if (oldMember.nickname !== newMember.nickname) {
            embed.addField('Nickname', `\`${oldMember.nickname}\` -> \`${newMember.nickname || 'None'}\``, false);
            updated = true;
        }

        // TODO: Add logging
    }
}
