import { Client, ClientOptions, Collection } from 'discord.js';
import BaseEvent from '../utils/structures/BaseModels/BaseEvent';
import BaseCommand from '../utils/structures/BaseModels/BaseCommand';
import { initializeEvents } from '../utils/registry';
import Channels, { ChannelSchemaInterface } from '../database/models/Channels';
import { Config } from '../utils/structures/configSchema';

export default class DiscordClient extends Client {
    private _commands = new Collection<string, BaseCommand>();
    private _aliases = new Collection<string, BaseCommand>();
    private _events = new Collection<string, BaseEvent>();
    private _channels = new Collection<string, ChannelSchemaInterface>();
    private _prefix: string = '>';
    private _config: Config;

    constructor(config: Config, options: ClientOptions) {
        super(options);
        this._config = config;
    }

    async initialize() {
        await Promise.all([this.loadChannels(), initializeEvents(this)]);
        console.log('Client Initialized!');
    }

    async loadChannels(): Promise<any> {
        this._channels = new Collection<string, ChannelSchemaInterface>();
        const channels = await Channels.find({
            deleted: false,
        });

        channels.forEach((c) => this._channels.set(c.id, c));
    }

    public get config(): Config {
        return this._config;
    }

    public get cachedChannels() {
        return this._channels;
    }

    public set cachedChannels(value) {
        this._channels = value;
    }

    get commands(): Collection<string, BaseCommand> {
        return this._commands;
    }

    get aliases(): Collection<string, BaseCommand> {
        return this._aliases;
    }

    get events(): Collection<string, BaseEvent> {
        return this._events;
    }

    get prefix(): string {
        return this._prefix;
    }

    set prefix(prefix: string) {
        this._prefix = prefix;
    }
}
