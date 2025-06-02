/**
 * Cloudflare Worker for Log Collection
 *
 * This worker captures HTTP request/response data and forwards it to Profound's log collection
 * It runs as a middleware, meaning it doesn't interfere with the actual request handling.
 */

export default {
    async fetch(request, env, ctx) {
        // Get the original response by passing the request through
        const response = await fetch(request);

        // Clone the response so we can process it without affecting the client response
        const responseClone = response.clone();

        // Process request/response data asynchronously without blocking the response delivery
        ctx.waitUntil(handleRequest(request, responseClone, env));

        // Return the original response to the client
        return response;
    }
};

async function handleRequest(request, response, env) {
    try {
        const requestUrl = new URL(request.url);

        // Calculate header size (approximation)
        let headerSize = 0;
        for (const [key, value] of response.headers.entries()) {
            // Account for key, value, ': ', and '\r\n'
            headerSize += key.length + value.length + 4;
        }

        // Get response body size
        // Clone the body first to avoid consuming it before sending to client
        const responseBody = await response.clone().blob();
        const bodySize = responseBody.size;

        // Total bytes sent includes headers and body
        const totalBytesSent = headerSize + bodySize;

        // Prepare log data payload
        const logData = {
            timestamp: Date.now(),
            host: requestUrl.hostname,
            method: request.method,
            pathname: requestUrl.pathname,
            query_params: Object.fromEntries(requestUrl.searchParams),
            ip: request.headers.get('cf-connecting-ip') || '', // Use header or default to empty string
            userAgent: request.headers.get('user-agent') || '', // Use header or default to empty string
            referer: request.headers.get('referer') || '', // Use header or default to empty string
            bytes: totalBytesSent,
            status: response.status
        };

        // Send log data to Profound API endpoint specified in environment variables
        const profoundApiResponse = await fetch(env.PROFOUND_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // API Key must be configured as a secret in Cloudflare Workers
                'X-API-Key': env.PROFOUND_API_KEY 
            },
            // Send data as an array, as expected by many logging endpoints
            body: JSON.stringify([logData]) 
        });

        // Check if the API call was successful
        if (!profoundApiResponse.ok) {
          const errorText = await profoundApiResponse.text(); // Get error details if available
          console.error(`Failed to send logs to Profound API: ${profoundApiResponse.status} ${profoundApiResponse.statusText}`, errorText);
        }

    } catch (error) {
        // Log any errors during the handling process
        console.error('Error processing request/response for logging:', error);
    }
}

