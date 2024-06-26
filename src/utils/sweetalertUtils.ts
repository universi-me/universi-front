import Swal, { SweetAlertOptions } from "sweetalert2";

export function fireModal<T = any>(options: SweetAlertOptions) {
    return Swal.fire<T>({
        // default values. can be changed by `options`
        confirmButtonColor: "var(--primary-color)",
        allowOutsideClick: false,
        showCloseButton: false,
        color: "var(--font-color-v2)",

        ...options,
        // fixed values. cannot be changed
        toast: false,
    });
}

export function fireToasty<T = any>(options: SweetAlertOptions) {
    return Swal.fire<T>({
        // default values. can be changed by `options`
        color: "var(--font-color-v2)",
        showConfirmButton: false,
        showCancelButton: false,
        position: "top-right",

        ...options,
        // fixed values. cannot be changed
        toast: true,
        showCloseButton: true,
    });
}

export function fireAreYouSure<T = any>(options: SweetAlertOptions) {
    return fireModal({
        title: "Tem certeza que deseja fazer isso?",
        text: "Essa ação não pode ser desfeita",

        showConfirmButton: true,
        confirmButtonText: "Proceder",
        showCancelButton: true,
        cancelButtonText: "Cancelar",

        ...options,
    })
}
