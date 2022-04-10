import pino from "pino";
import * as config from "../../config.json";

export default pino({ level: config.debug ? "debug" : "info" });
