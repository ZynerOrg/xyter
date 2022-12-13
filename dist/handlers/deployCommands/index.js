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
const logger_1 = __importDefault(require("../../middlewares/logger"));
exports.default = (client) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Destructure the client.
    const { application } = client;
    if (!application)
        throw new Error("No application found");
    // 2. Log that we are starting the command management.
    logger_1.default.info("🔧 Started command deployment");
    // 3. Get the commands.
    const commands = [];
    client.commands.forEach((command) => {
        commands.push(command.builder.toJSON());
        logger_1.default.verbose(`🔧 Loaded command "${command.builder.name}"`);
    });
    // 4. Set the commands.
    yield application.commands.set(commands).then(() => {
        logger_1.default.info("🔧 Deployed commands globally");
    });
    // 5. Tell the user that development mode is enabled.
    if (process.env.NODE_ENV === "development") {
        logger_1.default.info("🔧 Development mode enabled");
        yield application.commands
            .set(commands, process.env.DISCORD_GUILD_ID)
            .then(() => {
            logger_1.default.info(`🔧 Deployed commands to guild`);
        });
    }
    // 6. Log that we are done with the command management.
    logger_1.default.info("🔧 Finished command deployment");
});
