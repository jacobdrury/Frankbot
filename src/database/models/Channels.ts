import { model, Schema, SchemaTypes } from 'mongoose';
import { AccessLevel } from '../../utils/structures/Enums/AccessLevel';
import { ClassLevels } from '../../utils/structures/Enums/ClassLevels';
import { Majors } from '../../utils/structures/Enums/Major';

export interface ChannelSchemaInterface {
    guildId: string;
    id: string;
    name: string;
    major: Majors;
    classNumber: Number;
    classLevel: ClassLevels;
    deleted: boolean;
}

const ChannelSchema = new Schema({
    id: {
        type: SchemaTypes.String,
        required: true,
        unique: true,
    },
    guildId: {
        type: SchemaTypes.String,
        required: true,
    },
    name: SchemaTypes.String,
    major: {
        type: SchemaTypes.String,
        required: true,
    },
    classNum: {
        type: SchemaTypes.Number,
        required: true,
    },
    classLevel: {
        type: SchemaTypes.Number,
        required: true,
    },
    deleted: {
        type: SchemaTypes.Boolean,
        requiredPaths: true,
        default: false,
    },
});

export default model<ChannelSchemaInterface>('Channel', ChannelSchema);
