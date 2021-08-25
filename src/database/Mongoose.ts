import { connect } from 'mongoose';

export const connectDatabase = async (uri: string) => {
    await connect(uri);
    console.log('Database Connected!');
};
