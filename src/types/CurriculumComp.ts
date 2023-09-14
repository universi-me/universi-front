import type { Profile } from '@/types/Profile'

// Certificar que não está faltando dado
export type Component = {
    id:             string;
    title:          string;
    description:    string;
    componentType:  ComponentType;
    profile:        Profile;
    startDate:      Date;
    endDate:        Date | null;
    presentDate:    Boolean | false;
    creationDate:   Date;
};

export type ComponentType = {
    id:           string;
    name:         string;
    creationDate: Date;
};
