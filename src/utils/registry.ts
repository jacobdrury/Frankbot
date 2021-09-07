import path from 'path';
import { promises as fs } from 'fs';
import DiscordClient from '../client/client';
import BaseCommand from './structures/BaseModels/BaseCommand';
import BaseEvent from './structures/BaseModels/BaseEvent';
import { ApplicationCommandData, Guild } from 'discord.js';

export async function registerCommands(client: DiscordClient, dir: string = '') {
    let count = 0;
    await loadCommands(dir, (command: BaseCommand) => {
        client.commands.set(command.name.toLowerCase(), command);
        count++;
        command.aliases.forEach((alias: string) => {
            client.aliases.set(alias.toLowerCase(), command);
        });
    });
    console.log(`${count} commands loaded!`);
}

export async function registerSlashCommands(client: DiscordClient, guild: Guild, dir: string = ''): Promise<Number> {
    const data: Array<ApplicationCommandData> = client.commands
        .filter((command: BaseCommand) => !command.registerIgnore)
        .map((command: BaseCommand) => {
            if (command.options.length) command.initializeOptions();
            return {
                name: command.name.toLowerCase(),
                description: command.description ? command.description : 'None',
                options: command.options,
                defaultPermission: true,
            };
        });

    const commands = await guild.commands.set(data);

    console.log(`${commands.size} slash commands registered:`);
    console.table(data);

    return commands.size;
}

export async function loadCommands(dir: string = '', callback: (command: BaseCommand) => any) {
    const filePath = path.join(__dirname, dir);
    const files = await fs.readdir(filePath);
    for (const file of files) {
        const stat = await fs.lstat(path.join(filePath, file));
        if (stat.isDirectory()) await loadCommands(path.join(dir, file), callback);
        if (file.endsWith('.js') || file.endsWith('.ts')) {
            const { default: Command } = await import(path.join(dir, file));
            const command = new Command() as BaseCommand;
            await callback(command);
        }
    }
}

export async function registerEvents(client: DiscordClient, dir: string = '') {
    const filePath = path.join(__dirname, dir);
    const files = await fs.readdir(filePath);
    for (const file of files) {
        const stat = await fs.lstat(path.join(filePath, file));
        if (stat.isDirectory()) registerEvents(client, path.join(dir, file));
        if (file.endsWith('.js') || file.endsWith('.ts')) {
            const { default: Event } = await import(path.join(dir, file));
            const event = new Event() as BaseEvent;
            client.events.set(event.name, event);
            client.on(event.name, event.run.bind(event, client));
        }
    }
}

export async function initializeEvents(client: DiscordClient) {
    client.events.filter((e) => e.needsInitialization).forEach(async (event) => await event.initialize(client));
}
