"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeResponse = void 0;
function normalizeResponse(items) {
    const tracks = items.map((track) => {
        if (!track.url) {
            return null;
        }
        return {
            url: track.url,
            filename: `${track.artist} - ${track.title}`,
        };
    }).filter(Boolean);
    console.log(tracks);
    return tracks;
}
exports.normalizeResponse = normalizeResponse;
//# sourceMappingURL=normalize-response.js.map