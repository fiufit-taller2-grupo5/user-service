import { IError } from "./IError";
import { NOT_FOUND, USER_NOT_ADMIN, USER_IS_ADMIN, EMAIL_IN_USE } from "./constants/responseMessages";
import { OK_CODE, CREATED_CODE, DELETED_CODE, BAD_REQUEST_CODE, UNAUTHORIZED_CODE, INCORRECT_ROLE_CODE, NOT_FOUND_CODE, CONFLICT_CODE, INTERNAL_SERVER_ERROR_CODE } from "./constants/httpConstants";


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
                return NOT_FOUND_CODE;
            case USER_NOT_ADMIN:
                return INCORRECT_ROLE_CODE;
            case USER_IS_ADMIN:
                return INCORRECT_ROLE_CODE;
            case EMAIL_IN_USE:
                return CONFLICT_CODE;
            default:
                return INTERNAL_SERVER_ERROR_CODE;
        }
    }
}

