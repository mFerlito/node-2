// Questo file serve ad indicare la struttura per poter validare il body delle richieste al server (un po' come fa lo schema per prisma)
// PACCHETTI:  @sinclair/typebox, express-validator-middleware, ajv-formats
import { Static, Type } from "@sinclair/typebox";

export const planetSchema = Type.Object(
  {
    name: Type.String(),
    description: Type.Optional(Type.String()), // Proprietà opzionale
    diameter: Type.Integer(),
    moons: Type.Integer(),
  },
  { additionalProperties: false }
);

export type PlanetData = Static<typeof planetSchema>; //Esporta il tipo planetSchema
