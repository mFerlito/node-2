"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
jest.mock("./passport", () => {
    const originalModule = jest.requireActual("./passport");
    const checkAuthorization = (request, response, next) => {
        next();
    };
    // Qui si indica che si prendono tutti gli export del modulo originale e si sovrascrivono quelli indicati con quelli definiti in questo file
    return {
        __esModule: true,
        ...originalModule,
        checkAuthorization,
    };
});
//# sourceMappingURL=passport.mock.js.map