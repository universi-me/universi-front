import { useContext, useEffect, useState } from "react";
import { type ReactCropperProps } from "react-cropper";

import CropperComponent from "@/components/ImageCropper/ImageCropper";
import MaterialIcon from "@/components/MaterialIcon";
import { arrayBufferToBase64 } from "@/utils/fileUtils";

import { UniversiFormContext } from "../../UniversiFormContext";
import { RequiredIndicator } from "../../utils";

import styles from "./UniversiFormImageInput.module.less";
import formStyles from "../../UniversiForm.module.less";


export function UniversiFormImageInput( props: Readonly<UniversiFormImageInputProps> ) {
    const { param, validations, required, defaultValue, label, aspectRatio, onChange } = props;
    const context = useContext( UniversiFormContext );

    const [ value, setValue ] = useState<Optional<string | File>>( defaultValue );
    const [ imageToCrop, setImageToCrop ] = useState<string>();
    const [ imageSrc, setImageSrc ] = useState( typeof defaultValue === "string" ? defaultValue : undefined );

    useEffect(
        () => context?.initialize( param, value, { functions: validations, required: required } ),
        [ required, validations ]
    );

    return <fieldset className={ formStyles.fieldset }>
        <legend>{ label } <RequiredIndicator required={ required } /></legend>
            <div className={ styles.img_wrapper }>
            <label htmlFor={ param } className={ styles.preview_label }>
            { imageSrc
                ? <img src={ imageSrc } className={ styles.preview }/>
                : <div className={ styles.no_image }><MaterialIcon icon="image" className={ styles.icon } /></div>
            }
            </label>

            <input
                type="file"
                accept="image/*"
                name={ param }
                id={ param }
                onChange={ e => handleFileChange( e.currentTarget.files?.item( 0 ) ) }
                style={{ display: "none" }}
            />
            <div className={ styles.actions }>
                <label htmlFor={ param } className={ styles.select_image }>Selecionar Imagem</label>
                {/* <button className={ styles.remove_image } onClick={ removeImage } disabled={ value === undefined }>Remover Imagem</button> */}
            </div>

            { imageToCrop !== undefined && <CropperComponent
                show={ true }
                src={ imageToCrop }
                selectImage={ handleImageCrop }
                willClose={ () => setImageToCrop( undefined ) }
                options={ { aspectRatio } }
            /> }
        </div>
    </fieldset>

    function handleFileChange( file: Possibly<File> ) {
        if ( !file ) {
            setValue( undefined );
            setImageToCrop( undefined );
            return;
        }

        const reader = new FileReader();
        reader.onloadend = async function ( this, ev ) {
            if ( ev.target?.readyState !== FileReader.DONE || !ev.target.result )
                return;

            const buffer = await file.arrayBuffer();
            setImageToCrop( getImageDataUrl( file.type, buffer ) );
        };

        reader.readAsArrayBuffer( file );
    }

    async function handleImageCrop( image: Blob ) {
        const buffer = await image.arrayBuffer();

        const slashIndex = image.type.lastIndexOf( "/" );

        const file = new File( [ image ], `${ param }.${ image.type.substring( slashIndex + 1 ) }` );

        await context?.set( param, file );
        setValue( file );
        setImageSrc( getImageDataUrl( image.type, buffer ) );

        onChange?.( file );
    }

    function removeImage() {
        setValue( undefined );
        setImageSrc( undefined );
    }

    function getImageDataUrl( type: string, buffer: ArrayBuffer ) {
        return `data:${ type };base64, ${ arrayBufferToBase64( buffer ) }`;
    }
}

export type UniversiFormImageInputProps = UniversiFormFieldProps<string | File>
    & Pick<ReactCropperProps, "aspectRatio">;
