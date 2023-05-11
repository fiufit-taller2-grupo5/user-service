import { IError } from "./IError";
import { NOT_FOUND, USER_NOT_ADMIN, USER_IS_ADMIN, EMAIL_IN_USE } from "./constants/responseMessages";
export class Error implements IError {
    private message: string;
    private code: number;

    constructor(message: string) {
        this.message = message;
        this.code = this.getCodeFromMessage(message);
    }

    public getMessage(): string {
        return this.message;
    }

    public getCode(): number {
        return this.code;
    }

    private getCodeFromMessage(message: string): number {
        switch (message) {
            case NOT_FOUND:
                return 404;
            case USER_NOT_ADMIN:
                return 403;
            case USER_IS_ADMIN:
                return 403;
            case EMAIL_IN_USE:
                return 409;
            default:
                return 500;
        }
    }
}

