import { PropsWithChildren, useState } from "react";
import { UniversiModal } from "@/components/UniversiModal";
import { UniversiFormContext } from "./UniversiFormContext";

import * as SweetAlertUtils from "@/utils/sweetalertUtils";

export function UniversiForm2(props : Readonly<UniversiForm2Props>) {
    const [paramMap, setParamMap] = useState(new Map<string, () => any>());

    // todo: implement `canSave` logic
    const canSave = true;

    const render = <UniversiFormContext.Provider value={{ addParam, getParamValue }} >
        <div className="universiform-component">
            <section className="form-fields">
                { props.children }
            </section>

            <section className="form-actions">
                { (props.actions?.cancel?.can ?? true) &&
                    <button type="button" onClick={handleCancel} className="form-button" style={{
                        backgroundColor: props.actions?.cancel?.buttonColor?.background ?? "var(--secondary-color)",
                        color: props.actions?.cancel?.buttonColor?.text ?? "var(--font-color-v1)",
                    }} >
                        <i className="bi bi-x-circle-fill" />
                        { props.actions?.cancel?.buttonText ?? "Cancelar" }
                    </button>
                }

                <button type="button" onClick={handleConfirm} className="form-button" disabled={!canSave} style={{
                    backgroundColor: props.actions?.confirm?.buttonColor?.background ?? "var(--primary-color)",
                    color: props.actions?.confirm?.buttonColor?.text ?? "var(--font-color-v1)",
                }} >
                    <i className="bi bi-check-circle-fill" />
                    { props.actions?.confirm?.buttonText ?? "Salvar" }
                </button>
            </section>
        </div>
    </UniversiFormContext.Provider>

    return props.asModal
        ? <UniversiModal>{ render }</UniversiModal>
        : render;

    function addParam<O>(name: string, getter: () => any) {
        setParamMap(paramMap.set(name, getter));
    }

    function getParamValue(name: string) {
        const getter = paramMap.get(name);

        return getter === undefined
            ? undefined
            : getter();
    }

    async function handleCancel() {
        if ( props.actions?.cancel?.showPopup ?? true ) {
            const res = await SweetAlertUtils.fireModal({
                title: props.actions?.cancel?.popupTitle ?? "Deseja cancelar esta ação?",
                text: props.actions?.cancel?.popupText ?? "As informações preenchidas serão perdidas.",

                showCancelButton: true,
                cancelButtonText: "Voltar",
                confirmButtonText: "Continuar",
            });

            if (res.isConfirmed)
                props.callBack?.();
        }

        else
            props.callBack?.();
    }

    async function getRequestBody() {
        const body: {[ k : string ] : any } = {};

        for ( const param of paramMap.keys() ) {
            body[param] = await getParamValue(param);
        }

        return body;
    }

    async function handleConfirm() {
        const body = await getRequestBody();

        console.dir(body)

        await props.requisition(body);
        await props.callBack?.();
    }
};

export type UniversiForm2Props = PropsWithChildren<{
    title: string;
    asModal?: boolean;

    requisition: ( params: NonNullable<any> ) => any;
    callBack?: () => any;

    actions?: {
        cancel?: {
            can?: boolean;
            showPopup?: boolean;
            popupTitle?: string;
            popupText?: string;

            buttonText?: string;
            buttonColor?: {
                background?: string;
                text?: string;
            };
        };

        confirm?: {
            buttonText?: string;
            buttonColor?: {
                background?: string;
                text?: string;
            };
        }
    };
}>;
