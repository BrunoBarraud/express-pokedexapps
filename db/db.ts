import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_URL || '', {
    useNewUrlParser: true,
    useCreateIndex: true,
} as Parameters<typeof mongoose.connect>[1]);

export default mongoose;