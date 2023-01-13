// Questo file serve a facilitare la validazione delle richieste al server
// PACCHETTI:  express-validator-middleware, ajv-formats, @sinclair/typebox
import addFormats from "ajv-formats";
import { Validator, ValidationError } from "express-json-validator-middleware";
import { ErrorRequestHandler } from "express";

// Il valore coerceTypes true serve per permettere la conversione ad esempio da stringa (json) a numero, quando richiesto
const validator = new Validator({
  coerceTypes: true,
});

addFormats(validator.ajv, ["date-time"])
  .addKeyword("kind")
  .addKeyword("modifyer");

export const validate = validator.validate;

export const validationErrorMiddleware: ErrorRequestHandler = (
  error,
  request,
  response,
  next
) => {
  if (error instanceof ValidationError) {
    response.status(422).send({
      errors: error.validationErrors,
    });

    next();
  } else {
    next(error);
  }
};

export * from "./planet";
