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
exports.execute = void 0;
const database_1 = __importDefault(require("../../../../handlers/database"));
const dueForPayment_1 = require("./components/dueForPayment");
const overDueForPayment_1 = require("./components/overDueForPayment");
// Execute the roles function
const execute = (client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    const roles = yield database_1.default.guildShopRoles.findMany();
    try {
        for (var _d = true, roles_1 = __asyncValues(roles), roles_1_1; roles_1_1 = yield roles_1.next(), _a = roles_1_1.done, !_a;) {
            _c = roles_1_1.value;
            _d = false;
            try {
                const role = _c;
                const { lastPayed } = role;
                const nextPayment = new Date(lastPayed.setHours(lastPayed.getHours() + 1));
                const now = new Date();
                if (nextPayment > now) {
                    (0, dueForPayment_1.execute)(client, role);
                    return;
                }
                if (nextPayment < now) {
                    yield (0, overDueForPayment_1.execute)(client, role);
                }
            }
            finally {
                _d = true;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = roles_1.return)) yield _b.call(roles_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
});
exports.execute = execute;
