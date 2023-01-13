"use strict";
// Spostando le routes da app a qui si crea router, quindi al posto di app. si userà router.
// Dato che verrà indicato altrove (nel file app), si dovrà togliere planets dalle routes in questo file
// Poi planets.ts viene importato in app
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const multer_1 = require("../lib/middleware/multer"); // Per permettere la gestione di richieste multipart/form-data (es upload di file)
const validation_1 = require("../lib/middleware/validation");
// Per controllare che l'utente sia autenticato
// Utilizzato nelle routes che modificano il database (creano, aggiornano o eliminano pianeti)
const passport_1 = require("../lib/middleware/passport");
const client_1 = __importDefault(require("../lib/prisma/client"));
// const prisma = new PrismaClient();
const upload = (0, multer_1.initMulterMiddleware)(); // Si inizializza la variabile necessaria alla gestione delle richieste di upload di file (multipart/form-data)
const router = (0, express_1.Router)();
router.get("/", async (req, res) => {
    const planets = await client_1.default.planet.findMany();
    res.json(planets);
});
// Qui si usa prima il middleware checkAuthorization; poi, se lui usa next(), si passa al middlewarw validate
router.post("/", passport_1.checkAuthorization, (0, validation_1.validate)({ body: validation_1.planetSchema }), async (request, response) => {
    const planetData = request.body;
    // Ovviamente se c'è l'autorizzazione ci sarà l'username (settato da passport nella sessione),
    // Qui viene recuperato dalla richiesta, per poi aggiungerlo insieme agli altri dati del pianeta
    const username = request.user?.username;
    const planet = await client_1.default.planet.create({
        data: {
            ...planetData,
            createdBy: username,
            updatedBy: username,
        },
    });
    response.status(201).json(planet);
});
// qui si inserisce una regular expression che indica uno o più caratteri numerici (\\d+)
// quindi se i caratteri non sono validi verrà restituito un errore di default per route invalida
router.get("/:id(\\d+)", async (request, response, next) => {
    const planetId = Number(request.params.id);
    const planet = await client_1.default.planet.findUnique({
        where: {
            id: planetId,
        },
    });
    if (!planet) {
        response.status(404);
        return next(`Cannot GET /planets/${planetId}`);
    }
    response.json(planet);
});
router.put("/:id(\\d+)", passport_1.checkAuthorization, (0, validation_1.validate)({ body: validation_1.planetSchema }), async (request, response, next) => {
    const planetId = Number(request.params.id);
    const planetData = request.body;
    const username = request.user?.username;
    try {
        const planet = await client_1.default.planet.update({
            where: { id: planetId },
            data: {
                ...planetData,
                updatedBy: username,
            },
        });
        response.status(200).json(planet);
    }
    catch (error) {
        response.status(404);
        next(`Cannot PUT /planets/${planetId}`);
    }
});
router.delete("/:id(\\d+)", passport_1.checkAuthorization, async (request, response, next) => {
    const planetId = Number(request.params.id);
    try {
        await client_1.default.planet.delete({
            where: { id: planetId },
        });
        response.status(204).end();
    }
    catch (error) {
        response.status(404);
        next(`Cannot DELETE /planets/${planetId}`);
    }
});
// In questa path si gestisce l'upload di file, in questo caso di foto del pianeta.
// Per renderlo possibile si utilizza il pacchetto multer (che gestisce multipart/form-data)
router.post("/:id(\\d+)/photo", passport_1.checkAuthorization, upload.single("photo"), // "photo" nelle parentesi deve coincidere col name dell'input nel form in html
async (request, response, next) => {
    if (!request.file) {
        //Se il file upload non esiste
        response.status(400);
        return next("No photo file uploaded.");
    }
    // Altrimenti continua
    const planetId = Number(request.params.id);
    const photoFilename = request.file.filename; // Possibile grazie a multer
    try {
        await client_1.default.planet.update({
            where: { id: planetId },
            data: { photoFilename },
        });
        response.status(201).json({ photoFilename });
    }
    catch (error) {
        response.status(404);
        next(`Cannot POST /planets/${planetId}/photo`);
    }
});
// Quando è in questo percorso prende i dati dalla cartella uploads
// Quindi /planets/photos/file.png fa vedere il file file.png se c'è in uploads
router.use("/photos", express_1.default.static("uploads"));
exports.default = router;
//# sourceMappingURL=planets.js.map