
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import { SchemaProvider } from "./types";
import { createSchema, getSchemaInfo, getSchemaVersions, getSchemas, updateSchema } from "./providers/karapace";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const currentProvider: SchemaProvider = SchemaProvider.karapace;

// Middleware
app.use(bodyParser.json());

app.get('/schemas.provider', (req: Request, res: Response) => {
  res.status(200).send(currentProvider);  
});

app.get('/schemas.list', (req: Request, res: Response) => {
  switch (currentProvider) {
    case SchemaProvider.karapace:
      getSchemas().then((response: string[]) => {        
        res.send(response);      
      }).catch((e: any) => {
        res.status(500).send(e);
      });      
      break;    
    default:
      res.status(404).send('Provider Not Found');
      break;
  }  
});

app.get('/schemas.versions', (req: Request, res: Response) => {
  if (!req.query.topicName) {
    res.status(400).send('Missing topicName');
    return;
  }

  switch (currentProvider) {
    case SchemaProvider.karapace:
      getSchemaVersions(req.query.topicName as string).then((response: any) => {
        res.status(200).send(response);
      }).catch((e: any) => {
        res.status(500).send(e);
      });    
      break;    
    default:
      res.status(404).send('Provider Not Found');
      break;
  }  
});

app.get('/schemas.info', (req: Request, res: Response) => {
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
      getSchemaInfo(req.query.topicName as string, version).then((response: any) => {
        res.status(200).send(response);
      }).catch((e: any) => {
        res.status(500).send(e);
      });    
      break;    
    default:
      res.status(404).send('Provider Not Found');
      break;
  }  
});

app.post('/schemas.update', (req: Request, res: Response) => {
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
      updateSchema(req.query.topicName as string, req.body.schema as string).then((response: any) => {
        res.status(200).send(response);
      }).catch((e: any) => {
        res.status(500).send(e);
      });    
      break;    
    default:
      res.status(404).send('Provider Not Found');
      break;
  }  
});

app.post('/schemas.create', (req: Request, res: Response) => {
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
      createSchema(req.query.topicName as string, req.body.schema as string).then((response: any) => {
        res.status(200).send(response);
      }).catch((e: any) => {
        res.status(500).send(e);
      });    
      break;    
    default:
      res.status(404).send('Provider Not Found');
      break;
  }  
});

app.post('/schemas.compatibility', (req: Request, res: Response) => {
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
      createSchema(req.query.topicName as string, req.body.schema as string).then((response: any) => {
        res.status(200).send(response);
      }).catch((e: any) => {
        res.status(500).send(e);
      });    
      break;    
    default:
      res.status(404).send('Provider Not Found');
      break;
  }  
});

async function main() {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

main().catch(console.error);