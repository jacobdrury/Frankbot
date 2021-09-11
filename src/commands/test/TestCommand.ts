import { CommandInteraction, Message } from 'discord.js';
import BaseCommand from '../../utils/structures/BaseModels/BaseCommand';
import DiscordClient from '../../client/client';
import { AccessLevel } from '../../utils/structures/Enums/AccessLevel';
import Users from '../../database/models/Users';
import { CreateUser } from '../../utils/helpers/UserHelpers';
import csv from 'csv-parser';
import fs from 'fs';

export default class TestCommand extends BaseCommand {
    constructor() {
        super('test', 'test', AccessLevel.Owner);
    }

    async run(client: DiscordClient, interaction: CommandInteraction, args: string[]): Promise<void> {
        await interaction.reply({
            content: 'Pong',
        });

        // await interaction.deferReply({
        //     ephemeral: true,
        // });

        // const guildMembers = await interaction.guild.members.fetch();

        let count = 0;
        // for (const [id, member] of guildMembers.filter((u) => !u.user.bot)) {
        //     try {
        //         await CreateUser(member, { inServer: true });
        //         count++;
        //     } catch (ex) {
        //         console.error(ex);
        //     }
        // }

        // fs.createReadStream('Users.csv')
        //     .pipe(csv())
        //     .on('data', async (row) => {
        //         try {
        //             await Users.findOneAndUpdate(
        //                 {
        //                     discordId: row['discordId'],
        //                 },
        //                 {
        //                     firstName: row['firstName'],
        //                     lastName: row['lastName'],
        //                 }
        //             );
        //             count++;
        //         } catch (ex) {
        //             console.error(ex);
        //         }
        //     })
        //     .on('end', () => {
        //         console.log('CSV file successfully processed');
        //     });

        // await interaction.followUp({ content: `${count} users added to the DB!` });
    }
}
