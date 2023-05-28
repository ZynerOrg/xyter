import { Interaction, PermissionResolvable } from "discord.js";

export default (interaction: Interaction, permission: PermissionResolvable) => {
  if (!interaction.memberPermissions)
    throw new Error("Failed to check your permissions");

  if (!interaction.memberPermissions.has(permission))
    throw new Error(`You do not have the required permission: ${permission}`);
};
