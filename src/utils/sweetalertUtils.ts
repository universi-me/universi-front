import Swal, { SweetAlertOptions } from "sweetalert2";
import { FONT_COLOR_V2, PRIMARY_COLOR } from "@/utils/colors";

export function fireModal<T = any>(options: SweetAlertOptions) {
    return Swal.fire<T>({
        confirmButtonColor: PRIMARY_COLOR,
        allowOutsideClick: false,
        showCloseButton: false,
        color: FONT_COLOR_V2,

        ...options,
    });
}
