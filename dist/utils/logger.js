"use strict";
// src/utils/logger.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
function formatMessage(level, message, meta) {
    return JSON.stringify({
        timestamp: new Date().toISOString(),
        level,
        message,
        ...(meta ? { meta } : {}),
    });
}
exports.logger = {
    info(message, meta) {
        console.log(formatMessage("info", message, meta));
    },
    warn(message, meta) {
        console.warn(formatMessage("warn", message, meta));
    },
    error(message, meta) {
        console.error(formatMessage("error", message, meta));
    },
    debug(message, meta) {
        if (process.env.NODE_ENV !== "production") {
            console.debug(formatMessage("debug", message, meta));
        }
    },
};
