export type User = {
    id:             string;
    name:           string;
    email?:         string;
    ownerOfSession: boolean;
    needProfile:    boolean;
}
