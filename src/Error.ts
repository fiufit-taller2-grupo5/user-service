export class BadRequestError extends Error {
    public message: string;
    public code: number;

    constructor(message: string) {
        super(message);
        this.message = message;
        this.code = 400;
    }
}

export class UnauthorizedError extends Error {
    public message: string;
    public code: number;

    constructor(message: string) {
        super(message);
        this.message = message;
        this.code = 401;
    }
}

export class ForbiddenError extends Error {
    public message: string;
    public code: number;

    constructor(message: string) {
        super(message);
        this.message = message;
        this.code = 403;
    }
}

export class NotFoundError extends Error {
    public message: string;
    public code: number;

    constructor(message: string) {
        super(message);
        this.message = message;
        this.code = 404;
    }
}

export class ConflictError extends Error {
    public message: string;
    public code: number;

    constructor(message: string) {
        super(message);
        this.message = message;
        this.code = 409;
    }
}

export class InternalServerError extends Error {
    public message: string;
    public code: number;

    constructor(message: string) {
        super(message);
        this.message = message;
        this.code = 500;
    }
}
