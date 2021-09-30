import NetInfo from '@react-native-community/netinfo';
import RNFetchBlob from 'rn-fetch-blob';
import {getToken} from './auth';

let request = async (method, url, params = null, data = null, withToken = false) => {
  let netInfo = await NetInfo.fetch();
  if (!netInfo.isConnected) {
    return exceptionResponse('Porfavor, revise su conexion a internet.');
  }
  
  let paramsUrl = '';
  if (params) {
    paramsUrl = buildParamsUrl(params);
  }
  let options = {method};
  if (data) {
    options.body = JSON.stringify(data);
  }
  let headers = {
    Accept: 'application/json',
  };
  if (method === 'POST' || method === 'PUT') {
    headers['Content-Type'] = 'application/json';
  }
  if (withToken) {
    headers['Authorization'] = `Bearer ${await getToken()}`;
  }
  options.headers = headers;
  url = paramsUrl !== '' ? (url + '?' + paramsUrl) : url;
  try {
    let response = await fetch(url, options);
    return await response.json();
  } catch (e) {
    console.log('EXCEPTION', [e.message, e.name, e.stack], e);
    return exceptionResponse('Ocurrio un error al ejecutar la operación, porfavor intente mas tarde.');
  }
};

export const post = async (url, data, params = null, withToken = false) => {
  return await request('POST', url, params, data, withToken);
};
export const get = async (url, params = null, withToken = false) => {
  return await request('GET', url, params, null, withToken);
};
export const put = async (url, data, params = null, withToken = false) => {
  return await request('PUT', url, params, data, withToken);
};
export const destroy = async (url, params = null, withToken = false) => {
  return await request('DELETE', url, params, null, withToken);
};

let exceptionResponse = (message) => {
  return {
    status: false,
    errors: [message],
  };
};

let buildParamsUrl = (params) => {
  let paramsRequest = '';
  let arrayObject = Object.entries(params);
  arrayObject.forEach((value) => {
    paramsRequest += encodeURIComponent(value[0]) + '=' + encodeURIComponent(value[1]) + '&';
  });
  paramsRequest = paramsRequest.substring(0, paramsRequest.length - 1);
  return paramsRequest;
};


export const upload = async (uri, url, name='image', body = null, method = 'POST', params = null, withToken = false) => {
  try {
    let netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      return exceptionResponse('Porfavor, revise su conexion a internet.');
    }

    let paramsUrl = '';
    if (params) {
      paramsUrl = buildParamsUrl(params);
    }
    url = paramsUrl !== '' ? (url + '?' + paramsUrl) : url;
    let imageInfo = getImageInfo(uri);
    let formData = [{
      name,
      filename: imageInfo.name,
      type: imageInfo.type,
      data: RNFetchBlob.wrap(uri),
    }];


    if (body) {
      formData.push(...buildFileBodyRequest(body));
    }

    if(method !== 'POST'){
      formData.push({
        name:'_method',
        data: method
      })
    }
    let headers = {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    };
    if (withToken) {
      headers['Authorization'] = `Bearer ${await getToken()}`;
    }
    console.log(formData)
    let response = await RNFetchBlob.fetch('POST', url, headers, formData);
    return response.json();
  } catch (e) {
    console.warn('EXCEPTION', e.stack, e.message);
    return exceptionResponse('Ocurrio un error en la aplicacion al ejecutar la operación, porfavor intente mas tarde.');
  }
};
let getImageInfo = (uri) => {
  let extension = uri.substr(uri.length - 4);
  extension = uri.indexOf('.') > 0 ? extension.substr(extension.length - 3) : extension;

  return {
    type: 'image/' + extension,
    name: getRandomInt(10000000,9999999) + '.' + extension,
  };
};

let getRandomInt =(min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
}

let buildFileBodyRequest = (body) => {

  let entries = Object.entries(body)
  let result = []
  for (let i=0; i < entries.length;i++){
    let entry = entries[i]
    let typeOfEntry = typeof entry[1]
    let initialName = entry[0]
    if(typeOfEntry === 'string'){
      result.push({
        name: initialName,
        data: entry[1]
      })
    }else if(typeOfEntry === 'number'){
      result.push({
        name: initialName,
        data: entry[1].toString()
      })
    } else if(entry[1] === null || typeOfEntry === 'undefined'){
      result.push({
        name: initialName,
        data: ''
      })
    }else if (typeOfEntry === 'boolean'){
      result.push({
        name: initialName,
        data: entry[1] ? '1' : '0'
      })
    }else if(typeOfEntry === 'object'){
      if(Array.isArray(entry[1])){
        entry[1].forEach((item, index) => result.push({
          name: initialName+'['+index+']',
          data: typeof item === 'number' ? item.toString() : item
        }))
      }else{
        let newObject = entry[1]
        let newEntries = Object.entries(newObject)
        result.push(newEntries.map( (newEntry, index) => ({
          name: initialName+'['+newEntry[0]+']',
          data: newEntry[1]
        })))
      }
    }else{
      result.push({
        name: initialName,
        data: ''
      })
    }
  }
  return result;
};
