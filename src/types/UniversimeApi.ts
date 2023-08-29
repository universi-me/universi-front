export type ApiResponse<ResponseBody> = {
    success:     boolean;
    message?:    string;
    redirectTo?: string;
    token?:      string;
    body?:       ResponseBody;
};
