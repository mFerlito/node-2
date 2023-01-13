// Questo file serve a far risultare sempre autenticato l'utente durante i test, in modo che il controllo non generi errori
import { RequestHandler } from "express";

jest.mock("./passport", () => {
  const originalModule = jest.requireActual("./passport");

  const checkAuthorization: RequestHandler = (request, response, next) => {
    next();
  };

  // Qui si indica che si prendono tutti gli export del modulo originale e si sovrascrivono quelli indicati con quelli definiti in questo file
  return {
    __esModule: true,
    ...originalModule,
    checkAuthorization,
  };
});
