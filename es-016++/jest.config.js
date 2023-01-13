module.exports = {
  testEnvironment: "node",
  verbose: true,
  preset: "ts-jest",
  clearMocks: true,
  setupFilesAfterEnv: [
    "./src/lib/prisma/client.mock.ts",
    "./src/lib/middleware/multer.mock.ts",
    "./src/lib/middleware/passport.mock.ts",
  ],
};
