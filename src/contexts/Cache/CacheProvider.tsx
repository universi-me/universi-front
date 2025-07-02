import { useRef } from "react";
import { UniversimeApi } from "@/services";
import { type ApiResponse } from "@/utils/apiUtils";

import { CacheContext, REFRESH_RATE_IN_MS, type CacheContextType } from "./CacheContext";


export function CacheProvider( props: Readonly<React.PropsWithChildren<{}>> ) {
    const { children } = props;

    const context = useRef<CacheContextType>( {
        ActivityType: cacheFromApi( UniversimeApi.ActivityType.list ),
        CompetenceType: cacheFromApi( UniversimeApi.CompetenceType.list ),
        Institution: cacheFromApi( UniversimeApi.Institution.list ),
        GroupType: cacheFromApi( UniversimeApi.GroupType.list ),
    } ).current;

    return <CacheContext.Provider value={ context }>
        { children }
    </CacheContext.Provider>;

    function cacheFromApi<T extends NonNullable<{}>>( getter: () => Awaitable<ApiResponse<T>> ): CacheHandler<T> {
        return new CacheHandler( async () => {
            const res = await getter();
            if ( !res.isSuccess() ) {
                console.error( res.error );
                throw new Error( `Erro ao atualizar cache: ${ res.errorMessage }` );
            }

            return res.body;
        } );
    }
}

export class CacheHandler<T extends NonNullable<{}>> {
    private _lastUpdatedAt: Optional<number>;
    private _value: Optional<T>;

    constructor (
        private readonly _getter: () => Awaitable<T>
    ) {}

    private shouldRefresh(): boolean {
        return this._value === undefined
            || this._lastUpdatedAt === undefined
            || Date.now() >= this._lastUpdatedAt + REFRESH_RATE_IN_MS;
    }

    public async get(): Promise<T> {
        if ( this.shouldRefresh() ) await this.update();
        return this._value!;
    }

    public async update(): Promise<T> {
        this._value = await this._getter();
        this._lastUpdatedAt = Date.now();

        return this._value;
    }
}
