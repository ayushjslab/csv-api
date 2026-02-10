// app/test/page.tsx

const API_BASE = "https://blogtraffic.vercel.app/api/external/get-blogs";
const API_KEY = process.env.API_TOKEN!;

const headers = {
    Authorization: `Bearer ${API_KEY}`,
};

const TestPage = async () => {
    // 1️⃣ Get all blogs
    const allRes = await fetch(
        `${API_BASE}/all?page=1&limit=5`,
        { headers }
    );
    const allBlogs = await allRes.json();

    // Pick one blog for next tests
    const firstBlog = allBlogs?.data?.[0];

    // 2️⃣ Get blog by ID
    const byIdRes = firstBlog
        ? await fetch(
            `${API_BASE}/by-id?blogId=${firstBlog._id}`,
            { headers }
        )
        : null;
    const blogById = byIdRes ? await byIdRes.json() : null;

    // 3️⃣ Get blog by slug
    const bySlugRes = firstBlog
        ? await fetch(
            `${API_BASE}/by-slug?slug=${firstBlog.slug}`,
            { headers }
        )
        : null;
    const blogBySlug = bySlugRes ? await bySlugRes.json() : null;

    // 4️⃣ Get blogs by keyword
    const byKeywordRes = await fetch(
        `${API_BASE}/by-keyword?keyword=seo&page=1&limit=5`,
        { headers }
    );
    const blogsByKeyword = await byKeywordRes.json();

    console.log("ALL BLOGS:", allBlogs);
    console.log("BLOG BY ID:", blogById);
    console.log("BLOG BY SLUG:", blogBySlug);
    console.log("BLOGS BY KEYWORD:", blogsByKeyword);

    return (
        <div style={{ padding: 24 }}>
            <h1>API Test Page</h1>
            <p>Check the server console for API responses 👀</p>

            <pre>{JSON.stringify({
                all: allBlogs?.data?.length,
                byId: blogById?.data?._id,
                bySlug: blogBySlug?.data?.slug,
                byKeyword: blogsByKeyword?.data?.length,
            }, null, 2)}</pre>
        </div>
    );
};

export default TestPage;
