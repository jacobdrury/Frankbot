import { GuildMember } from 'discord.js';
import Users, { UserSchemaInterface } from '../../database/models/Users';
import { AccessLevel } from './Enums/AccessLevel';
import { Majors } from './Enums/Major';
import { VerificationStatus } from './Enums/VerificationStatus';
import VerificationResponse from './VerificationResponse';

export default class Member implements UserSchemaInterface {
    private _guildMember: GuildMember;
    private _guildId: string;
    private _discordId: string;
    private _username: string;
    private _inServer: boolean;
    private _accessLevel: AccessLevel;
    private _verificationStatus: VerificationStatus;
    private _firstName: string;
    private _lastName: string;
    private _major: Majors;
    private _cNumber: string;

    constructor(guildMember: GuildMember, dbUser: UserSchemaInterface) {
        this._guildMember = guildMember;
        this._guildId = dbUser.guildId;
        this._discordId = dbUser.discordId;
        this._firstName = dbUser.firstName;
        this._lastName = dbUser.lastName;
        this._major = dbUser.major;
        this._cNumber = dbUser.cNumber;
        this._username = dbUser.username;
        this._inServer = dbUser.inServer;
        this._accessLevel = dbUser.accessLevel;
        this._verificationStatus = dbUser.verificationStatus;
    }

    async verify() {
        await Users.findOneAndUpdate(
            {
                guildId: this.guildId,
                discordId: this.discordId,
            },
            {
                inServer: true,
                accessLevel: AccessLevel.Enrolled,
                verificationStatus: VerificationStatus.Approved,
            }
        );
        this._verificationStatus = VerificationStatus.Approved;
    }

    async setVerificationStatus(status: VerificationStatus) {
        await Users.findOneAndUpdate(
            {
                guildId: this.guildId,
                discordId: this.discordId,
            },
            {
                verificationStatus: status,
            }
        );

        this._verificationStatus = status;
    }

    async setPersonalInfo(response: VerificationResponse) {
        await Users.findOneAndUpdate(
            {
                guildId: this.guildId,
                discordId: this.discordId,
            },
            {
                firstName: response.firstName,
                lastName: response.lastName,
                major: response.major,
                cNumber: response.cNumber,
            }
        );
        this._firstName = response.firstName;
        this._lastName = response.lastName;
        this._major = response.major;
        this._cNumber = response.cNumber;
    }

    get firstName(): string {
        return this._firstName;
    }

    public get lastName(): string {
        return this._lastName;
    }

    public get major(): Majors {
        return this._major;
    }

    public get cNumber(): string {
        return this._cNumber;
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

    get verificationStatus(): VerificationStatus {
        return this._verificationStatus;
    }
}
