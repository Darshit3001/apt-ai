import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
        return NextResponse.json({ error: "Query parameter is required" }, { status: 400 });
    }

    try {
        // We add "ai OR llm OR machine learning" as hidden keywords if the user's query doesn't explicitly mention AI
        // to keep the results somewhat relevant to APT AI, unless we just want raw search.
        // Let's just do raw search so they can find any repo.
        const githubResponse = await fetch(
            `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=12`,
            {
                headers: {
                    "Accept": "application/vnd.github.v3+json",
                    // If you have a GITHUB_TOKEN in env, you could use it to increase rate limits
                    // ...(process.env.GITHUB_TOKEN && { Authorization: `token ${process.env.GITHUB_TOKEN}` })
                },
                // Revalidate every hour
                next: { revalidate: 3600 }
            }
        );

        if (!githubResponse.ok) {
            const errorText = await githubResponse.text();
            console.error("GitHub API Error:", githubResponse.status, errorText);

            // Handle rate limits gracefully
            if (githubResponse.status === 403 && errorText.includes("rate limit")) {
                return NextResponse.json({ error: "GitHub API rate limit exceeded. Try again later." }, { status: 429 });
            }

            throw new Error(`GitHub API responded with status: ${githubResponse.status}`);
        }

        const data = await githubResponse.json();

        // Map the data to a cleaner format to send to frontend
        const repos = data.items.map((repo: any) => ({
            id: repo.id,
            name: repo.name,
            fullName: repo.full_name,
            description: repo.description || "No description provided.",
            url: repo.html_url,
            stars: repo.stargazers_count,
            language: repo.language,
            ownerAvatar: repo.owner.avatar_url,
            ownerName: repo.owner.login,
            updatedAt: repo.updated_at,
            topics: repo.topics || []
        }));

        return NextResponse.json({ repos, total: data.total_count });
    } catch (error) {
        console.error("Error fetching from GitHub:", error);
        return NextResponse.json({ error: "Failed to fetch repositories" }, { status: 500 });
    }
}
