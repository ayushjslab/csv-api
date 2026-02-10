import { createBlogTrafficHandler } from 'blogtraffic';

export const handler = createBlogTrafficHandler({
    secret: process.env.BLOGTRAFFIC_SECRET!,
    apiToken: process.env.API_TOKEN!,
    onPublish: async (blog) => {
        console.log('Blog added:', blog);
    },
    onUpdate: async (blog) => {
        console.log('Blog updated:', blog);
    },
    onDelete: async (blog) => {
        console.log('Blog deleted:', blog);
    }
});
