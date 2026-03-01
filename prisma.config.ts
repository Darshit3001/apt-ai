// APT AI — Prisma Configuration
// Handles both local SQLite and production Turso URLs
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Use TURSO_DATABASE_URL for production, DATABASE_URL for local
    url: process.env["TURSO_DATABASE_URL"] || process.env["DATABASE_URL"] || "file:./dev.db",
  },
});
