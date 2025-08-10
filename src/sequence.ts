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
    }

    // Specify the methods that are allowed in the request
    response.setHeader(
      'Access-Control-Allow-Methods',
      'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    );
    // Specify the headers that are allowed in the request
    response.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization',
    );
    // Allow credentials to be included in the request
    response.setHeader('Access-Control-Allow-Credentials', 'true');

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      response.statusCode = 204;
      response.end();
      return;
    }

    await super.handle(context);
  }
}
