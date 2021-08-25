import { model, Schema, SchemaTypes } from 'mongoose';

export interface GuildSchemaInterface {
    name: string;
    guildId: string;
    prefix: string;
}

const GuildSchema = new Schema({
    name: SchemaTypes.String,
    guildId: {
        type: SchemaTypes.String,
        required: true,
        unique: true,
    },
    prefix: {
        type: SchemaTypes.String,
        default: '>',
    },
});

export default model<GuildSchemaInterface>('Guild', GuildSchema);
