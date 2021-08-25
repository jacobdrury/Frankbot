import { GuildMember } from 'discord.js';
import { UserSchemaInterface } from '../../database/models/Users';
import { AccessLevel } from './Enums/AccessLevel';

export default class Member implements UserSchemaInterface {
    private _guildMember: GuildMember;
    private _guildId: string;
    private _discordId: string;
    private _username: string;
    private _inServer: boolean;
    private _accessLevel: AccessLevel;

    constructor(guildMember: GuildMember, dbUser: UserSchemaInterface) {
        this._guildMember = guildMember;
        this._guildId = dbUser.guildId;
        this._discordId = dbUser.discordId;
        this._username = dbUser.username;
        this._inServer = dbUser.inServer;
        this._accessLevel = dbUser.accessLevel;
    }

    get guildMember(): GuildMember {
        return this._guildMember;
    }

    get guildId(): string {
        return this._guildId;
    }

    get discordId(): string {
        return this._discordId;
    }

    get username(): string {
        return this._username;
    }

    get inServer(): boolean {
        return this._inServer;
    }

    get accessLevel(): AccessLevel {
        return this._accessLevel;
    }
}
