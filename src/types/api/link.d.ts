namespace Link {
    type DTO = {
        id: string;
        typeLink: TypeLink;
        url: string;
        name: string;
    };

    type Type = "LINK" | "GITHUB" | "GIT" | "TWITTER" | "WORDPRESS" | "TELEGRAM" | "INSTAGRAM" | "REDDIT"
              | "LINKEDIN" | "DISCORD" | "PAYPAL" | "WHATSAPP" | "TRELLO" | "SLACK" | "SPOTIFY" | "YOUTUBE"
              | "SKYPE" | "STACK" | "FACEBOOK";
}
