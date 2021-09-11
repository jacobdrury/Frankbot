import { CommandInteraction, Message } from 'discord.js';
import BaseCommand from '../../utils/structures/BaseModels/BaseCommand';
import DiscordClient from '../../client/client';
import { AccessLevel } from '../../utils/structures/Enums/AccessLevel';
import Users from '../../database/models/Users';
import { CreateUser } from '../../utils/helpers/UserHelpers';
import csv from 'csv-parser';
import fs from 'fs';
import { Colors } from '../../utils/helpers/Colors';

export default class TestCommand extends BaseCommand {
    constructor() {
        super('test', 'test', AccessLevel.Owner);
    }

    async run(client: DiscordClient, interaction: CommandInteraction, args: string[]): Promise<void> {
        await interaction.deferReply({
            ephemeral: true,
        });

        interaction.channel.send({
            embeds: [
                {
                    color: Colors.Blue,
                    title: `**Welcome to ${interaction.guild.name}!**`,
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
        // const guildMembers = await interaction.guild.members.fetch();

        //let count = 0;
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

        //await interaction.followUp({ content: `${count} users added to the DB!` });
    }
}
