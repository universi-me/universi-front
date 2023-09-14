import { ChangeEvent, useState } from "react"

import { ProfileImage } from "@/components/ProfileImage/ProfileImage";
import { arrayBufferToBase64 } from "@/utils/fileUtils";

export type ManageProfileImageProps = {
    currentImage: string | null;
};

export function ManageProfileImage(props: ManageProfileImageProps) {
    const [imageBuffer, setImageBuffer] = useState<ArrayBuffer | null>(null);
    const image = imageBuffer
        ? "data:image/jpeg;base64," + arrayBufferToBase64(imageBuffer)
        : props.currentImage;

    return (
        <fieldset id="fieldset-image">
            <input id="image" name="image" accept="image/*" type="file" onChange={changeImage} />
            <label htmlFor="image"><ProfileImage imageUrl={image} /></label>
        </fieldset>
    );

    function changeImage(e: ChangeEvent<HTMLInputElement>) {
        const files = e.currentTarget.files;
        const image = files?.item(0);
        if (!files || !image)
            return;

        const reader = new FileReader();
        reader.onloadend = readerLoadImage;
        reader.readAsArrayBuffer(image);
    }

    function readerLoadImage(this: FileReader, ev: ProgressEvent<FileReader>) {
        if (ev.target?.readyState === this.DONE)
            setImageBuffer(ev.target.result as ArrayBuffer);
    }
}

export function getProfileImage() {
    return (document.getElementById("image") as HTMLInputElement)
        .files
        ?.item(0);
}
