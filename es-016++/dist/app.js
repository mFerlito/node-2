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
const planets_1 = __importDefault(require("./routes/planets")); // Qui si importano tutte le routes create in planets.ts sotto router
const auth_1 = __importDefault(require("./routes/auth"));
exports.app = (0, express_1.default)();
// Questi tre gestiscono l'autenticazione
exports.app.use((0, session_1.initSessionMiddleware)()); // Crea il session middleware
exports.app.use(passport_1.passport.initialize()); // Inizializza passport middleware, configurato per l'autenticazione con GitHub
exports.app.use(passport_1.passport.session()); // Inizializza session middleware, serializza e deserializza i dati utente dopo l'accesso
exports.app.use(express_1.default.json());
// Per prevenire errori di di richieste cors (cross origin resource sharing), da inserire dopo app.use(express.json()); e prima di ogni path (es. app.get() ecc)
exports.app.use((0, cors_1.initCorsMiddleware)());
// Dopo il cors middleware, altrimenti falliranno tutti i test che richiedono il cors
// In questo modo si collegano ad app tutte le routes create in planets.ts sotto router e viene indicato che partono tutte con /planets
exports.app.use("/planets", planets_1.default);
// In questo modo si collegano ad app tutte le routes create in auth.ts sotto router e viene indicato che partono tutte con /auth
exports.app.use("/auth", auth_1.default);
// Se nessuna route corrisponde viene usato questo middleware, per questo è posizionato dopo tutte le path
exports.app.use(error_1.notFoundMiddleware);
exports.app.use(validation_1.validationErrorMiddleware);
// app.get("env") viene da express e restituisce l'ambiente (test, production, ecc)
exports.app.use((0, error_1.initErrorMiddleware)(exports.app.get("env")));
//# sourceMappingURL=app.js.map