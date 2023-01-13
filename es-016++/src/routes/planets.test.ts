import supertest from "supertest";
import { app } from "../app";

import { prismaMock } from "../lib/prisma/client.mock";

const request = supertest(app);

//API integration test

//GET ALL PLANETS
// Il describe block permette di raggruppare dei test
// All'interno dei test annidati si può inserire la descrizione al posto dell'endpoint
describe("GET /planets", () => {
  test("Valid request", async () => {
    const planets = [
      {
        id: 1,
        name: "Mercury",
        description: null,
        diameter: 1345,
        moons: 12,
        createdAt: "2022-12-01T01:51:20.096Z",
        updatedAt: "2022-12-01T01:50:44.989Z",
      },
      {
        id: 2,
        name: "Venus",
        description: null,
        diameter: 2345,
        moons: 0,
        createdAt: "2022-12-01T01:51:20.096Z",
        updatedAt: "2022-12-01T01:51:01.115Z",
      },
      {
        id: 3,
        name: "Pluton",
        description: "Un pianeta? Non proprio ç_ç",
        diameter: 2376,
        moons: 5,
        createdAt: "2022-12-04T21:23:57.945Z",
        updatedAt: "2022-12-04T21:24:07.595Z",
      },
    ];

    // @ts-ignore
    prismaMock.planet.findMany.mockResolvedValue(planets);

    const response = await request
      .get("/planets")
      .expect(200)
      .expect("Content-Type", /application\/json/)
      .expect("Access-Control-Allow-Origin", "http://localhost:8080") // Da inserire in tutte le richieste valide per controllare che il cors sia attivo
      .expect("Access-Control-Allow-Credentials", "true");
    expect(response.body).toEqual(planets);
  });
});

//GET PLANET BY ID
describe("GET /planets/:id", () => {
  test("Valid request", async () => {
    const planet = {
      id: 1,
      name: "Mercury",
      description: null,
      diameter: 1345,
      moons: 12,
      createdAt: "2022-12-01T01:51:20.096Z",
      updatedAt: "2022-12-01T01:50:44.989Z",
    };

    // @ts-ignore
    prismaMock.planet.findUnique.mockResolvedValue(planet);

    const response = await request
      .get("/planets/1")
      .expect(200)
      .expect("Content-Type", /application\/json/)
      .expect("Access-Control-Allow-Origin", "http://localhost:8080") // Da inserire in tutte le richieste valide per controllare che il cors sia attivo
      .expect("Access-Control-Allow-Credentials", "true");

    expect(response.body).toEqual(planet);
  });

  test("Planet does not exist", async () => {
    // @ts-ignore
    prismaMock.planet.findUnique.mockResolvedValue(null);

    const response = await request
      .get("/planets/23")
      .expect(404)
      .expect("Content-Type", /application\/json/);

    expect(response.body.message).toContain("Cannot GET /planets/23");
  });

  test("Invalid planet ID", async () => {
    const response = await request
      .get("/planets/qwe")
      .expect(404)
      .expect("Content-Type", /application\/json/);

    expect(response.body.message).toContain("Cannot GET /planets/qwe");
  });
});

//ADD PLANET
describe("POST /planets", () => {
  // Viene usato per la validazione delle richieste e creazione di richieste valide e non.
  test("Valid request", async () => {
    const planet = {
      id: 1,
      name: "Nibiru",
      description: "Just a test planet",
      diameter: 1345,
      moons: 12,
      createdAt: "2022-12-16T20:22:00.824Z",
      updatedAt: "2022-12-16T20:22:00.824Z",
    };

    // @ts-ignore
    prismaMock.planet.create.mockResolvedValue(planet);

    const response = await request
      .post("/planets")
      .send({
        name: "Nibiru",
        description: "Just a test planet",
        diameter: 1345,
        moons: 12,
      })
      .expect(201)
      .expect("Content-Type", /application\/json/)
      .expect("Access-Control-Allow-Origin", "http://localhost:8080") // Da inserire in tutte le richieste valide per controllare che il cors sia attivo
      .expect("Access-Control-Allow-Credentials", "true");

    expect(response.body).toEqual(planet);
  });

  test("Invalid request", async () => {
    // Questa non è una richiesta valida, perchè manca il nome del pianeta.
    // Quindi come risposta si dovrà inserire che ci si aspetta un errore
    const planet = {
      description: "Just a test planet",
      diameter: 1345,
      moons: 12,
    };

    const response = await request
      .post("/planets")
      .send(planet)
      .expect(422) // Unprocessable Entity
      .expect("Content-Type", /application\/json/);

    // Ci si aspetta un oggetto che contenga una proprietà errors, con all'interno l'indicazione che il body ha un errore,
    // quindi una proprietà body con all'interno un array di errori
    expect(response.body).toEqual({
      errors: {
        body: expect.any(Array),
      },
    });
  });
});

//UPDATE PLANET
describe("PUT /planets/:id", () => {
  // Viene usato per la validazione delle richieste e creazione di richieste valide e non.
  test("Valid request", async () => {
    const planet = {
      id: 1,
      name: "Nibiru",
      description: "More than just a test planet",
      diameter: 1345,
      moons: 12,
      createdAt: "2022-12-16T20:22:00.824Z",
      updatedAt: "2022-12-16T20:22:00.824Z",
    };

    // @ts-ignore
    prismaMock.planet.update.mockResolvedValue(planet);

    const response = await request
      .put("/planets/1")
      .send({
        name: "Nibiru",
        description: "More than just a test planet",
        diameter: 1345,
        moons: 12,
      })
      .expect(200)
      .expect("Content-Type", /application\/json/)
      .expect("Access-Control-Allow-Origin", "http://localhost:8080") // Da inserire in tutte le richieste valide per controllare che il cors sia attivo
      .expect("Access-Control-Allow-Credentials", "true");

    expect(response.body).toEqual(planet);
  });

  test("Invalid request", async () => {
    // Questa non è una richiesta valida, perchè manca il nome del pianeta.
    // Quindi come risposta si dovrà inserire che ci si aspetta un errore
    const planet = {
      description: "No name field XD",
      diameter: 1345,
      moons: 12,
    };

    const response = await request
      .put("/planets/23")
      .send(planet)
      .expect(422) // Unprocessable Entity
      .expect("Content-Type", /application\/json/);

    // Ci si aspetta un oggetto che contenga una proprietà errors, con all'interno l'indicazione che il body ha un errore,
    // quindi una proprietà body con all'interno un array di errori
    expect(response.body).toEqual({
      errors: {
        body: expect.any(Array),
      },
    });
  });

  test("Planet does not exist", async () => {
    // @ts-ignore
    prismaMock.planet.update.mockRejectedValue(new Error("Error"));

    const response = await request
      .put("/planets/23")
      .send({
        name: "Nibiru",
        description: "More than just a test planet",
        diameter: 1345,
        moons: 12,
      })
      .expect(404)
      .expect("Content-Type", /application\/json/);

    expect(response.body.message).toContain("Cannot PUT /planets/23");
  });

  test("Invalid planet ID", async () => {
    const response = await request
      .put("/planets/qwe")
      .send({
        name: "Nibiru",
        description: "More than just a test planet",
        diameter: 1345,
        moons: 12,
      })
      .expect(404)
      .expect("Content-Type", /application\/json/);

    expect(response.body.message).toContain("Cannot PUT /planets/qwe");
  });
});

//DELETE PLANET BY ID
describe("DELETE /planets/:id", () => {
  test("Valid request", async () => {
    await request
      .delete("/planets/1")
      .expect(204) //ci si aspetta come risposta un codice 204(no content), quindi non serve l'header Content-Type
      .expect("Access-Control-Allow-Origin", "http://localhost:8080") // Da inserire in tutte le richieste valide per controllare che il cors sia attivo
      .expect("Access-Control-Allow-Credentials", "true");
  });

  test("Planet does not exist", async () => {
    // @ts-ignore
    prismaMock.planet.delete.mockRejectedValue(new Error("Error"));

    const response = await request
      .delete("/planets/23")
      .expect(404)
      .expect("Content-Type", /application\/json/);

    expect(response.body.message).toContain("Cannot DELETE /planets/23");
  });

  test("Invalid planet ID", async () => {
    const response = await request
      .delete("/planets/qwe")
      .expect(404)
      .expect("Content-Type", /application\/json/);

    expect(response.body.message).toContain("Cannot DELETE /planets/qwe");
  });
});

/*
Questi test dipendono da src/lib/middleware/multer.mock.ts
Usa multer memoryStorage, così non vengono scritti file nel disco (in caso di test)
*/
describe("POST /planets/:id/photo", () => {
  test("Valid request with PNG file upload", async () => {
    await request
      .post("/planets/1/photo")
      .attach("photo", "test-fixtures/photos/file.png")
      .expect(201)
      .expect("Access-Control-Allow-Origin", "http://localhost:8080");
  });

  test("Valid request with JPG file upload", async () => {
    await request
      .post("/planets/1/photo")
      .attach("photo", "test-fixtures/photos/file.jpg")
      .expect(201)
      .expect("Access-Control-Allow-Origin", "http://localhost:8080");
  });

  test("Invalid request with text file upload", async () => {
    const response = await request
      .post("/planets/1/photo")
      .attach("photo", "test-fixtures/photos/file.txt")
      .expect(500)
      .expect("Content-Type", /application\/json/);

    expect(response.body.message).toContain(
      "Error: The uploaded file must be a JPG or a PNG image."
    );
  });

  test("Planet does not exist", async () => {
    //@ts-ignore
    prismaMock.planet.update.mockRejectedValue(new Error("Error"));

    const response = await request
      .post("/planets/23/photo")
      .attach("photo", "test-fixtures/photos/file.png")
      .expect(404)
      .expect("Content-Type", /application\/json/);

    expect(response.body.message).toContain("Cannot POST /planets/23/photo");
  });

  test("Invalid planet ID", async () => {
    const response = await request
      .post("/planets/erwe/photo")
      .expect(404)
      .expect("Content-Type", /application\/json/);

    expect(response.body.message).toContain("Cannot POST /planets/erwe/photo");
  });

  test("Invalid request with no file upload", async () => {
    const response = await request
      .post("/planets/1/photo")
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(response.body.message).toContain("No photo file uploaded.");
  });
});
