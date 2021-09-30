import AsyncStorage from '@react-native-community/async-storage';

export const USER_KEY = 'user-async-key';
export const CONFIG_KEY = 'user-config-key';

export const onSignIn = async (credentials) => await AsyncStorage.setItem(USER_KEY, JSON.stringify(credentials));

export const onSignOut = async () => await AsyncStorage.removeItem(USER_KEY);

export const isSignedIn = async () => {
  let credentials = await AsyncStorage.getItem(USER_KEY);
  if (credentials) {
    return JSON.parse(credentials);
  }
  return null;
};

export const getCredentials = async () => JSON.parse(await AsyncStorage.getItem(USER_KEY));
export const getToken = async () => JSON.parse(await AsyncStorage.getItem(USER_KEY)).access_token;


export const getConfig = async () => JSON.parse(await AsyncStorage.getItem(CONFIG_KEY));
export const setConfig = async config => await AsyncStorage.setItem(CONFIG_KEY, JSON.stringify(config));
