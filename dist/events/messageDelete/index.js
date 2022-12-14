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
exports.execute = exports.options = void 0;
const audits_1 = __importDefault(require("./audits"));
const counter_1 = __importDefault(require("./modules/counter"));
exports.options = {
    type: "on",
};
// Execute the function
const execute = (message) => __awaiter(void 0, void 0, void 0, function* () {
    yield audits_1.default.execute(message);
    yield (0, counter_1.default)(message);
});
exports.execute = execute;
