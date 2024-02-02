import { type Content, type Folder } from "@/types/Capacity";
import { createContext } from "react";

type EditingSettings = {
    // Editing content
    content: Folder;
    material?: undefined;
} | {
    // Editing material
    content?: undefined;
    material: Content;
} |
    // Not editing anything
    undefined;

export type ContentContextType = {
    content: Folder;
    materials: Content[];

    refreshMaterials(): void;

    editingSettings: EditingSettings;
    setEditingSettings(set: EditingSettings): void;
};

export const ContentContext = createContext<ContentContextType | null>(null);
