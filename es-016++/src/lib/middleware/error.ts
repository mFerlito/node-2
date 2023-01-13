// Con questo file si imposterà che in caso di errore verrà restituito un json
// Quindi anche nei test invalidi vanno fatte delle modifiche
// in modo che si aspettino un application/json e controllino il body al posto del testo
import { STATUS_CODES } from "node:http";
import { Response, RequestHandler, ErrorRequestHandler } from "express";

interface HttpError extends Error {
  status?: number;
  statusCode?: number;
}

// Funzione che restituisce una stringa dell'errore inserito come parametro o una stringa vuota.
function getErrorMessage(error: Error) {
  if (error.stack) {
    return error.stack;
  }

  if (typeof error.toString === "function") {
    return error.toString();
  }

  return "";
}

function isErrorStatusCode(statusCode: number) {
  return statusCode >= 400 && statusCode < 600;
}

function getHttpStatusCode(error: HttpError, response: Response) {
  const statusCodeFromError = error.status || error.statusCode;
  if (statusCodeFromError && isErrorStatusCode(statusCodeFromError)) {
    return statusCodeFromError;
  }

  const statusCodeFromResponse = response.statusCode;
  if (isErrorStatusCode(statusCodeFromResponse)) {
    return statusCodeFromResponse;
  }

  return 500;
}

// Questo middleware va posizionato alla fine, per restituire una risposta valida
// nel caso non ci fosse nessuna path corrispondente a quella della richiesta
export const notFoundMiddleware: RequestHandler = (request, response, next) => {
  response.status(404);
  next(`Cannot ${request.method} ${request.path}`);
};

export function initErrorMiddleware(
  appEnvironment: string
): ErrorRequestHandler {
  return function errorMiddleware(error, request, response, next) {
    const errorMessage = getErrorMessage(error);

    // Questo viene stampato solo se non è un test, per mantenere puliti i risultati dei test
    if (appEnvironment !== "test") {
      console.error(errorMessage);
    }

    if (response.headersSent) {
      return next(error);
    }

    const statusCode = getHttpStatusCode(error, response);

    const errorResponse = {
      statusCode,
      error: STATUS_CODES[statusCode + ""],
      message: "",
    };

    // Questo messaggio viene restituito solo se ci si trova in ambiente di sviluppo,
    // perchè può contenere dati sensibili dell'applicazione
    if (appEnvironment !== "production") {
      errorResponse.message = errorMessage;
    }

    // Viene restitutito in formato json (In questo differisce dall'error handler di express)
    response.status(errorResponse.statusCode).json(errorResponse);

    next();
  };
}
