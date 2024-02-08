export async function getSchemas() {
  return getData('subjects').then(response => {      
    return response;
  });
};
  
export async function getSchemaVersions(topicName: string) {
  return getData(`subjects/${topicName}/versions`).then(response => {
    if (response.error_code && response.error_code.toString().includes('404') && !topicName.includes('-value')) {
      return Promise.reject('404 Not Found');
    }
    return response;    
  });
};

export async function getSchemaInfo(topicName: string, version: string) {  
  return getData(`subjects/${topicName}/versions/${version}`).then(response => {
    if (response.error_code && response.error_code.toString().includes('404') && !topicName.includes('-value')) {
      return Promise.reject('404 Not Found');
    }
    return response;
  });
};
  
export async function updateSchema(topicName: string, schema: string) {
  const body = {
    schema: JSON.stringify({...JSON.parse(schema)}),
  };
  return postData(`subjects/${topicName}/versions`, body).then(response => {
    if (response.error_code && response.error_code.toString().includes('404') && !topicName.includes('-value')) {
      return Promise.reject('404 Not Found');
    }
    if (response.id) return response;
    if (response.message) return Promise.reject(response.message);
    return Promise.reject('Unknown Error');
  });
};
  
export async function createSchema(topicName: string, schema: string) {
  const body = {
    schema: JSON.stringify({...JSON.parse(schema)}),
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
};
  
export async function checkCompatibilityOfNewSchema(topicName: string, schema: string, version: number) {
  const body = {
    schema: JSON.stringify({...JSON.parse(schema)}),
  };
  return postData(`compatibility/subjects/${topicName}/versions/${version}`, body)
    .then(response => {
      if (response.error_code && response.error_code.toString().includes('404') && !topicName.includes('-value')) {
        return Promise.reject('404 Not Found');
      }
      if (response.is_compatible !== undefined) {
        if (response.is_compatible === true) {
          return Promise.resolve(true);
        }
        return Promise.reject('Schema Not Compatible');
      }
      if (response.message) return Promise.reject(response.message);
      return Promise.reject('Unknown Error');
    })
    .catch(e => {
      return Promise.reject(e);
    });
};
  
//   export const deleteSchema = (topicName: string) => async () => {
//     return deleteData(`subjects/${topicName}`).then(response => {
//       if (response.error_code && response.error_code.toString().includes('404') && !topicName.includes('-value')) {
//         return Promise.reject('404 Not Found');
//       }
//       return Promise.resolve(true);
//     });
//   };
  
//   export const getLastMessage = (topicName: string) => async (dispatch: Dispatch<any>) => {
//     const body = {
//       ksql: `PRINT '${topicName}' FROM BEGINNING LIMIT 1;`,
//       streamsProperties: {},
//     };
//     return postData('query', body).then(response => {
//       dispatch(setLastMessage(response));
//       return Promise.resolve(true);
//     });
//   };
  
  async function getData(url: string) {
    const response = await fetch(process.env.URL + '/' + url, {
      method: 'GET',
    });
    return response.json();
  }
  
  async function deleteData(url: string) {
    const response = await fetch(process.env.URL + '/' + url, {
      method: 'DELETE',
    });
    return response.json();
  }
  
  async function postData(url: string, body: any) {
    const response = await fetch(process.env.URL + '/' + url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.schemaregistry.v1+json',
      },
      body: JSON.stringify(body),
    });
  
    return response.json();
  }