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
const axios_1 = __importDefault(require("axios"));
const discord_js_1 = require("discord.js");
const deferReply_1 = __importDefault(require("../../../../handlers/deferReply"));
const getEmbedData_1 = __importDefault(require("../../../../helpers/getEmbedData"));
exports.default = {
    builder: (command) => {
        return command
            .setName("lookup")
            .setDescription("Lookup a domain or ip. (Request sent over HTTP, proceed with caution!)")
            .addStringOption((option) => option
            .setName("query")
            .setDescription("The query you want to look up.")
            .setRequired(true));
    },
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, deferReply_1.default)(interaction, false);
        const { errorColor, successColor, footerText, footerIcon } = yield (0, getEmbedData_1.default)(interaction.guild);
        const embedTitle = "[:hammer:] Utility (Lookup)";
        const { options } = interaction;
        const query = options.getString("query");
        yield axios_1.default
            .get(`http://ip-api.com/json/${query}`)
            .then((response) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            if (response.data.status !== "success") {
                yield interaction.editReply({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setTitle(embedTitle)
                            .setFooter({
                            text: footerText,
                            iconURL: footerIcon,
                        })
                            .setTimestamp(new Date())
                            .setColor(errorColor)
                            .setFooter({ text: footerText, iconURL: footerIcon })
                            .setDescription(`${(_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.message}: ${(_b = response === null || response === void 0 ? void 0 : response.data) === null || _b === void 0 ? void 0 : _b.query}`),
                    ],
                });
                return;
            }
            yield interaction.editReply({
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setTitle(embedTitle)
                        .setFooter({
                        text: footerText,
                        iconURL: footerIcon,
                    })
                        .setTimestamp(new Date())
                        .setColor(successColor)
                        .setFields([
                        {
                            name: ":classical_building: AS",
                            value: `${response.data.as || "Unknown"}`,
                            inline: true,
                        },
                        {
                            name: ":classical_building: ISP",
                            value: `${response.data.isp || "Unknown"}`,
                            inline: true,
                        },
                        {
                            name: ":classical_building: Organization",
                            value: `${response.data.org || "Unknown"}`,
                            inline: true,
                        },
                        {
                            name: ":compass: Latitude",
                            value: `${response.data.lat || "Unknown"}`,
                            inline: true,
                        },
                        {
                            name: ":compass: Longitude",
                            value: `${response.data.lon || "Unknown"}`,
                            inline: true,
                        },
                        {
                            name: ":clock4: Timezone",
                            value: `${response.data.timezone || "Unknown"}`,
                            inline: true,
                        },
                        {
                            name: ":globe_with_meridians: Country",
                            value: `${response.data.country || "Unknown"}`,
                            inline: true,
                        },
                        {
                            name: ":globe_with_meridians: Region",
                            value: `${response.data.regionName || "Unknown"}`,
                            inline: true,
                        },
                        {
                            name: ":globe_with_meridians: City",
                            value: `${response.data.city || "Unknown"}`,
                            inline: true,
                        },
                        {
                            name: ":globe_with_meridians: Country Code",
                            value: `${response.data.countryCode || "Unknown"}`,
                            inline: true,
                        },
                        {
                            name: ":globe_with_meridians: Region Code",
                            value: `${response.data.region || "Unknown"}`,
                            inline: true,
                        },
                        {
                            name: ":globe_with_meridians: ZIP",
                            value: `${response.data.zip || "Unknown"}`,
                            inline: true,
                        },
                    ]),
                ],
            });
        }));
    }),
};
