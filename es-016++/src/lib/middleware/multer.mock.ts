// Serve ad evitare che ad ogni test di upload si aggiunga un file nella cartella upload.
// Si fa il mock
import multer from "multer";

jest.mock("./multer", () => {
  const originalModule = jest.requireActual("./multer"); // Accede a tutti gli export di multer.ts

  return {
    __esModule: true,
    ...originalModule,
    initMulterMiddleware: () => {
      return multer({
        // Qui si indica a multer il percorso in cui salvare i dati.
        // In questo caso è un uno storage di default di multer, che usa la ram e non aggiunge i file nel progetto.
        // Va aggiunta anche la regola in jest.config.js così che venga resettato a fine test (setupFilesAfterEnv: ["./src/lib/middleware/multer.mock.ts"])
        storage: multer.memoryStorage(),
        ...originalModule.multerOptions,
      });
    },
  };
});
