// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberRemove
import { GuildMember } from 'discord.js';
import BaseEvent from '../../utils/structures/BaseModels/BaseEvent';
import DiscordClient from '../../client/client';
import { CreateUser } from '../../utils/helpers/UserHelpers';
import User from '../../database/models/Users';
import { VerificationStatus } from '../../utils/structures/Enums/VerificationStatus';

export default class GuildMemberRemoveEvent extends BaseEvent {
    constructor() {
        super('guildMemberRemove');
    }

    async run(client: DiscordClient, member: GuildMember) {
        try {
            const user = await User.findOneAndUpdate(
                { discordId: member.id },
                { inServer: false, username: member.user.username, verificationStatus: VerificationStatus.NotStarted }
            );

            if (!user) {
                await CreateUser(member, { inServer: false });
            }
        } catch (err) {
            console.log(err);
        }
    }
}
