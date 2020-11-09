import { COLOURS } from "./globals";
import type { HashMap, MapRegion } from "./types";

export interface FrameMessage {
    type: "backoffice";
    action: "update" | "metadata";
    name?: string;
    status?: "success" | "error";
    content: HashMap;
}

export interface RegionDetails {
    height: number;
    width: number;
    areas: MapRegion[];
}

export function isChildFrame() {
    return window.parent !== window;
}

export function retrieveData(): Promise<RegionDetails> {
    return new Promise((resolve, reject) => {
        if (isChildFrame()) {
            const onMessage = (m) => {
                if (typeof m.data !== "string") return;
                const parsed: FrameMessage = JSON.parse(m.data);
                if (parsed && parsed.type === "backoffice") {
                    const data = parsed.content;
                    resolve({
                        height: data.height,
                        width: data.width,
                        areas: (data.areas || []).map(
                            (i, idx) =>
                                ({
                                    id: i.id,
                                    color: COLOURS[idx % COLOURS.length],
                                    name: i.properties.name,
                                    capacity: i.properties.capacity,
                                    points: i.geometry.coordinates,
                                    top: i.geometry.coordinates[0][1],
                                    left: i.geometry.coordinates[0][0],
                                    right: i.geometry.coordinates[2][0],
                                    bottom: i.geometry.coordinates[2][1],
                                    height: Math.abs(
                                        i.geometry.coordinates[0][1] -
                                            i.geometry.coordinates[2][1]
                                    ),
                                    width: Math.abs(
                                        i.geometry.coordinates[0][0] -
                                            i.geometry.coordinates[2][0]
                                    ),
                                    location: {
                                        x: (i.geometry.coordinates[0][0] + i.geometry.coordinates[2][0]) / 2,
                                        y: (i.geometry.coordinates[0][1] + i.geometry.coordinates[2][1]) / 2
                                    },
                                    content: null,
                                } as any)
                        ),
                    });
                    window.removeEventListener("message", onMessage);
                }
            };
            window.addEventListener("message", onMessage);
            window.parent.postMessage(
                JSON.stringify({
                    type: "backoffice",
                    action: "load",
                    name: "map_regions",
                }),
                "*"
            );
        } else {
            reject("Application is not in an iFrame.");
        }
    });
}

export function sendMessage(msg: FrameMessage) {
    return new Promise((resolve, reject) => {
        if (isChildFrame()) {
            window.parent.postMessage(JSON.stringify(msg), "*");
            const onMessage = (m) => {
                if (typeof m.data !== "string") return;
                const parsed: FrameMessage = JSON.parse(m.data);
                if (parsed && parsed.type === "backoffice") {
                    parsed.status === "success" ? resolve() : reject();
                    window.removeEventListener("message", onMessage);
                }
            };
            window.addEventListener("message", onMessage);
        } else {
            reject("Application is not in an iFrame.");
        }
    });
}
