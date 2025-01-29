export type ContentStatus = {status : Capacity.Content.Status, updatedAt: string}

export const MATERIAL_TYPES_TEXT: {[k in Capacity.Content.Type]: string} = {
    VIDEO:  "Vídeo",
    LINK:   "Link",
    FOLDER: "Pasta",
    FILE:   "Arquivo",
};
export const AVAILABLE_MATERIAL_TYPES = Object.keys(MATERIAL_TYPES_TEXT) as Capacity.Content.Type[];
