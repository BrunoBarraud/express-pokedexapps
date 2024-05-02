import mongoose, { Document, Schema, Model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; 

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    tokens: { token: string }[];
    generateAuthToken: () => Promise<string>;
}

const userSchema: Schema<IUser> = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: (value: string) => {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid Email address');
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 7
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

userSchema.pre<IUser>('save', async function (next) {
    // Hashea la contraseña
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

userSchema.methods.generateAuthToken = async function () {
    // Genera un token de autenticación para el usuario
    const user = this as IUser;
    const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY || '');
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
};

userSchema.statics.findByCredentials = async (email: string, password: string) => {
    // Busca un usuario por email y contraseña.
    const user = await userModel.findOne({ email });
    if (!user) {
        throw new Error('Invalid login credentials');
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        throw new Error('Invalid login credentials');
    }
    return user;
};

const userModel: Model<IUser> = mongoose.model('User', userSchema);

export default userModel;


