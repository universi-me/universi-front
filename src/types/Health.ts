import { Optional } from "./utils";

export type HealthResponseDTO = {
    up: boolean;
    message: Optional<string>;
};
