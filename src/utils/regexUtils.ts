import { removeFalsy } from "./arrayUtils";

export function isEmail(str: string) {
    return !!emailPattern.exec(str);
}

/** Checks if the string starts with a URL Scheme followed by `://`
 *
 * See https://url.spec.whatwg.org/#url-scheme-string */
export function isAbsoluteUrl(str: string) {
    return !!urlSchemePattern.exec(str);
}

/** Gets the id of a YouTube video from a URL, if it's a YouTube video URL */
export function getYouTubeVideoIdFromUrl(str: string) {
    const match = youTubeVideoUrlPattern.exec(str);
    if (match) return removeFalsy(match)[1];
    else return undefined;
}

/** Email regex pattern got from https://emailregex.com/index.html */
const emailPattern = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

/** Checks if the string starts with a URL Scheme (https://url.spec.whatwg.org/#url-scheme-string) */
const urlSchemePattern = /^[a-z][-+.a-z0-9]*:\/\//i

/** Checks if a string is a YouTube video URL */
const youTubeVideoUrlPattern = /^(?:https:\/\/)?(?:(?:(?:[a-z0-9]+\.)?youtube\.com\/watch\?v=([-A-Za-z0-9_]{11,}))|(?:youtu\.be\/([-A-Za-z0-9_]{11,})))/;
