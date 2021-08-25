import { ApplicationCommandOptionData, CommandInteraction, Message } from 'discord.js';
import DiscordClient from '../../../client/client';
import { AccessLevel } from '../Enums/AccessLevel';

export default abstract class BaseCommand {
  private _accessLevel: AccessLevel;
    private _description: string = '';
    private _usage: string = '';
    private _aliases: Array<string> = [];
    private _options: Array<ApplicationCommandOptionData> = [];

    constructor(private _name: string, private _category: string, accessLevel: AccessLevel = AccessLevel.Enrolled) {
        this._accessLevel = accessLevel
    }

    get accessLevel(): AccessLevel {
        return this._accessLevel;
    }

    get name(): string {
        return this._name;
    }

    get category(): string {
        return this._category;
    }

    set description(description: string) {
        this._description = description;
    }

    get description(): string {
        return this._description;
    }

    set usage(usage: string) {
        this._usage = usage;
    }

    get usage(): string {
        return this._usage;
    }

    set aliases(aliases: Array<string>) {
        this._aliases = aliases;
    }

    get aliases(): Array<string> {
        return this._aliases;
    }

    set options(options: Array<ApplicationCommandOptionData>) {
        this._options = options;
    }

    get options(): Array<ApplicationCommandOptionData> {
        return this._options;
    }

    abstract run(client: DiscordClient, message: Message, args: Array<string> | null): Promise<void>;
    async runSlash(client: DiscordClient, interaction: CommandInteraction, args: Array<string> | null): Promise<void> {
        await interaction.reply(`${interaction.commandName} is not setup to be a slash command.`);
    }
    initializeOptions() {}
}