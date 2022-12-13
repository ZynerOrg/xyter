"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.register = void 0;
const checkDirectory_1 = __importDefault(require("../../helpers/checkDirectory"));
const logger_1 = __importDefault(require("../../middlewares/logger"));
// Registers all available events.
const register = (client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    logger_1.default.info("📡 Started event management");
    const eventNames = yield (0, checkDirectory_1.default)("events");
    if (!eventNames)
        return logger_1.default.warn("No available events found");
    const totalEvents = eventNames.length;
    let loadedEvents = 0;
    logger_1.default.info(`📡 Loading ${totalEvents} events`);
    // Import an event.
    const importEvent = (name) => __awaiter(void 0, void 0, void 0, function* () {
        var _e;
        const event = yield (_e = `../../events/${name}`, Promise.resolve().then(() => __importStar(require(_e))));
        // Create a new event execute function.
        const eventExecutor = (...args) => __awaiter(void 0, void 0, void 0, function* () {
            yield event.execute(...args);
        });
        switch (event.options.type) {
            case "once":
                client.once(name, eventExecutor);
                break;
            case "on":
                client.on(name, eventExecutor);
                break;
            default:
                throw new Error(`📡 Invalid event type for event: ${name}`);
        }
        return loadedEvents++;
    });
    try {
        for (var _d = true, eventNames_1 = __asyncValues(eventNames), eventNames_1_1; eventNames_1_1 = yield eventNames_1.next(), _a = eventNames_1_1.done, !_a;) {
            _c = eventNames_1_1.value;
            _d = false;
            try {
                const eventName = _c;
                yield importEvent(eventName).then(() => {
                    return logger_1.default.verbose(`📡 Loaded event "${eventName}"`);
                });
                if (loadedEvents === totalEvents) {
                    return logger_1.default.info("📡 All events loaded");
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
            if (!_d && !_a && (_b = eventNames_1.return)) yield _b.call(eventNames_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return true;
});
exports.register = register;
