import { createContext } from "react";

export type YouTubePlayerContextType = {
    currentVideoId: string | undefined;
    currentMaterial: Content | undefined;
    playingInMiniature: boolean;
    playMaterial(material: Content, onChangeStatus?: (material: Content) => any): Promise<boolean>;
};

export const YouTubePlayerContext = createContext<YouTubePlayerContextType>(null!);
