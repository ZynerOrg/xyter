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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = void 0;
const node_schedule_1 = __importDefault(require("node-schedule"));
const checkDirectory_1 = __importDefault(require("../../helpers/checkDirectory"));
const logger_1 = __importDefault(require("../../middlewares/logger"));
// Start all jobs that are in the schedules directory
const start = (client) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.info("⏰ Started job management");
    const jobNames = yield (0, checkDirectory_1.default)("schedules");
    if (!jobNames)
        return logger_1.default.warn("⏰ No available jobs found");
    return yield Promise.all(jobNames.map((jobName) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const job = yield (_a = `../../schedules/${jobName}`, Promise.resolve().then(() => __importStar(require(_a))));
        return node_schedule_1.default.scheduleJob(job.options.schedule, () => __awaiter(void 0, void 0, void 0, function* () {
            logger_1.default.verbose(`⏰ Performed the job "${jobName}"`);
            yield job.execute(client);
        }));
    })));
});
exports.start = start;
