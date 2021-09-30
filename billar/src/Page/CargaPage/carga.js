import React from 'react';
import {View} from 'react-native';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as serviciosActions from '../../Actions/serviciosActions';
import * as sucursalActions from '../../Actions/sucursalActions';
import * as productoActions from '../../Actions/productoActions';

const Carga = props => {
  const [obj, setObj] = React.useState(false);
  const ShowPage = () => {
    return <View></View>;
  };
  const delay = ms => new Promise(res => setTimeout(res, ms));
  const yourFunction = async () => {
    await delay(4000);
  };
  const getUsuario = async () => {
    const value = await AsyncStorage.getItem('usuario');
    if (value !== null) {
      props.state.usuarioReducer.usuarioLog = JSON.parse(value);
      yourFunction();
      setObj(true);
      return;
    }
    props.state.usuarioReducer.usuarioLog = false;
    yourFunction();
    setObj(true);
    return;
  };
  if (obj) {
    if (!props.state.socketReducer.socket) {
      return <View />;
    }
    var usuario = props.state.usuarioReducer.usuarioLog;
    if (!usuario) {
      props.state.usuarioReducer.estado = '';
      props.navigation.replace('login');
      return <ShowPage />;
    }
    if (!usuario.sucursal) {
      props.navigation.replace('sucursal');
      return <ShowPage />;
    }

    
    if (
      props.state.productosReducer.estado === 'cargando' &&
      props.state.productosReducer.type === 'getAllTipoProducto'
    ) {
      return <ShowPage />;
    }
    if (!props.state.productosReducer.dataTipoProducto) {
      props.getAllTipoProducto(props.state.socketReducer.socket, {
        key_sucursal: usuario.sucursal.key,
      });
      return <ShowPage />;
    }
    if (
      props.state.serviciosReducer.estado === 'cargando' &&
      props.state.serviciosReducer.type === 'getAllMesaBillar'
    ) {
      return <ShowPage />;
    }
    if (!props.state.serviciosReducer.dataMesaBillar) {
      props.getAllMesaBillar(props.state.socketReducer.socket, {
        key_sucursal: usuario.sucursal.key,
      });
      return <ShowPage />;
    }

    if (
      props.state.serviciosReducer.estado === 'cargando' &&
      props.state.serviciosReducer.type === 'getAllPrecioTiempo'
    ) {
      return <ShowPage />;
    }
    if (!props.state.serviciosReducer.dataPrecioTiempo) {
      props.getAllPrecioTiempo(props.state.socketReducer.socket);
      return <ShowPage />;
    }

    if (
      props.state.serviciosReducer.estado === 'cargando' &&
      props.state.serviciosReducer.type === 'getAlllMesa'
    ) {
      return <ShowPage />;
    }
    if (!props.state.serviciosReducer.dataMesa) {
      props.getAlllMesa(props.state.socketReducer.socket, {
        key_sucursal: usuario.sucursal.key,
      });
      return <ShowPage />;
    }

    props.navigation.replace('inicio');
  } else {
    getUsuario();
  }
  return <ShowPage />;
};
const initStates = state => {
  return {state};
};
const initActions = {
  ...serviciosActions,
  ...productoActions,
  ...sucursalActions,
};
export default connect(initStates, initActions)(Carga);
