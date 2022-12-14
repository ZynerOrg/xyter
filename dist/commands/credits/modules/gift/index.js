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
const transfer_1 = __importDefault(require("../../../../helpers/credits/transfer"));
const logger_1 = __importDefault(require("../../../../middlewares/logger"));
// 1. Export a builder function.
const builder = (command) => {
    return command
        .setName("gift")
        .setDescription(`Gift credits to an account`)
        .addUserOption((option) => option
        .setName("account")
        .setDescription("The account you gift to")
        .setRequired(true))
        .addIntegerOption((option) => option
        .setName("credits")
        .setDescription("How much you gift")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100000000))
        .addStringOption((option) => option
        .setName("message")
        .setDescription("Your personalized message to the account"));
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
    // 3. Get options from interaction.
    const account = options.getUser("account");
    const credits = options.getInteger("credits");
    const message = options.getString("message");
    if (!account)
        throw new Error("Account unavailable");
    if (typeof credits !== "number")
        throw new Error("You need to enter a valid number of credits to gift");
    // 4. Create base embeds.
    const receiverEmbed = yield (0, baseEmbeds_1.success)(guild, `:credit_card:︱You received a gift from ${user.username}`);
    // 5. Start an transaction of the credits.
    yield (0, transfer_1.default)(guild, user, account, credits);
    const receiverGuildMember = yield database_1.default.guildMember.upsert({
        where: {
            userId_guildId: {
                userId: account.id,
                guildId: guild.id,
            },
        },
        update: {},
        create: {
            user: {
                connectOrCreate: {
                    create: {
                        id: account.id,
                    },
                    where: {
                        id: account.id,
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
    logger_1.default.silly(receiverGuildMember);
    if (message)
        receiverEmbed.setFields({ name: "Message", value: message });
    // 6. Tell the target that they have been gifted credits.
    yield account.send({
        embeds: [
            receiverEmbed.setDescription(`You received a gift containing ${credits} coins from ${user}! You now have ${receiverGuildMember.creditsEarned} coins in balance!`),
        ],
    });
    const senderGuildMember = yield database_1.default.guildMember.upsert({
        where: {
            userId_guildId: {
                userId: user.id,
                guildId: guild.id,
            },
        },
        update: {},
        create: {
            user: {
                connectOrCreate: {
                    create: {
                        id: user.id,
                    },
                    where: {
                        id: user.id,
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
    logger_1.default.silly(senderGuildMember);
    const senderEmbed = yield (0, baseEmbeds_1.success)(guild, ":credit_card:︱Send a gift");
    if (message)
        senderEmbed.setFields({ name: "Message", value: message });
    // 7. Tell the sender that they have gifted the credits.
    yield interaction.editReply({
        embeds: [
            senderEmbed.setDescription(`Your gift has been sent to ${account}. You now have ${senderGuildMember.creditsEarned} coins in balance!`),
        ],
    });
});
exports.execute = execute;
