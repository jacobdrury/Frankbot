import { ApplicationCommandChoicesData, Collection, CommandInteraction, Message, MessageEmbed } from 'discord.js';
import BaseCommand from '../../utils/structures/BaseModels/BaseCommand';
import DiscordClient from '../../client/client';
import { Colors } from '../../utils/helpers/Colors';
import { GetMemberFromInteraction } from '../../utils/helpers/UserHelpers';
import Member from '../../utils/structures/Member';
import client from '../..';

export default class HelpCommand extends BaseCommand {
    constructor() {
        super('help', 'Basic');
        this.aliases = ['commands'];
        this.description = 'Displays the commands available';

        this.options = [
            {
                name: 'cmd',
                type: 'STRING',
                description: 'Command to look up',
                required: false,
            },
        ];
    }

    initializeOptions() {
        const option: any = this.options[0];

        option['choices'] = client.commands.map((command: BaseCommand) => {
            return {
                name: command.name,
                value: command.name.toLowerCase(),
            };
        });
    }

    async run(client: DiscordClient, interaction: CommandInteraction, args: Array<string>) {
        const helpEmbed = new MessageEmbed().setColor(Colors.Blue);
        const member = await GetMemberFromInteraction(client, interaction);

        if (member == null) return;

        const filter = (c: BaseCommand) => member.accessLevel >= c.accessLevel && c.name != 'help';

        if (args.length) await this.getCMD(client, interaction, args, helpEmbed, client.commands.filter(filter));
        else await this.getAll(client, interaction, member, helpEmbed);
    }

    private async getCMD(
        client: DiscordClient,
        interaction: CommandInteraction,
        args: Array<string>,
        helpEmbed: MessageEmbed,
        commands: Collection<string, BaseCommand>
    ) {
        const [name] = args;
        const command = commands.get(name);

        if (!command) {
            await interaction.reply({ content: `Could not find command: ${name}`, ephemeral: true });
            return;
        }

        helpEmbed.setTitle('Command Info').addField('**Command Name:**', command.name, !(command.aliases == null));
        if (command.aliases.length) helpEmbed.addField('**Aliases:**', command.aliases.join(', '), true);
        if (command.description.length) helpEmbed.addField('**Description:**', command.description);
        if (command.usage.length) helpEmbed.addField('**Usage:**', `${client.prefix}${command.name} ${command.usage}`);

        await interaction.reply({ embeds: [helpEmbed], ephemeral: true });
    }

    private async getAll(
        client: DiscordClient,
        interaction: CommandInteraction,
        member: Member,
        helpEmbed: MessageEmbed
    ) {
        const categories = new Collection<string, Collection<string, BaseCommand>>();

        client.commands
            .filter((command) => !(command.accessLevel > member.accessLevel || command.name == 'help'))
            .map((command: BaseCommand) => {
                const category = categories.get(command.category);
                if (!category)
                    categories.set(command.category, new Collection<string, BaseCommand>([[command.name, command]]));
                else category.set(command.name, command);
            });

        for (const [name, commands] of categories) {
            const commandNames = commands.map((command: BaseCommand, name: string) => `\`${name}\``).join(' ');
            helpEmbed.addField(name, commandNames);
        }

        helpEmbed
            .setTitle("Here's a list of all my commands!")
            .setFooter(`You can send \`${client.prefix}help [command name]\` to get info on a specific command!`);

        await interaction.reply({ embeds: [helpEmbed], ephemeral: true });
    }
}
