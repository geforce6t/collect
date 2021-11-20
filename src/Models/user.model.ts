import * as mongoose from 'mongoose';

import User, { Organization } from '../Interfaces/model/user.interface'

const organizationSchema = new mongoose.Schema<Organization>({
    name: String,
    forms: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Form",
    }],
    invitations: [{
        team: String,
        status: String,
        phone_number: Number,
    }],
    teams: [{
        name: {
            type: String,
            unique: true,
        },
        members: [{
            name: String,
            phone_number: Number,
        }],
        managers: [{
            name: String,
            phone_number: Number,
        }],
        forms: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Form",
        }],
    }]
}, { _id : false })

const userSchema = new mongoose.Schema<User>({
    email: String,
    username: String,
    password: String,
    organization: organizationSchema,
    phone_number: Number,
})

const userModel = mongoose.model<User>('User', userSchema)


export default userModel