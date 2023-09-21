import Swal, { SweetAlertOptions } from "sweetalert2";
import { FONT_COLOR_V2, PRIMARY_COLOR } from "@/utils/colors";

export function fireModal<T = any>(options: SweetAlertOptions) {
    return Swal.fire<T>({
        // default values. can be changed by `options`
        confirmButtonColor: PRIMARY_COLOR,
        allowOutsideClick: false,
        showCloseButton: false,
        color: FONT_COLOR_V2,

        ...options,
        // fixed values. cannot be changed
        toast: false,
    });
}

export function fireToasty<T = any>(options: SweetAlertOptions) {
    return Swal.fire<T>({
        // default values. can be changed by `options`
        color: FONT_COLOR_V2,
        showConfirmButton: false,
        showCancelButton: false,
        position: "top-right",

        ...options,
        // fixed values. cannot be changed
        toast: true,
        showCloseButton: true,
    });
}
