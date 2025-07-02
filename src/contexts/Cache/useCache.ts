import { useContext } from "react";
import { CacheContext } from "./CacheContext";

export function useCache() {
    return useContext( CacheContext );
}
