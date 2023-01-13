"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const config_1 = __importDefault(require("./config"));
const port = config_1.default.PORT;
app_1.app.listen(port, () => console.log(`running at localhost:${port}`));
//# sourceMappingURL=server.js.map