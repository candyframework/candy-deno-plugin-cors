/**
 * Cors options
 */
export type CorsOptions = {
    /**
     * List of allowed origins
     *
     * ```typescript
     * ['https://example.com', 'https://example2.com']
     * ```
     */
    allowOrigins?: string[];
    /**
     * List of allowed methods
     *
     * ```typescript
     * ['POST', 'PUT']
     * ```
     */
    allowMethods?: string[];
    /**
     * List of allowed headers
     *
     * ```typescript
     * ['X-Token']
     * ```
     */
    allowHeaders?: string[];
    /**
     * Whether the server allows credentials to be included in cross-origin HTTP requests
     */
    allowCredentials?: boolean;
    /**
     * Maximum number of seconds the results can be cached
     */
    AccessControlMaxAge?: string;
    /**
     * List of headers that should be made available to scripts running in the browser
     */
    AccessControlExposeHeaders?: string[];
};

/**
 * Cors plgin for `@candy/framework`
 */
export default function cors(options: CorsOptions | null = null) {
    const cors: CorsOptions = null === options
        ? {
            allowOrigins: ['*'],
            allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
            allowHeaders: [],
            allowCredentials: false,
            AccessControlMaxAge: '86400',
            AccessControlExposeHeaders: [],
        }
        : options;

    return async (request: Request, hook: any): Promise<Response> => {
        const requestHeaders = request.headers;
        const method = request.method.toUpperCase();
        const isPreflight = 'OPTIONS' === method && requestHeaders.has('Access-Control-Request-Method');

        if (!isPreflight) {
            return await hook.next();
        }

        const responseHeaders = new Headers();
        const origin = requestHeaders.get('Origin');

        if (null !== origin && undefined !== cors.allowOrigins) {
            if (cors.allowOrigins.includes(origin)) {
                responseHeaders.set('Access-Control-Allow-Origin', origin);
            }

            if (cors.allowOrigins.includes('*')) {
                if (true === cors.allowCredentials) {
                    throw new Error('Allow credentials is not allowed when allow origins is *');
                }
                responseHeaders.set('Access-Control-Allow-Origin', '*');
            }
        }

        if (requestHeaders.has('Access-Control-Allow-Credentials')) {
            responseHeaders.set('Access-Control-Allow-Credentials', undefined !== cors.allowCredentials && cors.allowCredentials ? 'true' : 'false');
        }

        if (undefined !== cors.AccessControlExposeHeaders && cors.AccessControlExposeHeaders.length > 0) {
            responseHeaders.set('Access-Control-Expose-Headers', cors.AccessControlExposeHeaders.join(', '));
        }

        if (undefined !== cors.allowMethods && cors.allowMethods.length > 0) {
            responseHeaders.set('Access-Control-Allow-Methods', cors.allowMethods.join(', '));
        }

        if (undefined !== cors.AccessControlMaxAge && 'OPTIONS' === method) {
            responseHeaders.set('Access-Control-Max-Age', cors.AccessControlMaxAge);
        }

        if (undefined !== cors.allowHeaders && cors.allowHeaders.length > 0) {
            responseHeaders.set('Access-Control-Allow-Headers', cors.allowHeaders.join(', '));
        } else {
            const h = requestHeaders.get('Access-Control-Request-Headers');
            if (null !== h) {
                responseHeaders.set('Access-Control-Allow-Headers', h);
            }
        }

        return new Response(null, {
            status: 200,
            headers: responseHeaders,
        });
    };
}
