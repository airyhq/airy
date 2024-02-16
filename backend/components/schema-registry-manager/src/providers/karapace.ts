export async function getSchemas(host: string) {
  return getData(host, 'subjects').then(response => {
    return response;
  });
}

export async function getSchemaVersions(host: string, topicName: string) {
  return getData(host, `subjects/${topicName}/versions`).then(response => {
    if (response.error_code && response.error_code.toString().includes('404') && !topicName.includes('-value')) {
      return Promise.reject('404 Not Found');
    }
    return response;
  });
}

export async function getSchemaInfo(host: string, topicName: string, version: string) {
  return getData(host, `subjects/${topicName}/versions/${version}`).then(response => {
    if (response.error_code && response.error_code.toString().includes('404') && !topicName.includes('-value')) {
      return Promise.reject('404 Not Found');
    }
    return response;
  });
}

export async function updateSchema(host: string, topicName: string, schema: string) {
  const body = {
    schema: JSON.stringify({...JSON.parse(schema)}),
  };
  return postData(host, `subjects/${topicName}/versions`, body).then(response => {
    if (response.error_code && response.error_code.toString().includes('404') && !topicName.includes('-value')) {
      return Promise.reject('404 Not Found');
    }
    if (response.id) return response;
    if (response.message) return Promise.reject(response.message);
    return Promise.reject('Unknown Error');
  });
}

export async function createSchema(host: string, topicName: string, schema: string) {
  const body = {
    schema: JSON.stringify({...JSON.parse(schema)}),
  };
  return postData(host, `subjects/${topicName}/versions`, body)
    .then(response => {
      if (response.id) return response;
      if (response.message) return Promise.reject(response.message);
      return Promise.reject('Unknown Error');
    })
    .catch(e => {
      return Promise.reject(e);
    });
}

export async function checkCompatibilityOfNewSchema(host: string, topicName: string, schema: string, version: string) {
  const body = {
    schema: JSON.stringify({...JSON.parse(schema)}),
  };

  return postData(host, `compatibility/subjects/${topicName}/versions/${version}`, body)
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
}

export async function deleteSchema(host: string, topicName: string) {
  return deleteData(host, `subjects/${topicName}`).then(response => {
    if (response.error_code && response.error_code.toString().includes('404') && !topicName.includes('-value')) {
      return Promise.reject('404 Not Found');
    }
    return response;
  });
}

export async function getLastMessage(host: string, topicName: string) {
  const body = {
    ksql: `PRINT '${topicName}' FROM BEGINNING LIMIT 1;`,
    streamsProperties: {},
  };
  return postData(host, 'query', body).then(response => {
    return response;
  });
}

async function getData(host: string, url: string) {
  const response = await fetch('https://' + host + '/' + url, {
    method: 'GET',
  });
  return response.json();
}

async function deleteData(host: string, url: string) {
  const response = await fetch('https://' + host + '/' + url, {
    method: 'DELETE',
  });
  return response.json();
}

async function postData(host: string, url: string, body: any) {
  const response = await fetch('https://' + host + '/' + url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/vnd.schemaregistry.v1+json',
    },
    body: JSON.stringify(body),
  });

  return response.json();
}
