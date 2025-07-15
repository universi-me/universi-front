import { useContext } from "react";

import { GroupContext } from "@/pages/Group";
import { groupBannerUrl } from "@/utils/apiUtils";

import styles from "./GroupIntro.module.less";

export function GroupIntro() {
    const groupContext = useContext(GroupContext);

    if ( !groupContext )
        return null;

    return (
        <div className={ styles.intro }>
            <div className={ styles.banner_wrapper }>
                { groupContext.group.activity && <span className={ styles.activity_type_indicator }>
                    { groupContext.group.activity.type.name }
                </span> }
                <img className={ styles.banner_image } src={groupBannerUrl(groupContext.group)} alt=""/>
                { !groupContext.group.bannerImage && <>
                <div className={ styles.banner_overlay }></div>
                <h3 className={ styles.name }>
                    { groupContext.group.name }
                </h3>
                </> }
            </div>
        </div>
    );
}
