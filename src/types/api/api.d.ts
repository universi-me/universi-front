namespace Api {
    type ResponseSuccess<T> = {
        data: T;
        status: number;
    };

    type ResponseError = {
        timestamp: string;
        status: {
            code: number;
            description: string;
        };
        errors: Nullable<string[]>;
    };

    type Response<T> = ResponseSuccess<T> | ResponseError;
}
