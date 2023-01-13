import cors from "cors"; // Per prevenire errori di di richieste cors (cross origin resource sharing)

export function initCorsMiddleware() {
  // Per configurare cors
  const corsOption = {
    origin: "http://localhost:8080",
    credentials: true,
  };

  return cors(corsOption);
}
