import { useState } from "react";

export default function useRefreshComponent() {
    const [ _, set_ ] = useState( true );

    return function() {
        set_( r => !r );
    }
}
