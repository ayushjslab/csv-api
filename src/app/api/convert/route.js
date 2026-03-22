import { NextResponse } from "next/server";
import mammoth from "mammoth";
import PDFDocument from "pdfkit";

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Extract content from docx (including images)
        const images = [];
        let htmlContent;
        try {
            const result = await mammoth.convertToHtml({ buffer }, {
                convertImage: mammoth.images.inline(async (element) => {
                    const imageBuffer = await element.read();
                    const contentType = element.contentType;
                    const index = images.length;
                    images.push({ buffer: imageBuffer, contentType });
                    return {
                        src: `{{IMG_${index}}}`
                    };
                })
            });
            htmlContent = result.value;
        } catch (err) {
            console.error("Mammoth conversion error:", err);
            return NextResponse.json({ error: "Failed to process DOCX content" }, { status: 500 });
        }

        if (!htmlContent || htmlContent.trim().length === 0) {
            return NextResponse.json({ error: "The uploaded document is empty" }, { status: 400 });
        }

        // Create PDF
        const doc = new PDFDocument({ margin: 50 });
        const chunks = [];

        const pdfPromise = new Promise((resolve, reject) => {
            doc.on("data", (chunk) => chunks.push(chunk));
            doc.on("end", () => resolve(Buffer.concat(chunks)));
            doc.on("error", (err) => {
                console.error("PDF generation error:", err);
                reject(err);
            });
        });

        // Simple parser for HTML to PDF (Text & Images)
        // Strip most tags but keep structure
        const contentParts = htmlContent.split(/(<img[^>]+src="{{IMG_\d+}}"[^>]*>)/g);

        for (const part of contentParts) {
            const imgMatch = part.match(/src="{{IMG_(\d+)}}"/);
            if (imgMatch) {
                const index = parseInt(imgMatch[1]);
                const imgData = images[index];
                if (imgData) {
                    try {
                        // Add image with basic scaling to fit page width
                        doc.image(imgData.buffer, {
                            fit: [doc.page.width - 100, doc.page.height - 100],
                            align: 'center',
                            valign: 'center'
                        });
                        doc.moveDown();
                    } catch (imgErr) {
                        console.error("Error adding image to PDF:", imgErr);
                    }
                }
            } else {
                // It's text, strip remaining HTML tags
                const textContent = part.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
                if (textContent) {
                    doc.text(textContent);
                    doc.moveDown();
                }
            }
        }

        doc.end();

        const pdfBuffer = await pdfPromise;

        return new NextResponse(pdfBuffer, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": "attachment; filename=converted.pdf",
            },
        });
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}