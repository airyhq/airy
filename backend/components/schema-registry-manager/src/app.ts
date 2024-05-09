import dotenv from 'dotenv';
import express, {Express, Request as ExpressRequest, Response as ExpressResponse} from 'express';
import http from 'http';
import cors from 'cors';

import {SchemaProvider} from './types';
import {
  checkCompatibilityOfNewSchema,
  createSchema,
  deleteSchema,
  getLastMessage,
  getSchemaInfo,
  getSchemaVersions,
  getSchemas,
  updateSchema,
} from './providers/karapace';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const currentProvider: SchemaProvider = SchemaProvider.karapace;

// Middleware
app.use(bodyParser.json());

// CORS options
const corsOptions = {
  origin: 'http://localhost:8080',
};

// Use cors middleware with the specified options
app.use(cors(corsOptions));

app.get('/schemas.provider', (req: ExpressRequest, res: ExpressResponse) => {
  res.status(200).send(currentProvider);
});

app.get('/schemas.list', (req: ExpressRequest, res: ExpressResponse) => {
  switch (currentProvider) {
    case SchemaProvider.karapace:
      getSchemas(req.get('host') as string)
        .then((response: string[]) => {
          res.send(response);
        })
        .catch((e: any) => {
          res.status(500).send(e);
        });
      break;
    default:
      res.status(404).send('Provider Not Found');
      break;
  }
});

app.get('/schemas.versions', (req: ExpressRequest, res: ExpressResponse) => {
  if (!req.query.topicName) {
    res.status(400).send('Missing topicName');
    return;
  }

  switch (currentProvider) {
    case SchemaProvider.karapace:
      getSchemaVersions(req.get('host') as string, req.query.topicName as string)
        .then((response: any) => {
          res.status(200).send(response);
        })
        .catch((e: any) => {
          res.status(500).send(e);
        });
      break;
    default:
      res.status(404).send('Provider Not Found');
      break;
  }
});

app.get('/schemas.info', (req: ExpressRequest, res: ExpressResponse) => {
  if (!req.query.topicName) {
    res.status(400).send('Missing topicName');
    return;
  }

  let version = 'latest';
  if (req.query.version) {
    version = req.query.version as string;
  }

  switch (currentProvider) {
    case SchemaProvider.karapace:
      getSchemaInfo(req.get('host') as string, req.query.topicName as string, version)
        .then((response: any) => {
          res.status(200).send(response);
        })
        .catch((e: any) => {
          res.status(500).send(e);
        });
      break;
    default:
      res.status(404).send('Provider Not Found');
      break;
  }
});

app.post('/schemas.update', (req: ExpressRequest, res: ExpressResponse) => {
  if (!req.query.topicName) {
    res.status(400).send('Missing topicName');
    return;
  }
  if (!req.body.schema) {
    res.status(400).send('Missing schema');
    return;
  }

  switch (currentProvider) {
    case SchemaProvider.karapace:
      updateSchema(req.get('host') as string, req.query.topicName as string, req.body.schema as string)
        .then((response: any) => {
          res.status(200).send(response);
        })
        .catch((e: any) => {
          res.status(500).send(e);
        });
      break;
    default:
      res.status(404).send('Provider Not Found');
      break;
  }
});

app.post('/schemas.create', (req: ExpressRequest, res: ExpressResponse) => {
  if (!req.query.topicName) {
    res.status(400).send('Missing topicName');
    return;
  }
  if (!req.body.schema) {
    res.status(400).send('Missing schema');
    return;
  }

  switch (currentProvider) {
    case SchemaProvider.karapace:
      createSchema(req.get('host') as string, req.query.topicName as string, req.body.schema as string)
        .then((response: any) => {
          res.status(200).send(response);
        })
        .catch((e: any) => {
          res.status(500).send(e);
        });
      break;
    default:
      res.status(404).send('Provider Not Found');
      break;
  }
});

app.post('/schemas.compatibility', (req: ExpressRequest, res: ExpressResponse) => {
  if (!req.query.topicName) {
    res.status(400).send('Missing topicName');
    return;
  }
  if (!req.query.version) {
    res.status(400).send('Missing version');
    return;
  }
  if (!req.body.schema) {
    res.status(400).send('Missing schema');
    return;
  }

  switch (currentProvider) {
    case SchemaProvider.karapace:
      checkCompatibilityOfNewSchema(
        req.get('host') as string,
        req.query.topicName as string,
        req.body.schema as string,
        req.query.version as string
      )
        .then((response: any) => {
          res.status(200).send(response);
        })
        .catch((e: any) => {
          res.status(500).send(e);
        });
      break;
    default:
      res.status(404).send('Provider Not Found');
      break;
  }
});

app.post('/schemas.delete', (req: ExpressRequest, res: ExpressResponse) => {
  if (!req.query.topicName) {
    res.status(400).send('Missing topicName');
    return;
  }

  switch (currentProvider) {
    case SchemaProvider.karapace:
      deleteSchema(req.get('host') as string, req.query.topicName as string)
        .then((response: any) => {
          res.status(200).send(response);
        })
        .catch((e: any) => {
          res.status(500).send(e);
        });
      break;
    default:
      res.status(404).send('Provider Not Found');
      break;
  }
});

app.get('/schemas.lastMessage', (req: ExpressRequest, res: ExpressResponse) => {
  if (!req.query.topicName) {
    res.status(400).send('Missing topicName');
    return;
  }

  switch (currentProvider) {
    case SchemaProvider.karapace:
      getLastMessage(req.get('host') as string, req.query.topicName as string)
        .then((response: any) => {
          res.status(200).send(response);
        })
        .catch((e: any) => {
          res.status(500).send(e);
        });
      break;
    default:
      res.status(404).send('Provider Not Found');
      break;
  }
});

async function startHealthcheck() {
  const server = http.createServer((req: any, res: any) => {
    if (req.url === '/actuator/health' && req.method === 'GET') {
      const response = {status: 'UP'};
      const jsonResponse = JSON.stringify(response);

      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(jsonResponse);
    } else {
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end('Not Found');
    }
  });

  server.listen(80, () => {
    console.log('Health-check started');
  });
}

async function main() {
  startHealthcheck();
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

main().catch(console.error);
