import { type Content, type Folder } from "@/types/Capacity";
import { createContext } from "react";

export type ContentContextType = {
    content: Folder;
    materials: Content[];
};

export const ContentContext = createContext<ContentContextType | null>(null);
