"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initErrorMiddleware = exports.notFoundMiddleware = void 0;
const node_http_1 = require("node:http");
// Funzione che restituisce una stringa dell'errore inserito come parametro o una stringa vuota.
function getErrorMessage(error) {
    if (error.stack) {
        return error.stack;
    }
    if (typeof error.toString === "function") {
        return error.toString();
    }
    return "";
}
function isErrorStatusCode(statusCode) {
    return statusCode >= 400 && statusCode < 600;
}
function getHttpStatusCode(error, response) {
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
const notFoundMiddleware = (request, response, next) => {
    response.status(404);
    next(`Cannot ${request.method} ${request.path}`);
};
exports.notFoundMiddleware = notFoundMiddleware;
function initErrorMiddleware(appEnvironment) {
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
            error: node_http_1.STATUS_CODES[statusCode + ""],
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
exports.initErrorMiddleware = initErrorMiddleware;
//# sourceMappingURL=error.js.map