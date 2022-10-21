import { BaseInteraction, PermissionResolvable } from "discord.js";

export default async (
  interaction: BaseInteraction,
  permission: PermissionResolvable
) => {
  if (!interaction.memberPermissions)
    throw new Error("Could not check user for permissions");

  if (!interaction.memberPermissions.has(permission))
    throw new Error("Permission denied");
};
