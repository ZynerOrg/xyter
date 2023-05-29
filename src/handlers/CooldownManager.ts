import { Cooldown } from "@prisma/client";
import { Guild, User } from "discord.js";
import logger from "../utils/logger";
import prisma from "./prisma";

class CooldownManager {
  async setCooldown(
    cooldownItem: string,
    guild: Guild | null,
    user: User | null,
    cooldownSeconds: number
  ): Promise<void> {
    const expiresAt = new Date(Date.now() + cooldownSeconds * 1000);
    const data = {
      cooldownItem,
      expiresAt,
      guild: guild ? { connect: { id: guild.id } } : undefined,
      user: user ? { connect: { id: user.id } } : undefined,
    };

    const { guildCooldown, guildMemberCooldown, userCooldown } =
      await this.checkCooldowns(cooldownItem, guild, user);

    if (guildCooldown || guildMemberCooldown || userCooldown) {
      await prisma.cooldown.updateMany({
        where: {
          cooldownItem,
          expiresAt,
          guild: guild ? { id: guild.id } : undefined,
          user: user ? { id: user.id } : undefined,
        },
        data: {
          cooldownItem,
          expiresAt,
          guildId: guild ? guild.id : undefined,
          userId: user ? user.id : undefined,
        },
      });
    } else {
      await prisma.cooldown.create({ data });
    }

    if (guild && user) {
      logger.verbose(
        `Set guild member cooldown: ${cooldownItem} in guild ${guild.id} for user ${user.id}`
      );
    } else if (guild) {
      logger.verbose(
        `Set guild cooldown: ${cooldownItem} in guild ${guild.id}`
      );
    } else if (user) {
      logger.verbose(`Set user cooldown: ${cooldownItem} for user ${user.id}`);
    }
  }

  async checkCooldown(
    cooldownItem: string,
    guild: Guild | null,
    user: User | null
  ): Promise<Cooldown | null> {
    const start = Date.now();
    const where = {
      cooldownItem,
      guild: guild ? { id: guild.id } : null,
      user: user ? { id: user.id } : null,
      expiresAt: { gte: new Date() },
    };
    const cooldown = await prisma.cooldown.findFirst({ where });
    const duration = Date.now() - start;

    if (guild && user) {
      logger.verbose(
        `Checked guild member cooldown: ${cooldownItem} in guild ${guild.id} for user ${user.id}. Duration: ${duration}ms`
      );
    } else if (guild) {
      logger.verbose(
        `Checked guild cooldown: ${cooldownItem} in guild ${guild.id}. Duration: ${duration}ms`
      );
    } else if (user) {
      logger.verbose(
        `Checked user cooldown: ${cooldownItem} for user ${user.id}. Duration: ${duration}ms`
      );
    }

    return cooldown;
  }

  async checkCooldowns(
    cooldownItem: string,
    guild: Guild | null,
    user: User | null
  ): Promise<{
    guildCooldown: Cooldown | null;
    userCooldown: Cooldown | null;
    guildMemberCooldown: Cooldown | null;
  }> {
    const guildCooldown = guild
      ? await this.checkCooldown(cooldownItem, guild, null)
      : null;
    const userCooldown = await this.checkCooldown(cooldownItem, null, user);
    const guildMemberCooldown = guild
      ? await this.checkCooldown(cooldownItem, guild, user)
      : null;

    return { guildCooldown, userCooldown, guildMemberCooldown };
  }
}

export default CooldownManager;
