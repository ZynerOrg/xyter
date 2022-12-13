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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.options = void 0;
/* eslint-disable no-loops/no-loops */
const date_fns_1 = require("date-fns");
const database_1 = __importDefault(require("../../handlers/database"));
const logger_1 = __importDefault(require("../../middlewares/logger"));
exports.options = {
    schedule: "*/30 * * * *", // https://crontab.guru/
};
// Execute the job
const execute = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    const cooldownsObj = yield database_1.default.cooldown.findMany();
    try {
        for (var _d = true, cooldownsObj_1 = __asyncValues(cooldownsObj), cooldownsObj_1_1; cooldownsObj_1_1 = yield cooldownsObj_1.next(), _a = cooldownsObj_1_1.done, !_a;) {
            _c = cooldownsObj_1_1.value;
            _d = false;
            try {
                const cooldownObj = _c;
                const { guildId, userId, timeoutId, cooldown, createdAt } = cooldownObj;
                const dueDate = (0, date_fns_1.add)(createdAt, { seconds: cooldown });
                if (!(0, date_fns_1.isPast)(dueDate))
                    return;
                const duration = (0, date_fns_1.formatDuration)((0, date_fns_1.intervalToDuration)({
                    start: new Date(),
                    end: dueDate,
                }));
                const deleteCooldown = yield database_1.default.cooldown.delete({
                    where: {
                        guildId_userId_timeoutId: {
                            guildId,
                            userId,
                            timeoutId,
                        },
                    },
                });
                logger_1.default.silly(deleteCooldown);
                logger_1.default.verbose(`User ${userId} is on cooldown for ${timeoutId}, it ends in ${duration}.`);
            }
            finally {
                _d = true;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = cooldownsObj_1.return)) yield _b.call(cooldownsObj_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
});
exports.execute = execute;
