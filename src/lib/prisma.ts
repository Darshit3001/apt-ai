import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient() {
    // In production (Turso), use libsql adapter
    if (process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN) {
        // Dynamic import to avoid bundling better-sqlite3 in production
        const { PrismaLibSql } = require("@prisma/adapter-libsql");

        const adapter = new PrismaLibSql({
            url: process.env.TURSO_DATABASE_URL,
            authToken: process.env.TURSO_AUTH_TOKEN,
        });

        return new PrismaClient({ adapter });
    }

    // Local dev: use better-sqlite3 adapter
    const Database = require("better-sqlite3");
    const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");

    // Fallback to exactly dev.db if env var is missing or empty
    const dbFile = (process.env.DATABASE_URL && process.env.DATABASE_URL.replace("file:", "")) || "./dev.db";
    const db = new Database(dbFile);
    const adapter = new PrismaBetterSqlite3(db);
    return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
