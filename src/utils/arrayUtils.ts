export function removeFalsy<T>(arr: T[]): Truthy<T>[] {
    return arr.filter(v => !!v) as Truthy<T>[];
}

/** Returns a new array with all elements of `arr1` that are not in `arr2` according to `check` */
export function arrayRemoveEquals<T, K>(arr1: T[], arr2: K[], check?: (a: T, b: K) => boolean): T[] {
    const isEqual = check ?? Object.is;

    return arr1.filter(a => null == arr2.find(b => isEqual(a, b)));
}

export function groupArray<T, Label extends string>(arr: T[], grouper: (v: T)=> Label) {
    const groups: Map<Label, T[]> = new Map();

    arr.forEach(t => {
        const key = grouper(t);

        const value = groups.has(key)
            ? groups.get(key)!.concat([t])
            : [t];

        groups.set(key, value);
    });

    return groups;
}

export class ArrayChanges<T> {
    private readonly _added: T[] = [];
    private readonly _removed: T[] = [];

    constructor(
        private readonly initial: T[],
        private readonly match: ( v1: T, v2: T ) => boolean,
    ) {}

    public static from<T>(
        initial: Optional<T[]>,
        final: Optional<T[]>,
        match: ( v1: T, v2: T ) => boolean,
    ): ArrayChanges<T> {
        const changes = new ArrayChanges( initial ?? [], match );

        final?.forEach( v => {
            if ( !changes.inInitial( v ) )
                changes.add( v );
        } );

        initial?.forEach( v1 => {
            if ( !final?.some( ( v2 ) => match( v1, v2 ) ) )
                changes.remove( v1 );
        } );

        return changes;
    }

    get hasChanges(): boolean {
        return ( this._added.length > 0 ) || ( this._removed.length > 0 );
    }

    add( val: T ) {
        const i = this._removed.findIndex( v => this.match( v, val ) );
        if ( i !== -1 )
            this._removed.splice( i, 1 );

        if ( !this.inInitial( val ) && !this.inAdded( val ) )
            this._added.push( val );
    }

    remove( val: T ) {
        const i = this._added.findIndex( v => this.match( v, val ) );
        if( i !== -1 )
            this._added.splice( i, 1 );

        if ( this.inInitial( val ) && !this.inRemoved( val ) )
            this._removed.push( val );
    }

    final() {
        return this.initial
            .filter( v => !this._removed.some( r => this.match( v, r ) ) )
            .concat( this._added );
    }

    inFinal( val: T ) {
        return this.inAdded( val ) || ( this.inInitial( val ) && !this.inRemoved( val ) );
    }

    inInitial( val: T ): boolean {
        return this.initial.some( v => this.match( val, v ) );
    }

    private inAdded( val: T ): boolean {
        return this._added.some( v => this.match( val, v ) );
    }

    private inRemoved( val: T ): boolean {
        return this._removed.some( v => this.match( val, v ) );
    }

    get added() { return [ ...this._added ]; }
    get removed() { return [ ...this._removed ]; }
}
