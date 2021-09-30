import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Dimensions,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg from '../../Svg';
import * as usuarioActions from '../../Actions/usuarioActions';
import * as sucursalActions from '../../Actions/sucursalActions';
import * as productoActions from '../../Actions/productoActions';
import * as serviciosActions from '../../Actions/serviciosActions';
import Estado from '../../Componente/estado';
import tema from '../../config/style.json';

const initActions = {
  ...usuarioActions,
  ...sucursalActions,
  ...productoActions,
  ...serviciosActions,
};
const initStates = state => {
  return {state};
};
class SucursalesPage extends Component {
  static navigationOptions = {
    headerShown: false,
  };
  constructor(props) {
    super(props);

    var key_usuario = props.state.usuarioReducer.usuarioLog.key;
    this.state = {
      key_usuario,
      estado: false,
      selectSucursal: false,
    };
  }
  seleccionSucursal(sucursal) {
    var usuario = this.props.state.usuarioReducer.usuarioLog;
    this.props.state.sucursalReducer.dataSelectSucursal = sucursal;
    this.state.selectSucursal = sucursal;
    this.state.estado = true;
    usuario['sucursal'] = sucursal;
    AsyncStorage.setItem('usuario', JSON.stringify(usuario));
    this.props.navigation.replace('carga');
    this.setState({...this.state});
    return <View />;
  }
  estado() {
    if (!this.state.estado) {
      return <View />;
    }

    if (
      this.props.state.productosReducer.estado === 'cargando' &&
      this.props.state.productosReducer.type === 'getAllTipoProducto'
    ) {
      return <Estado estado="" />;
    }
    if (!this.props.state.productosReducer.dataTipoProducto) {
      this.props.getAllTipoProducto(this.props.state.socketReducer.socket, {
        key_sucursal: this.state.selectSucursal.key,
      });
      return <Estado estado="" />;
    }
    if (
      this.props.state.productosReducer.estado === 'cargando' &&
      this.props.state.productosReducer.type === 'getAllProducto'
    ) {
      return <Estado estado="" />;
    }
    if (!this.props.state.productosReducer.dataProducto) {
      this.props.getAllProducto(this.props.state.socketReducer.socket, {
        key_sucursal: this.state.selectSucursal.key,
      });
      return <Estado estado="" />;
    }
    if (
      this.props.state.serviosReducer.estado === 'cargando' &&
      this.props.state.serviosReducer.type === 'getAllMesaBillar'
    ) {
      return <Estado estado="" />;
    }
    if (!this.props.state.serviosReducer.dataMesaBillar) {
      this.props.getAllMesaBillar(this.props.state.socketReducer.socket, {
        key_sucursal: this.state.selectSucursal.key,
      });
      return <Estado estado="" />;
    }

    if (
      this.props.state.serviosReducer.estado === 'cargando' &&
      this.props.state.serviosReducer.type === 'getAlllMesa'
    ) {
      return <Estado estado="" />;
    }
    if (!this.props.state.serviosReducer.dataMesa) {
      this.props.getAlllMesa(this.props.state.socketReducer.socket, {
        key_sucursal: this.state.selectSucursal.key,
      });
      return <Estado estado="" />;
    }
    this.state.estado = false;
    this.setState({...this.state});
    this.props.navigation.replace('inicio');
    return <View />;
  }
  render() {
    if (this.props.state.sucursalReducer.estado === 'cargando') {
      return <Estado estado={'cargando'} />;
    }
    if (!this.props.state.sucursalReducer.dataGetSucursal) {
      var data = {
        key_usuario: this.state.key_usuario,
      };
      this.props.getSucursal(this.props.state.socketReducer.socket, data);
      return <Estado estado={'cargando'} />;
    }
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: tema.fondo,
          width: '100%',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontSize: 25,
            marginTop: 10,
            width: '100%',
            textAlign: 'center',
            fontWeight: 'bold',
            color: '#fff',
          }}>
          SUCURSALES
        </Text>

        <View
          style={{
            flex: 1,
            alignItems: 'center',
            marginTop: 50,
            width: '100%',
          }}>
          <FlatList
            style={{width: '100%'}}
            data={this.props.state.sucursalReducer.dataGetSucursal}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => this.seleccionSucursal(item.sucursales)}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  borderColor: '#999',
                  padding: 12,
                }}>
                <Text
                  style={{
                    fontSize: 15,
                    marginTop: 10,
                    fontWeight: 'bold',
                    color: '#fff',
                  }}>
                  {item.sucursales.nombre.toLowerCase()}
                </Text>
                <Svg
                  name={'sucursales'}
                  style={{
                    width: 80,
                    height: 80,
                  }}></Svg>
                {this.estado()}
                <Text
                  style={{
                    fontSize: 12,
                    marginTop: 10,
                    color: '#fff',
                  }}>
                  {item.sucursales.direccion}
                </Text>
              </TouchableOpacity>
            )}
            numColumns={2}
          />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  input: {
    backgroundColor: '#ffffff',
    color: '#000',
    marginTop: 10,
    borderRadius: 8,
    width: '100%',
    height: 40,
  },
  error: {
    borderWidth: 2,
    borderColor: '#f00',
    backgroundColor: '#ffffff',
    color: '#000',
    marginTop: 10,
    borderRadius: 8,
    width: '100%',
    height: 40,
  },
});

export default connect(initStates, initActions)(SucursalesPage);
