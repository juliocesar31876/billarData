import React, {useEffect} from 'react';
import {SafeAreaView, StatusBar, View} from 'react-native';
///navigation
import Navigation from './src/navigation';
///reducx
import {createStore, applyMiddleware} from 'redux';
import Reducer from './src/Reducer';
import reduxThunk from 'redux-thunk';
import {Provider} from 'react-redux';
import {servicioSocket} from './src/Servicios';
///Popup
import Popup from './src/Componente/popup';
const store = createStore(Reducer, {}, applyMiddleware(reduxThunk));
const App = () => {
  useEffect(() => {
    servicioSocket.iniciandoSocket(store)
  });
  return (
    <Provider store={store}>
      <SafeAreaView style={{backgroundColor: '#fff'}}>
        <StatusBar hidden={true} />
        <View
          style={{
            width: '100%',
            height: '100%',
          }}>
          <Navigation />
        <Popup/>
        </View>
      </SafeAreaView>
    </Provider>
  );
};
export default App;
