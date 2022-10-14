// 3rd party dependencies
import { GuildMember } from "discord.js";
// Dependencies
import dropUser from "../../../helpers/deleteUserData";
import updatePresence from "../../../helpers/updatePresence";
import { IEventOptions } from "../../../interfaces/EventOptions";
import logger from "../../../middlewares/logger";
import audits from "./audits";
import leaveMessage from "./leaveMessage";

export const options: IEventOptions = {
  type: "on",
};

export const execute = async (member: GuildMember) => {
  const { client, user, guild } = member;

  logger?.silly(
    `Removed member: ${user.tag} (${user.id}) from guild: ${guild.name} (${guild.id})`
  );

  await audits.execute(member);
  await leaveMessage.execute(member);
  await dropUser(user, guild);
  await updatePresence(client);
};
