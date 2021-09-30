/**
 * @format
 */

import {AppRegistry, LogBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
LogBox.ignoreAllLogs();
LogBox.ignoreLogs(['Warning', 'VirtualizedLists', 'Animated','NativeUIManager','AsyncStorage']);

AppRegistry.registerComponent(appName, () => App);
