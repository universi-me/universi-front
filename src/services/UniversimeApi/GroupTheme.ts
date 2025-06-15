import { createApiInstance } from "./api";
import { ApiResponse } from "@/utils/apiUtils";

const api = createApiInstance( "/group/settings/themes" )

export function update( body: GroupThemeUpdate_RequestDTO ) {
    return api.patch<Group.Theme>( "", body ).then( ApiResponse.new );
}

export type GroupThemeUpdate_RequestDTO = {
    groupId: string;

    primary_color?: string;
    secondary_color?: string;
    background_color?: string;
    card_background_color?: string;
    card_item_color?: string;
    font_color_v1?: string;
    font_color_v2?: string;
    font_color_v3?: string;
    font_color_links?: string;
    font_color_disabled?: string;
    button_hover_color?: string;
    font_color_alert?: string;
    font_color_success?: string;
    wrong_invalid_color?: string;
};
