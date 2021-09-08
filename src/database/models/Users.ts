import { model, Schema, SchemaTypes } from 'mongoose';
import { AccessLevel } from '../../utils/structures/Enums/AccessLevel';
import { Majors } from '../../utils/structures/Enums/Major';
import { VerificationStatus } from '../../utils/structures/Enums/VerificationStatus';

export interface UserSchemaInterface {
    guildId: string;
    discordId: string;
    username: string;
    firstName: string;
    lastName: string;
    major: Majors;
    cNumber: string;
    inServer: boolean;
    accessLevel: AccessLevel;
    verificationStatus: VerificationStatus;
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
    firstName: SchemaTypes.String,
    lastName: SchemaTypes.String,
    major: SchemaTypes.String,
    cNumber: SchemaTypes.String,
    username: SchemaTypes.String,
    inServer: {
        type: SchemaTypes.Boolean,
        default: true,
    },
    accessLevel: {
        type: SchemaTypes.Number,
        default: AccessLevel.Unenrolled,
    },
    verificationStatus: {
        type: SchemaTypes.String,
        default: VerificationStatus.NotStarted,
    },
});

export default model<UserSchemaInterface>('User', UserSchema);
