import { createContext } from "react";
import { type ProfileClass } from "@/types/Profile";

type EditingSettings = {
    // Editing content
    content: true;
    material?: undefined;
} | {
    // Editing material
    content?: false;
    material: Content | null;
} |
    // Not editing anything
    undefined;

export type ContentContextType = {
    content: Folder;
    materials: Content[];
    watchingProfile?: ProfileClass;

    refreshAllData(): Promise<ContentContextType>;
    refreshContent(): Promise<ContentContextType>;
    refreshMaterials(): Promise<ContentContextType>;

    editingSettings: EditingSettings;
    setEditingSettings(set: EditingSettings): void;
};

export const ContentContext = createContext<ContentContextType | null>(null);
