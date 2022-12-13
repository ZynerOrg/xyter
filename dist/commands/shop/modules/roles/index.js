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
// Handlers
// Modules
const buy_1 = __importDefault(require("./modules/buy"));
const cancel_1 = __importDefault(require("./modules/cancel"));
const database_1 = __importDefault(require("../../../../handlers/database"));
exports.default = {
    builder: (group) => {
        return (group
            .setName("roles")
            .setDescription("Shop for custom roles.")
            // Modules
            .addSubcommand(buy_1.default.builder)
            .addSubcommand(cancel_1.default.builder));
    },
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        if (!interaction.guild)
            return;
        const { options, guild } = interaction;
        const getGuild = yield database_1.default.guild.findUnique({
            where: { id: guild.id },
        });
        if (!getGuild)
            throw new Error("Guild not found");
        if (!getGuild.shopRolesEnabled)
            throw new Error("This server has disabled shop roles.");
        if ((options === null || options === void 0 ? void 0 : options.getSubcommand()) === "buy") {
            yield buy_1.default.execute(interaction);
        }
        if ((options === null || options === void 0 ? void 0 : options.getSubcommand()) === "cancel") {
            yield cancel_1.default.execute(interaction);
        }
    }),
};
