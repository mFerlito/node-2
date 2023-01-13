declare global {
  namespace Express {
    interface User {
      username: string;
    }
  }
}

// Utilizzato in auth.ts
declare module "express-session" {
  interface SessionData {
    redirectTo: string;
  }
}

export {};
