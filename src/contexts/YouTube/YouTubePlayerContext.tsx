import { createContext } from "react";

import { type Content } from "@/types/Capacity";

export type YouTubePlayerContextType = {
    currentVideoId: string | undefined;
    currentMaterial: Content | undefined;
    playingInMiniature: boolean;
    playMaterial(material: Content): Promise<boolean>;
};

export const YouTubePlayerContext = createContext<YouTubePlayerContextType>(null!);
