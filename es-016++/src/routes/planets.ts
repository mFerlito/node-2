// Spostando le routes da app a qui si crea router, quindi al posto di app. si userà router.
// Dato che verrà indicato altrove (nel file app), si dovrà togliere planets dalle routes in questo file
// Poi planets.ts viene importato in app

import express, { Router } from "express";

import { initMulterMiddleware } from "../lib/middleware/multer"; // Per permettere la gestione di richieste multipart/form-data (es upload di file)

import {
  validate,
  planetSchema,
  PlanetData,
} from "../lib/middleware/validation";

// Per controllare che l'utente sia autenticato
// Utilizzato nelle routes che modificano il database (creano, aggiornano o eliminano pianeti)
import { checkAuthorization } from "../lib/middleware/passport";

import prisma from "../lib/prisma/client";
// const prisma = new PrismaClient();

const upload = initMulterMiddleware(); // Si inizializza la variabile necessaria alla gestione delle richieste di upload di file (multipart/form-data)

const router = Router();

router.get("/", async (req, res) => {
  const planets = await prisma.planet.findMany();

  res.json(planets);
});

// Qui si usa prima il middleware checkAuthorization; poi, se lui usa next(), si passa al middlewarw validate
router.post(
  "/",
  checkAuthorization,
  validate({ body: planetSchema }),
  async (request, response) => {
    const planetData: PlanetData = request.body;
    // Ovviamente se c'è l'autorizzazione ci sarà l'username (settato da passport nella sessione),
    // Qui viene recuperato dalla richiesta, per poi aggiungerlo insieme agli altri dati del pianeta
    const username = request.user?.username as string;
    const planet = await prisma.planet.create({
      data: {
        ...planetData,
        createdBy: username,
        updatedBy: username,
      },
    });

    response.status(201).json(planet);
  }
);

// qui si inserisce una regular expression che indica uno o più caratteri numerici (\\d+)
// quindi se i caratteri non sono validi verrà restituito un errore di default per route invalida
router.get("/:id(\\d+)", async (request, response, next) => {
  const planetId = Number(request.params.id);

  const planet = await prisma.planet.findUnique({
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

router.put(
  "/:id(\\d+)",
  checkAuthorization,
  validate({ body: planetSchema }),
  async (request, response, next) => {
    const planetId = Number(request.params.id);
    const planetData: PlanetData = request.body;
    const username = request.user?.username as string;

    try {
      const planet = await prisma.planet.update({
        where: { id: planetId },
        data: {
          ...planetData,
          updatedBy: username,
        },
      });

      response.status(200).json(planet);
    } catch (error) {
      response.status(404);
      next(`Cannot PUT /planets/${planetId}`);
    }
  }
);

router.delete(
  "/:id(\\d+)",
  checkAuthorization,
  async (request, response, next) => {
    const planetId = Number(request.params.id);
    try {
      await prisma.planet.delete({
        where: { id: planetId },
      });

      response.status(204).end();
    } catch (error) {
      response.status(404);
      next(`Cannot DELETE /planets/${planetId}`);
    }
  }
);

// In questa path si gestisce l'upload di file, in questo caso di foto del pianeta.
// Per renderlo possibile si utilizza il pacchetto multer (che gestisce multipart/form-data)
router.post(
  "/:id(\\d+)/photo",
  checkAuthorization,
  upload.single("photo"), // "photo" nelle parentesi deve coincidere col name dell'input nel form in html
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
      await prisma.planet.update({
        where: { id: planetId },
        data: { photoFilename },
      });
      response.status(201).json({ photoFilename });
    } catch (error) {
      response.status(404);
      next(`Cannot POST /planets/${planetId}/photo`);
    }
  }
);

// Quando è in questo percorso prende i dati dalla cartella uploads
// Quindi /planets/photos/file.png fa vedere il file file.png se c'è in uploads
router.use("/photos", express.static("uploads"));

export default router;
