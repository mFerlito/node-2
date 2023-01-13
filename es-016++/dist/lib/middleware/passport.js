"use strict";
// Questo file serve alla gestione dell'autenticazione
// Sono stati installati i pacchetti:
// passport, @types/passport
// passport-github2 (login con GitHub), @types/passport-github2
// express-session (utente loggato), @types/express-session
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuthorization = exports.passport = void 0;
const passport_1 = __importDefault(require("passport"));
exports.passport = passport_1.default;
const passport_github2_1 = __importDefault(require("passport-github2"));
const config_1 = __importDefault(require("../../config"));
// Strategy è il verbo che serve per le diverse forme di autenticazione, in questo caso con GitHub
const githubStrategy = new passport_github2_1.default.Strategy({
    clientID: config_1.default.GITHUB_CLIENT_ID,
    clientSecret: config_1.default.GITHUB_CLIENT_SECRET,
    callbackURL: config_1.default.GITHUB_CALLBACK_URL,
}, 
// In questa funzione si specificano i tipi perchè alcuni di quelli preimpostati nella libreria sono sbagliati
function (accessToken, refreshToken, profile, done) {
    // Il tipo Express.User è stato creato da noi in index.d.ts
    const user = {
        username: profile.username,
    };
    done(null, user);
});
passport_1.default.use(githubStrategy);
// Passando a passport.serializeUser il dato di tipo Express.User (creato da noi in index.d.ts)
// Si salva nella sessione (vedere  session.ts) l'utente attivo
passport_1.default.serializeUser((user, done) => done(null, user));
// Con questa invece si recupera l'utente salvato per poterlo usare quando serve
passport_1.default.deserializeUser((user, done) => done(null, user));
// Questo controlla l'utente sia autenticato
const checkAuthorization = (request, response, next) => {
    if (request.isAuthenticated()) {
        return next();
    }
    response.status(401).end();
};
exports.checkAuthorization = checkAuthorization;
//# sourceMappingURL=passport.js.map