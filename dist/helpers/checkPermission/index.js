"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (interaction, permission) => {
    if (!interaction.memberPermissions)
        throw new Error("Could not check user for permissions");
    if (!interaction.memberPermissions.has(permission))
        throw new Error("Permission denied");
};
