"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.builder = void 0;
const chance_1 = __importDefault(require("chance"));
const database_1 = __importDefault(require("../../../../handlers/database"));
const deferReply_1 = __importDefault(require("../../../../handlers/deferReply"));
const baseEmbeds_1 = require("../../../../helpers/baseEmbeds");
const give_1 = __importDefault(require("../../../../helpers/credits/give"));
const cooldown_1 = __importDefault(require("../../../../middlewares/cooldown"));
const logger_1 = __importDefault(require("../../../../middlewares/logger"));
// 1. Export a builder function.
const builder = (command) => {
    return command.setName("work").setDescription(`Work to earn credits`);
};
exports.builder = builder;
// 2. Export an execute function.
const execute = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Defer reply as ephemeral.
    yield (0, deferReply_1.default)(interaction, true);
    // 2. Destructure interaction object.
    const { guild, user, commandId } = interaction;
    if (!guild)
        throw new Error("Guild not found");
    if (!user)
        throw new Error("User not found");
    // 3. Create base embeds.
    const EmbedSuccess = yield (0, baseEmbeds_1.success)(guild, "[:dollar:] Work");
    // 4. Create new Chance instance.
    const chance = new chance_1.default();
    // 5. Upsert the guild in the database.
    const createGuild = yield database_1.default.guild.upsert({
        where: {
            id: guild.id,
        },
        update: {},
        create: {
            id: guild.id,
        },
    });
    logger_1.default.silly(createGuild);
    if (!createGuild)
        throw new Error("Guild not found");
    // 6. Create a cooldown for the user.
    yield (0, cooldown_1.default)(guild, user, commandId, createGuild.creditsWorkTimeout);
    // 6. Generate a random number between 0 and creditsWorkRate.
    const creditsEarned = chance.integer({
        min: 0,
        max: createGuild.creditsWorkRate,
    });
    const upsertGuildMember = yield (0, give_1.default)(guild, user, creditsEarned);
    // 8. Send embed.
    yield interaction.editReply({
        embeds: [
            EmbedSuccess.setDescription(`You worked and earned **${creditsEarned}** credits! You now have **${upsertGuildMember.creditsEarned}** credits. :tada:`),
        ],
    });
});
exports.execute = execute;
