import BaseEvent from '../../utils/structures/BaseModels/BaseEvent';
import DiscordClient from '../../client/client';

export default class ReadyEvent extends BaseEvent {
  constructor() {
    super('ready');
  }

  async run (client: DiscordClient) {
    console.log('Bot has logged in.');
        await client.initialize();
        client.user.setPresence({
            status: 'dnd',
            activities: [{ type: 'WATCHING', name: 'me get developed!' }],
        });
  }
}