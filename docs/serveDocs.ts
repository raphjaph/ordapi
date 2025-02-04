import { serve } from 'bun';

const server = serve({
    port: 3000,
    fetch(req) {
        const url = new URL(req.url);
        const filePath = url.pathname === '/' ? '/index.html' : url.pathname;
        
        try {
            const file = Bun.file(`./docs/dist${filePath}`);
            return new Response(file);
        } catch (error) {
            return new Response('Not found', { status: 404 });
        }
    },
});

console.log(`Documentation server running at http://localhost:${server.port}`);