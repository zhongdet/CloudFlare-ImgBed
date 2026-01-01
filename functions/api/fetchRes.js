export async function onRequest(context) {
    const { request } = context;

    if (request.method === 'OPTIONS') {
        return new Response(null, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Expose-Headers': 'Content-Length, Content-Range'
            }
        });
    }

    const jsonRequest = await request.json();
    const url = jsonRequest.url;
    if (!url) return new Response('URL is required', { status: 400 });

    const response = await fetch(url);
    const contentType = response.headers.get('content-type') || '';

    if (contentType.startsWith('image') || contentType.startsWith('video')) {
        const headers = new Headers(response.headers);
        headers.set('Access-Control-Allow-Origin', '*');
        headers.set('Access-Control-Expose-Headers', 'Content-Length, Content-Range');
        headers.set('Accept-Ranges', 'bytes');

        return new Response(response.body, {
            status: response.status,
            headers
        });
    } else {
        return new Response('URL is not an image or video', { status: 400 });
    }
}
