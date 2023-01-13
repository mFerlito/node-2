import { generatePhotoFilename } from "./multer";

// Unit test che controlla se viene generata l'estensione esatta per il tipo di file
// Con each si avvia il test per ogni elemento dell'array (ogni tuple in questo caso)
describe("generatePhotoFilename", () => {
  test.each([
    ["image/png", "png"],
    ["image/jpeg", "jpeg"],
  ])(
    // Il %s prende mimeType
    "Generates filename with correct extension when passed mimeType '%s'",
    (mimeType, expectedFileExtension) => {
      const fullFilename = generatePhotoFilename(mimeType);
      // Si prende la parte dell'estensione, quindi quella dopo il punto
      const [, fileExtension] = fullFilename.split(".");

      expect(fileExtension).toEqual(expectedFileExtension);
    }
  );
});
