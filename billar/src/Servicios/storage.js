import AsyncStorage from '@react-native-async-storage/async-storage';
import socketData from '../config/socket.json';
const setAsynStora = async data => {
  await AsyncStorage.setItem(data.nombre, data.send);
};
const getAsynStora = async text => {
  try {
    const value = await AsyncStorage.getItem(text);
    if (value !== null) {
      return value;
    }
  } catch (e) {
    return false;
  }
};
const getLog = async text => {
  console.log(text);
  return text;
};


const storage = {
  setAsynStora,
  getAsynStora,
};

export default storage;
