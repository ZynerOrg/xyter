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
// Modules
const give_1 = __importDefault(require("./modules/give"));
const giveaway_1 = __importDefault(require("./modules/giveaway"));
const set_1 = __importDefault(require("./modules/set"));
const take_1 = __importDefault(require("./modules/take"));
const transfer_1 = __importDefault(require("./modules/transfer"));
exports.default = {
    builder: (group) => {
        return group
            .setName("credits")
            .setDescription("Manage the credits of a user.")
            .addSubcommand(give_1.default.builder)
            .addSubcommand(set_1.default.builder)
            .addSubcommand(take_1.default.builder)
            .addSubcommand(transfer_1.default.builder)
            .addSubcommand(giveaway_1.default.builder);
    },
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        switch (interaction.options.getSubcommand()) {
            case "give":
                yield give_1.default.execute(interaction);
                break;
            case "set":
                yield set_1.default.execute(interaction);
                break;
            case "take":
                yield take_1.default.execute(interaction);
                break;
            case "transfer":
                yield transfer_1.default.execute(interaction);
                break;
            case "giveaway":
                yield giveaway_1.default.execute(interaction);
                break;
            default:
                throw new Error("No module found for that specific command");
        }
    }),
};
