import { model, Schema, SchemaTypes } from 'mongoose';
import { AccessLevel } from '../../utils/structures/Enums/AccessLevel';

export interface UserSchemaInterface {
    guildId: string;
    discordId: string;
    username: string;
    inServer: boolean;
    accessLevel: AccessLevel;
}

const UserSchema = new Schema({
    discordId: {
        type: SchemaTypes.String,
        required: true,
        unique: true,
    },
    guildId: {
        type: SchemaTypes.String,
        required: true,
    },
    username: SchemaTypes.String,
    inServer: {
        type: SchemaTypes.Boolean,
        default: true,
    },
    accessLevel: {
        type: SchemaTypes.Number,
        default: AccessLevel.Unenrolled,
    },
});

export default model<UserSchemaInterface>('User', UserSchema);
