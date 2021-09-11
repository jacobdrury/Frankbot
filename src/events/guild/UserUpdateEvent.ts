// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-userUpdate
import { MessageEmbed, User } from 'discord.js';
import BaseEvent from '../../utils/structures/BaseModels/BaseEvent';
import DiscordClient from '../../client/client';
import { Colors } from '../../utils/helpers/Colors';
import Users, { UserSchemaInterface } from '../../database/models/Users';

export default class UserUpdateEvent extends BaseEvent {
    constructor() {
        super('userUpdate');
    }

    async run(client: DiscordClient, oldUser: User, newUser: User) {
        let updated = false;

        const embed = new MessageEmbed({
            color: Colors.Orange,
            author: {
                name: `${newUser.username}#${newUser.discriminator}`,
                icon_url: newUser.displayAvatarURL({
                    dynamic: true,
                }),
            },
            thumbnail: {
                url: newUser.displayAvatarURL({
                    dynamic: true,
                }),
            },
            description: `**${newUser} updated their profile!**`,
            timestamp: new Date(),
        });

        //Check username
        if (oldUser.username !== newUser.username) {
            embed.addField('Username', `\`${oldUser.username}\` -> \`${newUser.username}\``, false);
            updated = true;

            await Users.findOneAndUpdate(
                {
                    discordId: newUser.id,
                },
                {
                    username: newUser.username,
                }
            );
        }

        //Check Discriminator
        if (oldUser.discriminator !== newUser.discriminator) {
            embed.addField('Discriminator', `\`${oldUser.discriminator}\` -> \`${newUser.discriminator}\``, false);
            updated = true;
        }

        const oldUrl = oldUser.displayAvatarURL({
            dynamic: true,
        });

        const newUrl = newUser.displayAvatarURL({
            dynamic: true,
        });

        //Check Pfp
        if (oldUrl !== newUrl) {
            embed.addField('Avatar', `[Before](${oldUrl}) -> [After](${newUrl})`, false);
            updated = true;
        }
    }
}
