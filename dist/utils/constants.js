"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DATABASE_URL = exports.APP_ORIGIN = exports.APP_VERSION = exports.LLM_MODEL = exports.EMBEDDING_MODEL = exports.PORT = exports.NODE_ENV = exports.getEnv = void 0;
require("dotenv/config");
/**
 * This function parse env variables to a string.
 * If env variable is undefined it assigns default value if its provided.
 * With this function in your code, you don't need to check if such an environment variable exists
 *
 * @param {string} key Environmental variable from .env
 * @param {?string} [defaultVal] Default value if no environmental variable
 * @returns {string}
 */
const getEnv = (key, defaultVal) => {
    const value = process.env[key] || defaultVal;
    if (value === undefined) {
        throw new Error(`MIssing enviroment variable in .env file - ${key}`);
    }
    return value;
};
exports.getEnv = getEnv;
exports.NODE_ENV = (0, exports.getEnv)('NODE_ENV', 'dev');
exports.PORT = (0, exports.getEnv)('PORT', '5000');
exports.EMBEDDING_MODEL = (0, exports.getEnv)('EMBEDDING_MODEL', 'text-embedding-3-small');
exports.LLM_MODEL = (0, exports.getEnv)('EMBEDDING_MODEL', 'gpt-4o-mini');
exports.APP_VERSION = (0, exports.getEnv)('APP_VERSION', 'v1.1.1');
exports.APP_ORIGIN = (0, exports.getEnv)('APP_ORIGIN', 'http://localhost');
exports.DATABASE_URL = (0, exports.getEnv)('DATABASE_URL');
