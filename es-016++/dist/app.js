"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
// import { PrismaClient } from "@prisma/client";
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const validation_1 = require("./lib/middleware/validation");
const cors_1 = require("./lib/middleware/cors");
const session_1 = require("./lib/middleware/session");
const passport_1 = require("./lib/middleware/passport");
const error_1 = require("./lib/middleware/error");
const planets_1 = __importDefault(require("./routes/planets")); 
const auth_1 = __importDefault(require("./routes/auth"));
exports.app = (0, express_1.default)();
exports.app.use((0, session_1.initSessionMiddleware)());
exports.app.use(passport_1.passport.initialize()); 
exports.app.use(passport_1.passport.session()); 
exports.app.use(express_1.default.json());
exports.app.use((0, cors_1.initCorsMiddleware)());
exports.app.use("/planets", planets_1.default);
exports.app.use("/auth", auth_1.default);
exports.app.use(error_1.notFoundMiddleware);
exports.app.use(validation_1.validationErrorMiddleware);
exports.app.use((0, error_1.initErrorMiddleware)(exports.app.get("env")));
