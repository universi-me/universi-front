import { createApiInstance } from "./api";
import { ApiResponse } from "@/utils/apiUtils";

const api = createApiInstance( "/group/settings/themes" )

export function update( body: GroupThemeUpdate_RequestDTO ) {
    return api.patch<Group.Theme>( "", body ).then( ApiResponse.new );
}

export type GroupThemeUpdate_RequestDTO = {
    groupId: string;

    primary_color: Optional<string>;
    secondary_color: Optional<string>;
    background_color: Optional<string>;
    card_background_color: Optional<string>;
    card_item_color: Optional<string>;
    font_color_v1: Optional<string>;
    font_color_v2: Optional<string>;
    font_color_v3: Optional<string>;
    font_color_links: Optional<string>;
    font_color_disabled: Optional<string>;
    button_hover_color: Optional<string>;
    font_color_alert: Optional<string>;
    font_color_success: Optional<string>;
    wrong_invalid_color: Optional<string>;
};
