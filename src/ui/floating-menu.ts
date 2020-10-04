import type { FloatingMenuDetails } from "../common/types";
import { openOverlay } from "./overlays";

import FloatingMenu from './FloatingMenu.svelte';

export function openFloatingMenu(target: HTMLElement, menu_details: FloatingMenuDetails, onClose: () => void) {
    return openOverlay({
        id: 'floating-menu',
        content: FloatingMenu,
        data: {
            target,
            menu_details
        },
        onClose
    });
}
