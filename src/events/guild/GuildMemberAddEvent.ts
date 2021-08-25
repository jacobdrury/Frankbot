// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberAdd
import { GuildMember } from 'discord.js';
import BaseEvent from '../../utils/structures/BaseModels/BaseEvent';
import DiscordClient from '../../client/client';
import { CreateUser } from '../../utils/helpers/UserHelpers';
import User from '../../database/models/Users';

export default class GuildMemberAddEvent extends BaseEvent {
    constructor() {
        super('guildMemberAdd');
    }

    async run(client: DiscordClient, member: GuildMember) {
        try {
            const userDB = await User.findOne({ discordId: member.id });
            if (!userDB) {
                await CreateUser(member);
            } else {
                await userDB.updateOne({ inServer: true });
            }
        } catch (err) {
            console.log(err);
        }
    }
}
