/*
Questo pacchetto permette la gestione di richieste di tipo multipart/form-data,
quindi ad esempio l'upload di file.
Qui lo si configura e si esportano i dati necessari al suo utilizzo
*/
import multer from "multer";

// Questo pacchetto serve ad identificare l'estensione dei file uploadati
import mime from "mime";

import { randomUUID } from "node:crypto";

// Questa funzione genera randomicamente il nome del file ed aggiunge l'estensione in base al tipo di file, grazie a mime.
// Viene testata con uno unit test perchè è più facile rispetto ad inserire il test nell'integration test.
export const generatePhotoFilename = (mimeType: string) => {
  const randomFilename = `${randomUUID()}-${Date.now()}`;
  const fileExtension = mime.getExtension(mimeType);
  const filename = `${randomFilename}.${fileExtension}`;

  return filename;
};

// Indica il percorso in cui salvare i file ricevuti
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (request, file, callback) => {
    return callback(null, generatePhotoFilename(file.mimetype));
  },
});

// L'unità di misura è in bytes, quindi per 6 megabytes bisogna moltiplicare
const MAX_SIZE_IN_MEGABYTES = 6 * 1024 * 1024;

// Qui si crea la variabile coi tipi di file accettabili
const VALID_MIME_TYPES = ["image/png", "image/jpeg"];

// Qui si crea la funzione che verrà inserita in multerOptions, che controlla il tipo di file
// e restituisce un errore se non è valido
const fileFilter: multer.Options["fileFilter"] = (request, file, callback) => {
  if (VALID_MIME_TYPES.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(
      new Error("Error: The uploaded file must be a JPG or a PNG image.")
    );
  }
};

export const multerOptions = {
  fileFilter,
  limits: {
    fileSize: MAX_SIZE_IN_MEGABYTES,
  },
};

export const initMulterMiddleware = () => {
  return multer({ storage, ...multerOptions });
};
