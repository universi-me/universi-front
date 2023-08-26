import { HTMLAttributes } from "react";
import "./ProfileImage.css"

export type ProfileImageProps = HTMLAttributes<HTMLElement> & {
    imageUrl: string | null | undefined;
    noImageColor?: string;
};

const DEFAULT_NO_IMAGE_COLOR = "#8A8A8A";

export function ProfileImage(props: ProfileImageProps) {
    const {imageUrl, noImageColor, ...genericElementProps} = props;
    const className = `profile-image-component ${genericElementProps.className}`

    return (
        imageUrl
            ? <img {...genericElementProps} className={className} src={imageUrl} />
            : <div {...genericElementProps} className={className} style={{backgroundColor: DEFAULT_NO_IMAGE_COLOR}} />
    );
}
