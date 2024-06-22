export class AuthToken {
    access_token: string;
    expires_in: number;
    name: string;
    orcid: string;
    refresh_token: string;
    scope: string;
    token_type: string;
    _id: string;
    constructor(obj?: AuthToken) {
        Object.assign(this, obj);
    }
}