"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initMulterMiddleware = exports.multerOptions = exports.generatePhotoFilename = void 0;
/*
Questo pacchetto permette la gestione di richieste di tipo multipart/form-data,
quindi ad esempio l'upload di file.
Qui lo si configura e si esportano i dati necessari al suo utilizzo
*/
const multer_1 = __importDefault(require("multer"));
// Questo pacchetto serve ad identificare l'estensione dei file uploadati
const mime_1 = __importDefault(require("mime"));
const node_crypto_1 = require("node:crypto");
// Questa funzione genera randomicamente il nome del file ed aggiunge l'estensione in base al tipo di file, grazie a mime.
// Viene testata con uno unit test perchè è più facile rispetto ad inserire il test nell'integration test.
const generatePhotoFilename = (mimeType) => {
    const randomFilename = `${(0, node_crypto_1.randomUUID)()}-${Date.now()}`;
    const fileExtension = mime_1.default.getExtension(mimeType);
    const filename = `${randomFilename}.${fileExtension}`;
    return filename;
};
exports.generatePhotoFilename = generatePhotoFilename;
// Indica il percorso in cui salvare i file ricevuti
const storage = multer_1.default.diskStorage({
    destination: "uploads/",
    filename: (request, file, callback) => {
        return callback(null, (0, exports.generatePhotoFilename)(file.mimetype));
    },
});
// L'unità di misura è in bytes, quindi per 6 megabytes bisogna moltiplicare
const MAX_SIZE_IN_MEGABYTES = 6 * 1024 * 1024;
// Qui si crea la variabile coi tipi di file accettabili
const VALID_MIME_TYPES = ["image/png", "image/jpeg"];
// Qui si crea la funzione che verrà inserita in multerOptions, che controlla il tipo di file
// e restituisce un errore se non è valido
const fileFilter = (request, file, callback) => {
    if (VALID_MIME_TYPES.includes(file.mimetype)) {
        callback(null, true);
    }
    else {
        callback(new Error("Error: The uploaded file must be a JPG or a PNG image."));
    }
};
exports.multerOptions = {
    fileFilter,
    limits: {
        fileSize: MAX_SIZE_IN_MEGABYTES,
    },
};
const initMulterMiddleware = () => {
    return (0, multer_1.default)({ storage, ...exports.multerOptions });
};
exports.initMulterMiddleware = initMulterMiddleware;
//# sourceMappingURL=multer.js.map