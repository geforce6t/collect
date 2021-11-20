import { Schema } from "mongoose";

interface Auditor {
    name: string
    phone_number: number
}

interface Team {
    name: string
    members: Array<Auditor>
    managers: Array<Auditor>
    forms: Array<Schema.Types.ObjectId>
}

interface Invitation {
    team: string
    status: string
    phone_number: number
}

export interface Organization {
    name: string
    invitations: Invitation
    teams: Team
    forms: Array<Schema.Types.ObjectId>
}
interface User {
    email: string
    username: string
    password: string
    organization: Organization
    phone_number: number
}

export default User
