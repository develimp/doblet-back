import {MiddlewareSequence, RequestContext} from '@loopback/rest';

export class MySequence extends MiddlewareSequence {
  async handle(context: RequestContext) {
    const {request, response} = context;

    const allowedOrigins =
      process.env.NODE_ENV === 'production'
        ? ['https://doblet.santspatrons.com']
        : ['http://localhost:9000'];

    const origin = request.headers.origin;

    // Check if the request origin is in the allowed origins
    if (origin && allowedOrigins.includes(origin)) {
      response.setHeader('Access-Control-Allow-Origin', origin);
      response.setHeader('Vary', 'Origin'); // good practice for caching proxies
    }

    // Allow credentials
    response.setHeader('Access-Control-Allow-Credentials', 'true');

    // Specify the methods that are allowed in the request
    response.setHeader(
      'Access-Control-Allow-Methods',
      'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    );

    // Specify the headers that are allowed in the request
    response.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, X-Requested-With',
    );

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      response.statusCode = 204;
      response.end();
      return;
    }

    try {
      await super.handle(context);
    } catch (err) {
      console.error('❌ Error en el Sequence:', err);

      // Set CORS headers again in case of error
      if (origin && allowedOrigins.includes(origin)) {
        response.setHeader('Access-Control-Allow-Origin', origin);
      }

      response.statusCode = 500;
      response.end(
        JSON.stringify({
          error: 'Internal Server Error',
          message: err.message,
        }),
      );
    }
  }
}
