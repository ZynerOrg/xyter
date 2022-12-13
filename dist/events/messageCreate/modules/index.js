"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const counters_1 = __importDefault(require("./counters"));
const credits_1 = __importDefault(require("./credits"));
const points_1 = __importDefault(require("./points"));
exports.default = {
    counters: counters_1.default,
    credits: credits_1.default,
    points: points_1.default,
};
