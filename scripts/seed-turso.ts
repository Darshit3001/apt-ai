// APT AI — Turso Database Seed Script (Production)
// Run: npx tsx scripts/seed-turso.ts

import "dotenv/config";
import { createClient } from "@libsql/client";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { hash } from "bcryptjs";

async function seedTurso() {
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (!url || !authToken) {
        console.error("❌ Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN in .env");
        process.exit(1);
    }

    console.log("🔗 Connecting to Turso...");
    const adapter = new PrismaLibSql({ url, authToken });
    const prisma = new PrismaClient({ adapter });

    try {
        // Check connection
        const existing = await prisma.user.count();
        console.log(`📊 Current users in production: ${existing}`);

        if (existing > 0) {
            console.log("⚠️  Database already has data. Skipping seed.");
            console.log("   To force re-seed, manually clear tables first.");
            return;
        }

        console.log("🌱 Seeding production database...");

        // Create admin user
        const adminPassword = await hash("admin123", 10);
        const admin = await prisma.user.create({
            data: {
                email: "admin@aptai.com",
                name: "APT AI Admin",
                password: adminPassword,
                role: "admin",
                karma: 1000,
            },
        });
        console.log(`✅ Admin user created: ${admin.email}`);

        // Create test user
        const userPassword = await hash("user123", 10);
        const user = await prisma.user.create({
            data: {
                email: "test@aptai.com",
                name: "Test User",
                password: userPassword,
                role: "user",
                karma: 50,
            },
        });
        console.log(`✅ Test user created: ${user.email}`);

        // Create categories
        const categoryData = [
            { slug: "chatbots", name: "Chatbots", icon: "💬", description: "AI chatbots and conversational agents" },
            { slug: "image-generation", name: "Image Generation", icon: "🎨", description: "AI image creation tools" },
            { slug: "writing", name: "Writing", icon: "✍️", description: "AI writing and content tools" },
            { slug: "code", name: "Code", icon: "💻", description: "AI coding assistants" },
            { slug: "video", name: "Video", icon: "🎬", description: "AI video tools" },
            { slug: "audio-music", name: "Audio & Music", icon: "🎵", description: "AI audio and music tools" },
            { slug: "productivity", name: "Productivity", icon: "⚡", description: "AI productivity tools" },
            { slug: "marketing", name: "Marketing", icon: "📈", description: "AI marketing tools" },
            { slug: "design", name: "Design", icon: "🎨", description: "AI design tools" },
            { slug: "data-analytics", name: "Data & Analytics", icon: "📊", description: "AI data analysis tools" },
        ];

        for (const cat of categoryData) {
            await prisma.category.create({ data: cat });
        }
        console.log(`✅ ${categoryData.length} categories created`);

        // Create sample company
        const company = await prisma.company.create({
            data: {
                slug: "openai",
                name: "OpenAI",
                website: "https://openai.com",
                country: "US",
            },
        });

        // Create sample tools
        const chatbotCategory = await prisma.category.findUnique({ where: { slug: "chatbots" } });
        const imageCategory = await prisma.category.findUnique({ where: { slug: "image-generation" } });
        const codeCategory = await prisma.category.findUnique({ where: { slug: "code" } });

        if (chatbotCategory) {
            await prisma.tool.create({
                data: {
                    slug: "chatgpt",
                    name: "ChatGPT",
                    description: "AI chatbot by OpenAI for conversation, writing, and problem-solving.",
                    website: "https://chat.openai.com",
                    pricingModel: "FREEMIUM",
                    priceFrom: 20,
                    categoryId: chatbotCategory.id,
                    companyId: company.id,
                    isVerified: true,
                    isFeatured: true,
                    viewCount: 1500000,
                    saveCount: 25000,
                    avgRating: 4.5,
                    reviewCount: 3200,
                    version: "4o",
                    country: "US",
                },
            });

            await prisma.tool.create({
                data: {
                    slug: "gemini",
                    name: "Gemini",
                    description: "Google's multimodal AI that understands text, images, code, audio, and video.",
                    website: "https://gemini.google.com",
                    pricingModel: "FREEMIUM",
                    priceFrom: 20,
                    categoryId: chatbotCategory.id,
                    isVerified: true,
                    viewCount: 1900000,
                    saveCount: 29800,
                    avgRating: 4.3,
                    reviewCount: 1700,
                    version: "2.5",
                    country: "US",
                },
            });
        }

        if (imageCategory) {
            await prisma.tool.create({
                data: {
                    slug: "midjourney",
                    name: "Midjourney",
                    description: "AI art generator creating stunning images from text prompts.",
                    website: "https://midjourney.com",
                    pricingModel: "PAID",
                    priceFrom: 10,
                    categoryId: imageCategory.id,
                    isVerified: true,
                    isFeatured: true,
                    viewCount: 980000,
                    saveCount: 18000,
                    avgRating: 4.7,
                    reviewCount: 2100,
                    version: "6.1",
                    country: "US",
                },
            });
        }

        if (codeCategory) {
            await prisma.tool.create({
                data: {
                    slug: "github-copilot",
                    name: "GitHub Copilot",
                    description: "AI pair programmer that helps you write code faster.",
                    website: "https://github.com/features/copilot",
                    pricingModel: "PAID",
                    priceFrom: 10,
                    categoryId: codeCategory.id,
                    isVerified: true,
                    viewCount: 1200000,
                    saveCount: 22000,
                    avgRating: 4.4,
                    reviewCount: 2800,
                    version: "1.0",
                    country: "US",
                },
            });
        }

        console.log("✅ Sample tools created");
        console.log("\n🎉 Production database seeded successfully!");
    } catch (error) {
        console.error("❌ Seed failed:", error);
    } finally {
        await prisma.$disconnect();
    }
}

seedTurso();
