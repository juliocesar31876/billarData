import socketData from './../config/socket.json';
import RNFS from 'react-native-fs';
import * as ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';

const enviarFoto = async (
  uri,
  name = 'archivo',
  body = null,
  method = 'POST',
) => {
  try {
    let formData = [];
    let imageInfo = getImageInfo(uri);
    formData.push({
      name,
      filename: imageInfo.name,
      type: imageInfo.type,
      data: RNFetchBlob.wrap(uri),
    });
    if (body) {
      formData.push(...buildFileBodyRequest(body));
    }
    if (method !== 'POST') {
      formData.push({
        name: '_method',
        data: method,
      });
    }
    let headers = {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    };
    var url = socketData.url_foto;
    let response = await RNFetchBlob.fetch('POST', url, headers, formData);
    console.log(response);
    return true;
  } catch (e) {
    console.warn('EXCEPTION', e.stack, e.message);
    return false;
  }
};
let buildParamsUrl = params => {
  let paramsRequest = '';
  let arrayObject = Object.entries(params);
  arrayObject.forEach(value => {
    paramsRequest +=
      encodeURIComponent(value[0]) + '=' + encodeURIComponent(value[1]) + '&';
  });
  paramsRequest = paramsRequest.substring(0, paramsRequest.length - 1);
  return paramsRequest;
};
let buildFileBodyRequest = body => {
  let entries = Object.entries(body);
  let result = [];
  for (let i = 0; i < entries.length; i++) {
    let entry = entries[i];
    let typeOfEntry = typeof entry[1];
    let initialName = entry[0];
    if (typeOfEntry === 'string') {
      result.push({
        name: initialName,
        data: entry[1],
      });
    } else if (typeOfEntry === 'number') {
      result.push({
        name: initialName,
        data: entry[1].toString(),
      });
    } else if (entry[1] === null || typeOfEntry === 'undefined') {
      result.push({
        name: initialName,
        data: '',
      });
    } else if (typeOfEntry === 'boolean') {
      result.push({
        name: initialName,
        data: entry[1] ? '1' : '0',
      });
    } else if (typeOfEntry === 'object') {
      if (Array.isArray(entry[1])) {
        entry[1].forEach((item, index) =>
          result.push({
            name: initialName + '[' + index + ']',
            data: typeof item === 'number' ? item.toString() : item,
          }),
        );
      } else {
        let newObject = entry[1];
        let newEntries = Object.entries(newObject);
        result.push(
          newEntries.map((newEntry, index) => ({
            name: initialName + '[' + newEntry[0] + ']',
            data: newEntry[1],
          })),
        );
      }
    } else {
      result.push({
        name: initialName,
        data: '',
      });
    }
  }
  return result;
};
let getImageInfo = uri => {
  let extension = uri.substr(uri.length - 4);
  extension =
    uri.indexOf('.') > 0 ? extension.substr(extension.length - 3) : extension;

  return {
    type: 'image/' + extension,
    name: getRandomInt(10000000, 9999999) + '.' + extension,
  };
};
let getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const galeria = funcion => {
  ImagePicker.launchImageLibrary(
    {
      mediaType: 'photo',
      includeBase64: false,
      maxWidth: 500,
      maxHeight: 500,
    },
    response => {
      if (!response.didCancel) {
        console.log(response.assets[0]);
        var uri = response.assets[0].uri;
        var name = response.assets[0].fileName;
        var archivo = response.assets[0];
        var data = {
          uri,
          name,
          archivo,
        };
        funcion(data);
      }
      funcion(false);
    },
  );
};
const foto = funcion => {
  ImagePicker.launchCamera(
    {
      mediaType: 'photo',
      includeBase64: false,
      maxWidth: 500,
      maxHeight: 500,
    },
    response => {
      if (!response.didCancel) {
        console.log(response.assets[0]);
        var uri = response.assets[0].uri;
        var name = response.assets[0].fileName;
        var archivo = response.assets[0];
        var data = {
          uri,
          name,
          archivo,
        };
        funcion(data);
      }
      funcion(false);
    },
  );
};
const servicioFoto = {
  galeria,
  foto,
  enviarFoto,
};

export default servicioFoto;
