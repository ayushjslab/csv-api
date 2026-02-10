import { handler } from '@/lib/blogtraffic';

export async function POST(req: Request) {
    const body = await req.json();
    const headers = Object.fromEntries(req.headers);

    const result = await handler({ body, headers, method: req.method });

    return new Response(JSON.stringify({ message: result.message }), {
        status: result.status,
        headers: result.headers
    });
}

export async function PATCH(req: Request) {
    const body = await req.json();
    const headers = Object.fromEntries(req.headers);

    console.log("PATCH headers:", headers);

    const result = await handler({ body, headers, method: "PATCH" });

    return new Response(JSON.stringify({ message: result.message }), {
        status: result.status,
        headers: result.headers,
    });
}

export async function DELETE(req: Request) {
    let body: any = null;

    try {
        body = await req.json();
    } catch {
        body = null;
    }

    const headers = Object.fromEntries(req.headers);

    const result = await handler({
        body,
        headers,
        method: "DELETE",
    });

    return new Response(JSON.stringify({ message: result.message }), {
        status: result.status,
        headers: result.headers,
    });
}

// Handle CORS preflight
export async function OPTIONS(req: Request) {
    const result = await handler({ method: 'OPTIONS' });
    return new Response(null, { status: result.status, headers: result.headers });
}