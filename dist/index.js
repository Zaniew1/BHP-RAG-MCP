"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = exports.startServer = void 0;
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const constants_1 = require("./utils/constants");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, morgan_1.default)(constants_1.NODE_ENV));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: "*",
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
const startServer = async (application) => {
    application.listen(constants_1.PORT, async () => {
        console.log('Server running on port: ' + constants_1.PORT + ' on ' + constants_1.NODE_ENV + ' environment');
        await (0, exports.connectToDatabase)();
    });
};
exports.startServer = startServer;
const connectToDatabase = async () => {
    try {
        console.log('Successfully connected to DB');
    }
    catch (error) {
        console.error('Could not connect to DB', error);
    }
};
exports.connectToDatabase = connectToDatabase;
(0, exports.startServer)(app);
exports.default = app;
