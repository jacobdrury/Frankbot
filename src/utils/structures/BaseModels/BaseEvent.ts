import { ClientEvents } from 'discord.js';
import DiscordClient from '../../../client/client';

const CustomEvents = 'infractionCreate' || 'interactionCreate' || 'OnVerification' || 'OnVerificationButtonEvent';

export default abstract class BaseEvent {
    constructor(
        private _name: keyof ClientEvents | typeof CustomEvents,
        private _needsInitialization: boolean = false
    ) {}

    get name(): string {
        return this._name;
    }

    get needsInitialization(): boolean {
        return this._needsInitialization;
    }

    async initialize(client: DiscordClient): Promise<void> {}
    abstract run(client: DiscordClient, ...args: any): void;
}
