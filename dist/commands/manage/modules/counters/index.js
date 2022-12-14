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
const add_1 = __importDefault(require("./modules/add"));
const remove_1 = __importDefault(require("./modules/remove"));
exports.default = {
    builder: (group) => {
        return group
            .setName("counters")
            .setDescription("Manage guild counters.")
            .addSubcommand(add_1.default.builder)
            .addSubcommand(remove_1.default.builder);
    },
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        const { options } = interaction;
        switch (options.getSubcommand()) {
            case "add": {
                yield add_1.default.execute(interaction);
                break;
            }
            case "remove": {
                yield remove_1.default.execute(interaction);
                break;
            }
            default: {
                throw new Error("Could not found a module for that command.");
            }
        }
    }),
};
