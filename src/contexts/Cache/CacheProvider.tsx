import { useRef } from "react";
import { UniversimeApi } from "@/services";
import { type ApiResponse } from "@/utils/apiUtils";

import { CacheContext, REFRESH_RATE_IN_MS, type CacheContextType } from "./CacheContext";


export function CacheProvider( props: Readonly<React.PropsWithChildren<{}>> ) {
    const { children } = props;

    const context = useRef<CacheContextType>( {
        ActivityType: new CacheHandler( UniversimeApi.ActivityType.list ),
    } ).current;

    return <CacheContext.Provider value={ context }>
        { children }
    </CacheContext.Provider>;
}

export class CacheHandler<T extends NonNullable<{}>> {
    private _lastUpdatedAt: Optional<number>;
    private _value: Optional<T>;

    constructor (
        private readonly _getter: () => Awaitable<ApiResponse<T>>
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
        const res = await this._getter();
        if ( !res.isSuccess() ) {
            console.error( res.error );
            throw new Error( `Erro ao atualizar cache: ${ res.errorMessage }` );
        }

        this._value = res.body;
        this._lastUpdatedAt = Date.now();

        return res.body;
    }
}
