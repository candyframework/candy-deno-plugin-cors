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
    origins: string[];
    /**
     * List of allowed methods
     *
     * ```typescript
     * ['POST', 'PUT']
     * ```
     */
    allowMethods: string[];
    /**
     * List of allowed headers
     *
     * ```typescript
     * ['X-Token']
     * ```
     */
    allowHeaders: string[];
    /**
     * Whether the server allows credentials to be included in cross-origin HTTP requests
     */
    allowCredentials: boolean;
    /**
     * Maximum number of seconds the results can be cached
     */
    maxAge: string;
    /**
     * List of headers that should be made available to scripts running in the browser
     */
    exposeHeaders: string[];
};

/**
 * Cors plgin for `@candy/framework`
 */
export default function cors(options: Partial<CorsOptions> = {}): (request: Request, hook: any) => Promise<Response> {
    const cors: CorsOptions = Object.assign({
        origins: ['*'],
        allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
        allowHeaders: [],
        allowCredentials: false,
        maxAge: '86400',
        exposeHeaders: [],
    }, options);

    return async (request: Request, hook: any): Promise<Response> => {
        const requestHeaders = request.headers;
        const method = request.method.toUpperCase();
        const origin = requestHeaders.get('Origin');
        const responseHeaders = new Headers();

        if ('OPTIONS' === method) {
            if (cors.allowMethods.length > 0) {
                responseHeaders.set('Access-Control-Allow-Methods', cors.allowMethods.join(', '));
            }

            if (cors.allowHeaders.length > 0) {
                responseHeaders.set('Access-Control-Allow-Headers', cors.allowHeaders.join(', '));
            } else {
                const h = requestHeaders.get('Access-Control-Request-Headers');
                if (null !== h) {
                    responseHeaders.set('Access-Control-Allow-Headers', h);
                }
            }

            responseHeaders.set('Access-Control-Max-Age', cors.maxAge);
        }

        if (null !== origin) {
            if (cors.origins.includes('*')) {
                if (true === cors.allowCredentials) {
                    throw new Error('Allow credentials is not allowed when allow origins is *');
                }
                responseHeaders.set('Access-Control-Allow-Origin', '*');
            } else if (cors.origins.includes(origin)) {
                responseHeaders.set('Access-Control-Allow-Origin', origin);
            }
        }
        if (cors.allowCredentials) {
            responseHeaders.set('Access-Control-Allow-Credentials', 'true');
        }
        if (cors.exposeHeaders.length > 0) {
            responseHeaders.set('Access-Control-Expose-Headers', cors.exposeHeaders.join(', '));
        }

        if ('OPTIONS' === method) {
            return new Response(null, {
                status: 200,
                statusText: 'OK',
                headers: responseHeaders,
            });
        }

        const res = await hook.next() as Response;
        responseHeaders.forEach((v, k) => {
            res.headers.set(k, v);
        });
        return res;
    };
}
