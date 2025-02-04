import { IMG_DEFAULT_BANNER, IMG_DEFAULT_CONTENT, IMG_DEFAULT_GROUP } from "@/utils/assets";
import { isAbsoluteUrl } from "./regexUtils";

export function groupBannerUrl(group: Group.DTO) {
    if(!group.bannerImage)
        return IMG_DEFAULT_BANNER;

    if (group.bannerImage.startsWith("/")) {
        return import.meta.env.VITE_UNIVERSIME_API + group.bannerImage;
    }

    return `${import.meta.env.VITE_UNIVERSIME_API}/group/banner/${group.id}`;
}

export function groupHeaderUrl(group: Group.DTO): Optional<string> {
    if(group.headerImage) {
        return `${import.meta.env.VITE_UNIVERSIME_API}/group/header/${group.id}`;
    }

    if (group.organization)
        return groupHeaderUrl(group.organization);

    return undefined;
}

export function groupImageUrl(group: Group.DTO) {
    if(!group.image)
        return IMG_DEFAULT_GROUP;

    if (group.image.startsWith("/")) {
        return import.meta.env.VITE_UNIVERSIME_API + group.image;
    }

    return `${import.meta.env.VITE_UNIVERSIME_API}/group/image/${group.id}`;
}

export function contentImageUrl(content: Capacity.Folder.DTO) {
    if (!content.image)
        return IMG_DEFAULT_CONTENT;

    return isAbsoluteUrl(content.image)
        ? content.image
        : import.meta.env.VITE_UNIVERSIME_API + content.image;
}

function isApiError( data: any ): data is Api.ResponseError {
    return typeof data === "object"
        && "timestamp" in data
        && typeof data.timestamp === "number"
        && "errors" in data
        && Array.isArray( data.errors )
        && data.errors.every( ( e: any ) => typeof e === "string" )
        && "status" in data
        && typeof data.status === "object"
        && "code" in data.status
        && typeof data.status.code === "number"
        && "description" in data.status
        && typeof data.status.description === "string"
}

export class ApiResponse<T> {
    constructor( private readonly response: Api.Response<T> ) { }
    static new<T>( response: Api.Response<T> ) {
        return new ApiResponse<T>( response );
    }

    isSuccess(): this is SuccessfulApiResponse<T> {
        return this.status.toString().startsWith( "2" );
    }

    get status() {
        return isApiError( this.data )
            ? ( this.response as Api.ResponseError ).status.code
            : this.response.status as number;
    }

    get body(): T | undefined {
        return this.data;
    }

    get data(): T | undefined {
        return "data" in this.response && !isApiError( this.response.data )
            ? this.response.data
            : undefined;
    }

    get error() {
        if ( isApiError( this.data ) ) {
            const err = this.response as Api.ResponseError;
            return {
                timestamp: new Date( err.timestamp ),
                errors: err.errors,
            }
        }

        return undefined;
    }
}

interface SuccessfulApiResponse<T> {
    data: T;
    body: T;
    error: undefined;
}
