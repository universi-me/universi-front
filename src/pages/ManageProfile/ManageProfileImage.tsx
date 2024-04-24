import { ChangeEvent, useRef, useState } from "react"

import { ProfileImage } from "@/components/ProfileImage/ProfileImage";
import { arrayBufferToBase64 } from "@/utils/fileUtils";
import CropperComponent from "@/components/ImageCropper/ImageCropper";

export type ManageProfileImageProps = {
    currentImage: string | null;
    setImage(image: File | undefined): any;
};

export function ManageProfileImage(props: ManageProfileImageProps) {
    const [imageBuffer, setImageBuffer] = useState<ArrayBuffer | null>(null);
    const [mimeType, setMimeType] = useState<string>('image/jpeg');
    const [showCrop, setShowCrop] = useState<boolean>(false);
    const image = imageBuffer
        ? "data:" + mimeType + ";base64," + arrayBufferToBase64(imageBuffer)
        : props.currentImage;
    return (
        <fieldset id="fieldset-image">
            <legend className="required-input">Alterar imagem do perfil</legend>
            <input id="image" name="image" accept="image/*" type="file" onChange={changeImage} />
            <label htmlFor="image"><ProfileImage imageUrl={image} id="profile-image-view" /></label>
            <CropperComponent show={showCrop} src={image as string} selectImage={updateImage} willClose={() => setShowCrop(false)} options={{aspectRatio: 1,}} />
        </fieldset>
    );

    function changeImage(e: ChangeEvent<HTMLInputElement>) {
        const files = e.currentTarget.files;
        const image = files?.item(0);
        if (!files || !image)
            return;

        setMimeType(image.type);
        loadImageFile(new Blob([image], {type: mimeType}));
    }

    function loadImageFile(imageFile: Blob) {
        updateImage(imageFile);
        setShowCrop(true);
    }

    function updateImage(imageBlob: Blob) {
        imageBlob.arrayBuffer().then((buff) => setImageBuffer(buff))
        props.setImage(imageBlob ? new File([imageBlob], '', {type: mimeType}) : getProfileImage());
    }

    function getProfileImage() {
        return (document.getElementById("image") as HTMLInputElement)
            .files?.item(0) ?? undefined;
    }
}
