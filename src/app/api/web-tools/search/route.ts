import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
        return NextResponse.json({ error: "Query parameter is required" }, { status: 400 });
    }

    try {
        // We use DuckDuckGo's official Instant Answer API for free, reliable JSON web search
        const response = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`, {
            next: { revalidate: 3600 }
        });

        if (!response.ok) {
            throw new Error(`Web Search API gave status: ${response.status}`);
        }

        const data = await response.json();
        const results = [];

        // 1. If there is a direct abstract match for the AI tool
        if (data.Heading && data.AbstractText) {
            const url = data.Results?.[0]?.FirstURL || data.AbstractURL || `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
            results.push({
                id: `web-main-${Date.now()}`,
                slug: data.Heading.toLowerCase().replace(/[^a-z0-9]/g, '-'),
                name: data.Heading,
                description: data.AbstractText,
                website: url,
                pricingModel: "FREEMIUM",
                avgRating: Number((Math.random() * (5.0 - 4.2) + 4.2).toFixed(1)), // Mock rating for web tools
                reviewCount: Math.floor(Math.random() * 500) + 50,
                viewCount: Math.floor(Math.random() * 50000) + 1000,
                saveCount: Math.floor(Math.random() * 2000) + 100,
                category: { slug: "web-discovery", name: "Web Discovery", icon: "🌐" },
                isVerified: false,
                isWebDiscovery: true
            });
        }

        // 2. Add related topics as potential discovery tools
        if (data.RelatedTopics && data.RelatedTopics.length > 0) {
            data.RelatedTopics.forEach((topic: any, idx: number) => {
                if (topic.Text && topic.FirstURL && topic.Text.includes(' - ')) {
                    const [title, ...descParts] = topic.Text.split(' - ');
                    const description = descParts.join(' - ');

                    if (title && description && title.length < 50) {
                        results.push({
                            id: `web-rel-${idx}-${Date.now()}`,
                            slug: title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
                            name: title.trim(),
                            description: description.substring(0, 150) + (description.length > 150 ? "..." : ""),
                            website: topic.FirstURL,
                            pricingModel: Math.random() > 0.5 ? "FREE" : "FREEMIUM",
                            avgRating: Number((Math.random() * (4.8 - 3.8) + 3.8).toFixed(1)),
                            reviewCount: Math.floor(Math.random() * 200) + 5,
                            viewCount: Math.floor(Math.random() * 5000) + 500,
                            saveCount: Math.floor(Math.random() * 500) + 10,
                            category: { slug: "related-discovery", name: "Related Link", icon: "🔗" },
                            isVerified: false,
                            isWebDiscovery: true
                        });
                    }
                }
            });
        }

        return NextResponse.json({ tools: results, total: results.length });
    } catch (error) {
        console.error("Error fetching from Web:", error);
        return NextResponse.json({ error: "Failed to perform expansive web search" }, { status: 500 });
    }
}
