exports.command = 'voyager [--port]'
exports.desc = 'Open GraphQL voyager in your browser'
exports.builder = {
  port: {
    alias: 'p',
    description: 'port to start local server with voyager on',
  }
}

import * as express from 'express'
import { express as middleware } from 'graphql-voyager/middleware'
import * as graphqlHTTP from 'express-graphql'
import * as opn from 'opn'
import { buildSchema } from 'graphql'

exports.handler = function (context, argv) {
  const schema = buildSchema(context.getProjectConfig().getSchemaSDL());

  const app = express()

  app.use('/graphql', graphqlHTTP({
    schema: schema
  }));

  app.use('/voyager', middleware({ endpointUrl: '/graphql' }))

  const port = parseInt(argv.port) || 7000;
  app.listen(port);
  const listener = app.listen(() => {
    let host = listener.address().address
    if (host === '::') {
      host = 'localhost'
    }
    const link = `http://${host}:${port}/voyager`
    console.log('Serving voyager at %s', link)
    opn(link)
  });
}
