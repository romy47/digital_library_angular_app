export class LogModel {
    userInfo: {
        userName: string;
        orcid: string;
        userId: string;
    };
    currentURL: string;
    activity: string;
    payload: any;
    targetURL: string;
    constructor(obj?: LogModel) {
        Object.assign(this, obj);
    }
}