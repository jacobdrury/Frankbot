import { Client, ClientOptions, Collection } from 'discord.js';
import BaseEvent from '../utils/structures/BaseModels/BaseEvent';
import BaseCommand from '../utils/structures/BaseModels/BaseCommand';
import { AccessLevel } from '../utils/structures/Enums/AccessLevel';
import { CronJob } from 'cron';
import { initializeEvents, registerSlashCommands } from '../utils/registry';
import User, { UserSchemaInterface } from '../database/models/Users';
import Channels, { ChannelSchemaInterface } from '../database/models/Channels';
import { Config } from '../utils/structures/configSchema';

export default class DiscordClient extends Client {
    private _commands = new Collection<string, BaseCommand>();
    private _aliases = new Collection<string, BaseCommand>();
    private _events = new Collection<string, BaseEvent>();
    private _staffMembers = new Collection<string, UserSchemaInterface>();
    private _guildMembers = new Collection<string, UserSchemaInterface>();
    private _channels = new Collection<string, ChannelSchemaInterface>();
    private _prefix: string = '>';
    private _config: Config;

    constructor(config: Config, options: ClientOptions) {
        super(options);
        this._config = config;
    }

    async initialize() {
        await Promise.all([
            this.loadStaffMembers(),
            this.loadGuildMembers(),
            this.loadChannels(),
            initializeEvents(this),
        ]);

        console.log('Client Initialized!');

        // Refresh Local Cache every hour
        const refreshStaffCache = new CronJob('0 * * * *', this.loadStaffMembers);
        const refreshGuildMembers = new CronJob('0 * * * *', this.loadGuildMembers);

        refreshStaffCache.start();
        refreshGuildMembers.start();
    }

    async loadChannels(): Promise<any> {
        this._channels = new Collection<string, ChannelSchemaInterface>();
        const channels = await Channels.find({
            deleted: false,
        });

        channels.forEach((c) => this._channels.set(c.id, c));
    }

    async loadStaffMembers() {
        this._staffMembers = new Collection<string, UserSchemaInterface>();
        const staff = await User.find({
            inServer: true,
            accessLevel: { $gte: AccessLevel.Staff },
        });

        staff.forEach((u) => this._staffMembers.set(u.discordId, u));
    }

    async loadGuildMembers() {
        this._guildMembers = new Collection<string, UserSchemaInterface>();
        const members = await User.find({
            inServer: true,
            accessLevel: { $lt: AccessLevel.Staff },
        });

        members.forEach((u) => this._guildMembers.set(u.discordId, u));
    }

    async refreshUserCache(discordId: string) {
        const member = await User.findOne({
            discordId,
            inServer: true,
        });

        if (member == null) return;

        if (member.accessLevel >= AccessLevel.Staff) this._staffMembers.set(member.discordId, member);
        else this._guildMembers.set(member.discordId, member);
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

    get staffMembers(): Collection<string, UserSchemaInterface> {
        return this._staffMembers;
    }

    get guildMembers(): Collection<string, UserSchemaInterface> {
        return this._guildMembers;
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
