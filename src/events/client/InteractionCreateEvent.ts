import BaseEvent from '../../utils/structures/BaseModels/BaseEvent';
import DiscordClient from '../../client/client';
import { CommandInteraction, Interaction } from 'discord.js';
import { GetMemberFromInteraction } from '../../utils/helpers/UserHelpers';
import { VerificationStatus } from '../../utils/structures/Enums/VerificationStatus';

export default class InteractionCreateEvent extends BaseEvent {
    constructor() {
        super('interactionCreate');
    }

    async run(client: DiscordClient, interaction: Interaction) {
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) {
                await interaction.reply({ content: 'An error has occurred', ephemeral: true });
                return;
            }

            const member = await GetMemberFromInteraction(client, interaction);

            if (command.accessLevel > member!.accessLevel) {
                await interaction.reply({
                    content: 'You do not have permission to use this command',
                    ephemeral: true,
                });
                return;
            }

            const args: any = [];
            interaction.options.data.map((x) => args.push(x.value));

            command.run(client, interaction as CommandInteraction, args);
        }

        if (interaction.isButton()) {
            switch (interaction.customId) {
                case VerificationStatus.Approved:
                case VerificationStatus.Denied: {
                    client.emit('OnVerificationButtonEvent', interaction, interaction.customId as VerificationStatus);
                    break;
                }
            }
        }
    }
}
