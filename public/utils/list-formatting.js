"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listFormatting = void 0;
function listFormatting(list) {
    return list.map((track, index) => (`<strong>${++index}. ${track === null || track === void 0 ? void 0 : track.filename}</strong>\n`)).join('');
}
exports.listFormatting = listFormatting;
;
//# sourceMappingURL=list-formatting.js.map