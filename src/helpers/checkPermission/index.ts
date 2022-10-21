import { BaseInteraction, PermissionResolvable } from "discord.js";

export default (
  interaction: BaseInteraction,
  permission: PermissionResolvable
) => {
  if (!interaction.memberPermissions)
    throw new Error("Could not check user for permissions");

  if (!interaction.memberPermissions.has(permission))
    throw new Error("Permission denied");
};
