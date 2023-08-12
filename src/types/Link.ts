import { Profile } from "@/types/Profile";

export type Link = {
    id:       number;
    name:     string;
    url:      string;
    typeLink: TypeLink;
    perfil:   Profile;
};

export type TypeLink = "LINK" | "GITHUB" | "GIT" | "TWITTER" | "WORDPRESS" | "TELEGRAM" | "INSTAGRAM" | "REDDIT"
                     | "LINKEDIN" | "DISCORD" | "PAYPAL" | "WHATSAPP" | "TRELLO" | "SLACK" | "SPOTIFY" | "YOUTUBE"
                     | "SKYPE" | "STACK" | "FACEBOOK";

export const TypeLinkToLabel = {
    "LINK":      "Link",
    "GITHUB":    "GitHub",
    "GIT":       "Git",
    "TWITTER":   "Twitter",
    "WORDPRESS": "Wordpress",
    "TELEGRAM":  "Telegram",
    "INSTAGRAM": "Instagram",
    "REDDIT":    "Reddit",
    "LINKEDIN":  "LinkedIn",
    "DISCORD":   "Discord",
    "PAYPAL":    "Paypal",
    "WHATSAPP":  "Whatsapp",
    "TRELLO":    "Trello",
    "SLACK":     "Slack",
    "SPOTIFY":   "Spotify",
    "YOUTUBE":   "Youtube",
    "SKYPE":     "Skype",
    "STACK":     "Stack Overflow",
    "FACEBOOK":  "Facebook",
};

export const TypeLinkToBootstrapIcon = {
    "LINK":      "link-45deg",
    "GITHUB":    "github",
    "GIT":       "git",
    "TWITTER":   "twitter",
    "WORDPRESS": "wordpress",
    "TELEGRAM":  "telegram",
    "INSTAGRAM": "instagram",
    "REDDIT":    "reddit",
    "LINKEDIN":  "linkedin",
    "DISCORD":   "discord",
    "PAYPAL":    "paypal",
    "WHATSAPP":  "whatsapp",
    "TRELLO":    "trello",
    "SLACK":     "slack",
    "SPOTIFY":   "spotify",
    "YOUTUBE":   "youtube",
    "SKYPE":     "skype",
    "STACK":     "stack-overflow",
    "FACEBOOK":  "facebook",
};
