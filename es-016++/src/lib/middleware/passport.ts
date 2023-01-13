// Questo file serve alla gestione dell'autenticazione
// Sono stati installati i pacchetti:
// passport, @types/passport
// passport-github2 (login con GitHub), @types/passport-github2
// express-session (utente loggato), @types/express-session

import passport from "passport";
import passportGitHub2 from "passport-github2";
import { RequestHandler } from "express"; // Per Controllare l'autorizzazione (utente loggato)

import config from "../../config";

// Strategy è il verbo che serve per le diverse forme di autenticazione, in questo caso con GitHub
const githubStrategy = new passportGitHub2.Strategy(
  {
    clientID: config.GITHUB_CLIENT_ID,
    clientSecret: config.GITHUB_CLIENT_SECRET,
    callbackURL: config.GITHUB_CALLBACK_URL,
  },
  // In questa funzione si specificano i tipi perchè alcuni di quelli preimpostati nella libreria sono sbagliati
  function (
    accessToken: string,
    refreshToken: string,
    profile: { [key: string]: string },
    done: (error: null, user: Express.User) => void
  ) {
    // Il tipo Express.User è stato creato da noi in index.d.ts
    const user: Express.User = {
      username: profile.username,
    };

    done(null, user);
  }
);

passport.use(githubStrategy);

// Passando a passport.serializeUser il dato di tipo Express.User (creato da noi in index.d.ts)
// Si salva nella sessione (vedere  session.ts) l'utente attivo
passport.serializeUser<Express.User>((user, done) => done(null, user));

// Con questa invece si recupera l'utente salvato per poterlo usare quando serve
passport.deserializeUser<Express.User>((user, done) => done(null, user));

// Questo controlla l'utente sia autenticato
const checkAuthorization: RequestHandler = (request, response, next) => {
  if (request.isAuthenticated()) {
    return next();
  }

  response.status(401).end();
};

export { passport, checkAuthorization };
