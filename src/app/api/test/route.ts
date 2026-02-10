import { NextRequest, NextResponse } from "next/server";

const API_BASE = "https://blogtraffic.vercel.app/api/external/get-blogs";
const API_KEY = process.env.API_TOKEN!;

export async function GET(request: NextRequest) {
    const headers = {
        Authorization: `Bearer ${API_KEY}`,
    };

    try {
        const results: any = {
            timestamp: new Date().toISOString(),
            tests: {},
        };

        // 1️⃣ Get all blogs
        console.log("Testing: GET all blogs...");
        const startAll = Date.now();
        const allRes = await fetch(`${API_BASE}/all?page=1&limit=5`, {
            headers,
        });
        const allBlogs = await allRes.json();
        results.tests.getAllBlogs = {
            duration: `${Date.now() - startAll}ms`,
            status: allRes.status,
            success: allBlogs.success,
            count: allBlogs.data?.length || 0,
            data: allBlogs,
        };

        // Pick one blog for next tests
        const firstBlog = allBlogs?.data?.[0];

        if (firstBlog) {
            // 2️⃣ Get blog by ID
            console.log("Testing: GET blog by ID...");
            const startById = Date.now();
            const byIdRes = await fetch(
                `${API_BASE}/by-id?blogId=${firstBlog._id}`,
                { headers }
            );
            const blogById = await byIdRes.json();
            results.tests.getBlogById = {
                duration: `${Date.now() - startById}ms`,
                status: byIdRes.status,
                success: blogById.success,
                blogId: firstBlog._id,
                data: blogById,
            };

            // 3️⃣ Get blog by slug
            console.log("Testing: GET blog by slug...");
            const startBySlug = Date.now();
            const bySlugRes = await fetch(
                `${API_BASE}/by-slug?slug=${firstBlog.slug}`,
                { headers }
            );
            const blogBySlug = await bySlugRes.json();
            results.tests.getBlogBySlug = {
                duration: `${Date.now() - startBySlug}ms`,
                status: bySlugRes.status,
                success: blogBySlug.success,
                slug: firstBlog.slug,
                data: blogBySlug,
            };
        } else {
            results.tests.getBlogById = {
                skipped: true,
                reason: "No blogs available to test",
            };
            results.tests.getBlogBySlug = {
                skipped: true,
                reason: "No blogs available to test",
            };
        }

        // 4️⃣ Get blogs by keyword
        console.log("Testing: GET blogs by keyword...");
        const startByKeyword = Date.now();
        const byKeywordRes = await fetch(
            `${API_BASE}/by-keyword?keyword=seo&page=1&limit=5`,
            { headers }
        );
        const blogsByKeyword = await byKeywordRes.json();
        results.tests.getBlogsByKeyword = {
            duration: `${Date.now() - startByKeyword}ms`,
            status: byKeywordRes.status,
            success: blogsByKeyword.success,
            keyword: "seo",
            count: blogsByKeyword.data?.length || 0,
            data: blogsByKeyword,
        };

        // Summary
        const totalTests = Object.keys(results.tests).length;
        const passedTests = Object.values(results.tests).filter(
            (test: any) => test.success === true
        ).length;
        const skippedTests = Object.values(results.tests).filter(
            (test: any) => test.skipped === true
        ).length;

        results.summary = {
            total: totalTests,
            passed: passedTests,
            failed: totalTests - passedTests - skippedTests,
            skipped: skippedTests,
        };

        console.log("✅ All API tests completed:", results.summary);

        return NextResponse.json(results, { status: 200 });
    } catch (error: any) {
        console.error("❌ API test error:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message,
                timestamp: new Date().toISOString(),
            },
            { status: 500 }
        );
    }
}