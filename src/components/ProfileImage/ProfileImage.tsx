import { HTMLAttributes } from "react";
import { IMG_DEFAULT_PROFILE } from "@/utils/assets";
import { makeClassName } from "@/utils/tsxUtils";
import "./ProfileImage.css"
import Avatar from 'react-avatar'

export type ProfileImageProps = HTMLAttributes<HTMLElement> & {
    imageUrl: string | null | undefined;
    name: string | null | undefined;
    noImageColor?: string;
};

const DEFAULT_NO_IMAGE_COLOR = "#8A8A8A";

export function ProfileImage(props: ProfileImageProps) {
    const {imageUrl, name, noImageColor, ...genericElementProps} = props;
    const className = makeClassName("profile-image-component", genericElementProps.className);

    return imageUrl ?
        <img {...genericElementProps}
            className={className}
            src={imageUrl ?? IMG_DEFAULT_PROFILE}
        />
    :
        <div className={className}>
            <Avatar size="100%" name={name!} round={true} textSizeRatio={4} />
        </div>
}
