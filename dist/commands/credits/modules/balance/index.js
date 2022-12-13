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
const database_1 = __importDefault(require("../../../../handlers/database"));
const deferReply_1 = __importDefault(require("../../../../handlers/deferReply"));
const baseEmbeds_1 = require("../../../../helpers/baseEmbeds");
const logger_1 = __importDefault(require("../../../../middlewares/logger"));
// 1. Export a builder function.
const builder = (command) => {
    return command
        .setName("balance")
        .setDescription(`Check balance`)
        .addUserOption((option) => option.setName("target").setDescription(`Account you want to check`));
};
exports.builder = builder;
// 2. Export an execute function.
const execute = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Defer reply as ephemeral.
    yield (0, deferReply_1.default)(interaction, true);
    // 2. Destructure interaction object.
    const { options, user, guild } = interaction;
    if (!guild)
        throw new Error("Server unavailable");
    if (!user)
        throw new Error("User unavailable");
    if (!options)
        throw new Error("Options unavailable");
    // 3. Get options from interaction.
    const target = options.getUser("target");
    // 4. Create base embeds.
    const EmbedSuccess = yield (0, baseEmbeds_1.success)(guild, ":credit_card:︱Balance");
    // 5. Upsert the user in the database.
    const createGuildMember = yield database_1.default.guildMember.upsert({
        where: {
            userId_guildId: {
                userId: (target || user).id,
                guildId: guild.id,
            },
        },
        update: {},
        create: {
            user: {
                connectOrCreate: {
                    create: {
                        id: (target || user).id,
                    },
                    where: {
                        id: (target || user).id,
                    },
                },
            },
            guild: {
                connectOrCreate: {
                    create: {
                        id: guild.id,
                    },
                    where: {
                        id: guild.id,
                    },
                },
            },
        },
        include: {
            user: true,
            guild: true,
        },
    });
    logger_1.default.silly(createGuildMember);
    // 6. Send embed.
    yield interaction.editReply({
        embeds: [
            EmbedSuccess.setDescription(target
                ? `${target} has ${createGuildMember.creditsEarned} coins in his account.`
                : `You have ${createGuildMember.creditsEarned} coins in your account.`),
        ],
    });
});
exports.execute = execute;
