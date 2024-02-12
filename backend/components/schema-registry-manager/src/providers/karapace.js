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
Object.defineProperty(exports, '__esModule', {value: true});
exports.getLastMessage =
  exports.deleteSchema =
  exports.checkCompatibilityOfNewSchema =
  exports.createSchema =
  exports.updateSchema =
  exports.getSchemaInfo =
  exports.getSchemaVersions =
  exports.getSchemas =
    void 0;
function getSchemas() {
  return __awaiter(this, void 0, void 0, function* () {
    return getData('subjects').then(response => {
      return response;
    });
  });
}
exports.getSchemas = getSchemas;
function getSchemaVersions(topicName) {
  return __awaiter(this, void 0, void 0, function* () {
    return getData(`subjects/${topicName}/versions`).then(response => {
      if (response.error_code && response.error_code.toString().includes('404') && !topicName.includes('-value')) {
        return Promise.reject('404 Not Found');
      }
      return response;
    });
  });
}
exports.getSchemaVersions = getSchemaVersions;
function getSchemaInfo(topicName, version) {
  return __awaiter(this, void 0, void 0, function* () {
    return getData(`subjects/${topicName}/versions/${version}`).then(response => {
      if (response.error_code && response.error_code.toString().includes('404') && !topicName.includes('-value')) {
        return Promise.reject('404 Not Found');
      }
      return response;
    });
  });
}
exports.getSchemaInfo = getSchemaInfo;
function updateSchema(topicName, schema) {
  return __awaiter(this, void 0, void 0, function* () {
    const body = {
      schema: JSON.stringify(Object.assign({}, JSON.parse(schema))),
    };
    return postData(`subjects/${topicName}/versions`, body).then(response => {
      if (response.error_code && response.error_code.toString().includes('404') && !topicName.includes('-value')) {
        return Promise.reject('404 Not Found');
      }
      if (response.id) return response;
      if (response.message) return Promise.reject(response.message);
      return Promise.reject('Unknown Error');
    });
  });
}
exports.updateSchema = updateSchema;
function createSchema(topicName, schema) {
  return __awaiter(this, void 0, void 0, function* () {
    const body = {
      schema: JSON.stringify(Object.assign({}, JSON.parse(schema))),
    };
    return postData(`subjects/${topicName}/versions`, body)
      .then(response => {
        if (response.id) return response;
        if (response.message) return Promise.reject(response.message);
        return Promise.reject('Unknown Error');
      })
      .catch(e => {
        return Promise.reject(e);
      });
  });
}
exports.createSchema = createSchema;
function checkCompatibilityOfNewSchema(topicName, schema, version) {
  return __awaiter(this, void 0, void 0, function* () {
    const body = {
      schema: JSON.stringify(Object.assign({}, JSON.parse(schema))),
    };
    return postData(`compatibility/subjects/${topicName}/versions/${version}`, body)
      .then(response => {
        if (response.error_code && response.error_code.toString().includes('404') && !topicName.includes('-value')) {
          return Promise.reject('404 Not Found');
        }
        if (response.is_compatible !== undefined) {
          if (response.is_compatible === true) {
            return response;
          }
          return Promise.reject('Schema Not Compatible');
        }
        if (response.message) return Promise.reject(response.message);
        return Promise.reject('Unknown Error');
      })
      .catch(e => {
        return Promise.reject(e);
      });
  });
}
exports.checkCompatibilityOfNewSchema = checkCompatibilityOfNewSchema;
function deleteSchema(topicName) {
  return __awaiter(this, void 0, void 0, function* () {
    return deleteData(`subjects/${topicName}`).then(response => {
      if (response.error_code && response.error_code.toString().includes('404') && !topicName.includes('-value')) {
        return Promise.reject('404 Not Found');
      }
      return response;
    });
  });
}
exports.deleteSchema = deleteSchema;
function getLastMessage(topicName) {
  return __awaiter(this, void 0, void 0, function* () {
    const body = {
      ksql: `PRINT '${topicName}' FROM BEGINNING LIMIT 1;`,
      streamsProperties: {},
    };
    return postData('query', body).then(response => {
      console.log(response);
      return response;
    });
  });
}
exports.getLastMessage = getLastMessage;
function getData(url) {
  return __awaiter(this, void 0, void 0, function* () {
    const response = yield fetch(process.env.URL + '/' + url, {
      method: 'GET',
    });
    return response.json();
  });
}
function deleteData(url) {
  return __awaiter(this, void 0, void 0, function* () {
    const response = yield fetch(process.env.URL + '/' + url, {
      method: 'DELETE',
    });
    return response.json();
  });
}
function postData(url, body) {
  return __awaiter(this, void 0, void 0, function* () {
    const response = yield fetch(process.env.URL + '/' + url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.schemaregistry.v1+json',
      },
      body: JSON.stringify(body),
    });
    return response.json();
  });
}
