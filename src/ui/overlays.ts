import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

export interface OverlayDetails<T> {
    /** Unique identifier of the overlay. Used for overriding overlays */
    id?: string;
    /** Content to render */
    content: any;
    /** Data to passed to the content being rendered */
    data: T;
    /** Whether the overlay requires a backdrop */
    backdrop?: boolean;
    /** Whether clicking with the backdrop will close the overlay */
    backdrop_close?: boolean;
    /** Handler for event on closing of overlay */
    onClose?: () => void;
    /** Handler for events from rendered element */
    onEvent?: (event: OverlayEvent) => void;
}

export interface OverlayEvent<T = any> {
    reason: 'close' | 'action' | 'done' | 'other';
    metadata: T;
}

/** Store for active overlays */
const _overlays = new BehaviorSubject<OverlayDetails<any>[]>([]);
/** Observable for active overlay contents */
export const active_overlays = _overlays.asObservable();
/** Observable for item to draw backdrop for */
export const backdrop_element = active_overlays.pipe(
    map((overlay) => overlay.find((i) => i.backdrop)?.id)
);

/**
 * Add overlay to list
 * @param details Overlay details
 */
export function openOverlay<T>(details: OverlayDetails<T>): () => void;
export function openOverlay<T>(
    details: OverlayDetails<T>,
    overlays: BehaviorSubject<OverlayDetails<any>[]> = _overlays
): () => void {
    if (!details.id) {
        details.id = `overlay-${Math.floor(Math.random() * 9999_9999)}`;
    }
    const list = [...overlays.getValue()];
    const index = list.findIndex((item) => item.id === details.id);
    if (index >= 0) {
        list.splice(index, 1, details);
    } else {
        list.push(details);
    }
    overlays.next(list);
    return () => (closeOverlay as any)(details.id, overlays);
}

/**
 * Closes an overlay
 * @param id ID of the overlay
 */
export function closeOverlay(id: string): void;
export function closeOverlay(
    id: string,
    overlays: BehaviorSubject<OverlayDetails<any>[]> = _overlays
) {
    const list = [...overlays.getValue()];
    const item = list.find(item => item.id === id);
    overlays.next(list.filter((item) => item.id !== id));
    if (item && item.onClose) {
        item.onClose();
    }

}
