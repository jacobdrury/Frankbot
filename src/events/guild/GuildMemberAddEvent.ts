// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberAdd
import { GuildMember } from 'discord.js';
import BaseEvent from '../../utils/structures/BaseModels/BaseEvent';
import DiscordClient from '../../client/client';
import { CreateUser } from '../../utils/helpers/UserHelpers';
import User from '../../database/models/Users';
import { Colors } from '../../utils/helpers/Colors';

export default class GuildMemberAddEvent extends BaseEvent {
    constructor() {
        super('guildMemberAdd');
    }

    async run(client: DiscordClient, member: GuildMember) {
        try {
            const userDB = await User.findOne({ discordId: member.id });
            console.log(userDB);
            if (!userDB) {
                await CreateUser(member);
            } else {
                await userDB.updateOne({ inServer: true });
            }
        } catch (err) {
            console.log(err);
        }

        try {
            await member.send({
                embeds: [
                    {
                        color: Colors.Blue,
                        title: `**Welcome to ${member.guild.name}!**`,
                        description:
                            'This is a private Discord server reserved for students enrolled in the School of Computer Science and/or Informatics at the University of Louisiana at Lafayette!\n\n' +
                            'To verify please use the `/verify` slash command in the `#welcome` channel.\n\n' +
                            'Ex: `/verify CMPS John Doe C00000000`\n\n' +
                            'Once you Verify your request will be sent to the staff team for review.',
                        image: {
                            url: 'https://media.discordapp.net/attachments/410121506954280960/886344807046328350/CMPS_Banner.png',
                        },
                    },
                ],
            });
        } catch (ex) {}

        await member.roles.add(client.config.unverifiedRoleId);
    }
}
