exports.command = 'voyager'
exports.desc = 'Open GraphQL voyager in your browser'

import * as express from 'express'
import { express as middleware } from 'graphql-voyager/middleware'
import * as graphqlHTTP from 'express-graphql'
import * as opn from 'opn';

exports.handler = function (context) {
  const schema = context.getProjectConfig().getSchema()

  const app = express()

  app.use('/graphql', graphqlHTTP({
    schema: schema
  }));

  app.use('/voyager', middleware({ endpointUrl: '/graphql' }))

  app.listen(7000);
  const listener = app.listen(() => {
    let host = listener.address().address
    if (host === '::') {
      host = 'localhost'
    }
    const port = listener.address().port
    const link = `http://${host}:${port}/voyager`
    console.log('Serving voyager at %s', link)
    opn(link)
  });
}
