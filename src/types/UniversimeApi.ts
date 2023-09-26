export type ApiResponse<ResponseBody = undefined> = {
    success:     boolean;
    message?:    string;
    redirectTo?: string;
    token?:      string;
    body?:       ResponseBody;
    alertType?:  boolean;
    alertOptions?: any;
};
