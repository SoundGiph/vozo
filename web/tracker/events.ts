import { SearchFilter } from "../hooks/api/interfaces";

export interface SearchEventProperties {
    query: string;
    filters: SearchFilter;
}

export interface PlayEventProperties {
    id: string;
    title: string;
    description: string
}

export interface ShareEventProperties {
    id: string;
    title: string;
    description: string
}

export interface NavigateToEventProperties {
    page: string;
}