
/** Generic object interface */
export interface HashMap<T = any> {
    [key: string]: T;
}

/** Generic data type with identity information */
export interface Identity extends HashMap {
    id: string | number;
    name: string;
}

/** Details about a floating menu */
export interface FloatingMenuDetails {
    id: string;
    name: string;
    items: MenuItem[];
}

export interface MenuItem {
    id: string;
    /** Name of the menu item */
    name: string;
    /** Grouping associated with the menu item */
    group: string;
    /** Supplementary details for the menu. e.g. Hotkey info */
    details: string;
    /** Action to perform when the user interacts with the menu item */
    action: () => void;
}

export interface MapRegion {
    /** Name of the region */
    name: string;
    /** Color to display region in on overlay */
    color: string;
    /** Array of points that define the shape of the region */
    points: [number, number][];
    /** Height of the  region */
    height: number;
    /** Width of the region */
    width: number;
    /** HTML element associated with the map region */
    content: HTMLElement;
}
