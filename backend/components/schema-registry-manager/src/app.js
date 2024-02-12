'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : {default: mod};
  };
Object.defineProperty(exports, '__esModule', {value: true});
const dotenv_1 = __importDefault(require('dotenv'));
const express_1 = __importDefault(require('express'));
const types_1 = require('./types');
const karapace_1 = require('./providers/karapace');
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const currentProvider = types_1.SchemaProvider.karapace;
// Middleware
app.use(bodyParser.json());
app.get('/schemas.provider', (req, res) => {
  res.status(200).send(currentProvider);
});
app.get('/schemas.list', (req, res) => {
  switch (currentProvider) {
    case types_1.SchemaProvider.karapace:
      (0, karapace_1.getSchemas)()
        .then(response => {
          res.send(response);
        })
        .catch(e => {
          res.status(500).send(e);
        });
      break;
    default:
      res.status(404).send('Provider Not Found');
      break;
  }
});
app.get('/schemas.versions', (req, res) => {
  if (!req.query.topicName) {
    res.status(400).send('Missing topicName');
    return;
  }
  switch (currentProvider) {
    case types_1.SchemaProvider.karapace:
      (0, karapace_1.getSchemaVersions)(req.query.topicName)
        .then(response => {
          res.status(200).send(response);
        })
        .catch(e => {
          res.status(500).send(e);
        });
      break;
    default:
      res.status(404).send('Provider Not Found');
      break;
  }
});
app.get('/schemas.info', (req, res) => {
  if (!req.query.topicName) {
    res.status(400).send('Missing topicName');
    return;
  }
  let version = 'latest';
  if (req.query.version) {
    version = req.query.version;
  }
  switch (currentProvider) {
    case types_1.SchemaProvider.karapace:
      (0, karapace_1.getSchemaInfo)(req.query.topicName, version)
        .then(response => {
          res.status(200).send(response);
        })
        .catch(e => {
          res.status(500).send(e);
        });
      break;
    default:
      res.status(404).send('Provider Not Found');
      break;
  }
});
app.post('/schemas.update', (req, res) => {
  if (!req.query.topicName) {
    res.status(400).send('Missing topicName');
    return;
  }
  if (!req.body.schema) {
    res.status(400).send('Missing schema');
    return;
  }
  switch (currentProvider) {
    case types_1.SchemaProvider.karapace:
      (0, karapace_1.updateSchema)(req.query.topicName, req.body.schema)
        .then(response => {
          res.status(200).send(response);
        })
        .catch(e => {
          res.status(500).send(e);
        });
      break;
    default:
      res.status(404).send('Provider Not Found');
      break;
  }
});
app.post('/schemas.create', (req, res) => {
  if (!req.query.topicName) {
    res.status(400).send('Missing topicName');
    return;
  }
  if (!req.body.schema) {
    res.status(400).send('Missing schema');
    return;
  }
  switch (currentProvider) {
    case types_1.SchemaProvider.karapace:
      (0, karapace_1.createSchema)(req.query.topicName, req.body.schema)
        .then(response => {
          res.status(200).send(response);
        })
        .catch(e => {
          res.status(500).send(e);
        });
      break;
    default:
      res.status(404).send('Provider Not Found');
      break;
  }
});
app.post('/schemas.compatibility', (req, res) => {
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
    case types_1.SchemaProvider.karapace:
      (0, karapace_1.checkCompatibilityOfNewSchema)(req.query.topicName, req.body.schema, req.query.version)
        .then(response => {
          res.status(200).send(response);
        })
        .catch(e => {
          res.status(500).send(e);
        });
      break;
    default:
      res.status(404).send('Provider Not Found');
      break;
  }
});
app.post('/schemas.delete', (req, res) => {
  if (!req.query.topicName) {
    res.status(400).send('Missing topicName');
    return;
  }
  switch (currentProvider) {
    case types_1.SchemaProvider.karapace:
      (0, karapace_1.deleteSchema)(req.query.topicName)
        .then(response => {
          res.status(200).send(response);
        })
        .catch(e => {
          res.status(500).send(e);
        });
      break;
    default:
      res.status(404).send('Provider Not Found');
      break;
  }
});
app.get('/schemas.lastMessage', (req, res) => {
  if (!req.query.topicName) {
    res.status(400).send('Missing topicName');
    return;
  }
  switch (currentProvider) {
    case types_1.SchemaProvider.karapace:
      (0, karapace_1.getLastMessage)(req.query.topicName)
        .then(response => {
          console.log(response);
          res.status(200).send(response);
        })
        .catch(e => {
          res.status(500).send(e);
        });
      break;
    default:
      res.status(404).send('Provider Not Found');
      break;
  }
});
function main() {
  return __awaiter(this, void 0, void 0, function* () {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  });
}
main().catch(console.error);
