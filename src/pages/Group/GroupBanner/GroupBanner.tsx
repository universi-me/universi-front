import "./GroupBanner.css"

export type GroupBannerProps = {
    /**
     * Bar content on CSS. Can be a color (e.g. "#4E4E4E") or image (e.g. "url(/api/group_header_image.png)")
     */
    bannerContent: string;
};

export function GroupBanner(props: GroupBannerProps) {
    return (
        <div id="group-banner" style={{
            backgroundColor: props.bannerContent,
            backgroundImage: props.bannerContent
        }} />
    );
}
