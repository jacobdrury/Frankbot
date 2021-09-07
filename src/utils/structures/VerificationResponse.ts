import { Majors } from './Enums/Major';

export default class VerificationResponse {
    constructor(public firstName: string, public lastName: string, public cNumber: string, public major: Majors) {}
}
