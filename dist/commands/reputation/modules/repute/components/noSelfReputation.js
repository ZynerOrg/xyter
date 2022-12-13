"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (to, from) => {
    if ((from === null || from === void 0 ? void 0 : from.id) === (to === null || to === void 0 ? void 0 : to.id)) {
        throw new Error("You can only repute other users");
    }
};
