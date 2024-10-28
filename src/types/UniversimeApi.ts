type ApiBaseResponse<Success extends boolean, ResponseBody = undefined> = {
    success:     Success;
    message?:    string;
    redirectTo?: string;
    token?:      string;
    body:        ResponseBody;
    alertOptions?: {
        [k: string]: string;
    };
};

export type ApiSuccessResponse<SuccessBody> = ApiBaseResponse<true, SuccessBody>;
export type ApiFailResponse<FailBody> = ApiBaseResponse<false, FailBody>;

export type ApiResponse<SuccessBody = undefined, FailBody = SuccessBody | undefined>
    = ApiSuccessResponse<SuccessBody> | ApiFailResponse<FailBody>;
