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
  StatusBar,
  FlatList,
} from 'react-native';
import Svg from '../../Svg';
import * as usuarioActions from '../../Actions/usuarioActions';
import * as serviciosActions from '../../Actions/serviciosActions';
import tema from '../../config/style.json';
import Barra from '../../Componente/barra';
import Estado from '../../Componente/estado';

const initActions = {
  ...usuarioActions,
  ...serviciosActions,
};
const initStates = state => {
  return {state};
};
class TotalLibroCajaPage extends Component {
  static navigationOptions = {
    headerShown: false,
  };
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    if (
      this.props.state.serviciosReducer.estado === 'cargando' &&
      this.props.state.serviciosReducer.type === 'totalLibroCaja'
    ) {
      return <Estado estado="cargando" />;
    }
    if (!this.props.state.serviciosReducer.dataTotalCaja) {
      this.props.totalLibroCaja(this.props.state.socketReducer.socket);
      return <Estado estado="cargando" />;
    }
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: tema.fondo,
          alignItems: 'center',
        }}>
        <Barra
          titulo={'Total caja'}
          navigation={this.props.navigation}
          funcion={() => {
            this.props.state.serviciosReducer.dataCaja = false;
          }}
        />
        <View
          style={{width: '95%', alignContent: 'center', flexDirection: 'row'}}>
          <Text style={{color: '#fff', flex: 1, textAlign: 'center'}}>
            Total Produccion :{' '}
            {this.props.state.serviciosReducer.totalPrecioProduccion} Bs
          </Text>
          <Text style={{color: '#fff', flex: 1, textAling: 'center'}}>
            Total Venta : {this.props.state.serviciosReducer.totalPrecioVenta}{' '}
            Bs
          </Text>
        </View>
        <View
          style={{
            marginTop: 15,
            flexDirection: 'row',
            width: '95%',
            alignItems: 'center',
            justifyContent: 'space-evenly',
          }}>
          <Text
            style={{
              flex: 1,
              margin: 5,
              color: '#fff',
              borderBottomWidth: 1,
              borderColor: '#fff',
              textAlign: 'center',
            }}>
            Nombre
          </Text>
          <Text
            style={{
              color: '#fff',
              borderBottomWidth: 1,
              borderColor: '#fff',
              margin: 5,
            }}>
            Precio/P
          </Text>
          <Text
            style={{
              color: '#fff',
              borderBottomWidth: 1,
              borderColor: '#fff',
              margin: 5,
            }}>
            Precio/V
          </Text>

          <Text
            style={{
              color: '#fff',
              borderBottomWidth: 1,
              borderColor: '#fff',
              margin: 5,
            }}>
            total Tiempo
          </Text>
        </View>
        <View
          style={{
            width: '90%',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
          }}>
          <Text style={{flex: 1, color: '#fff'}}>Total tiempo</Text>

          <Text style={{flex: 0.3, textAlign: 'center', color: '#fff'}}>
            {
              this.props.state.serviciosReducer.dataTotalCaja.objTiempo
                .total_tiempo
            }{' '}
            bs
          </Text>
        </View>
        <FlatList
          style={{width: '90%'}}
          data={this.props.state.serviciosReducer.dataTotalCaja.objProductos}
          renderItem={({item, index}) => {
            return (
              <View
                style={{
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'space-evenly',
                  flexDirection: 'row',
                  padding: 5,
                }}>
                <Text style={{color: '#fff', flex: 1, textAlign: 'left'}}>
                  {item.nombre}
                </Text>
                <Text style={{color: '#fff', textAlign: 'center'}}>
                  {item.precio_produccion} Bs
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    flex: 0.4,
                    margin: 5,
                    textAlign: 'center',
                  }}>
                  {item.precio_venta} bs
                </Text>
                <Text style={{flex: 0.4}}></Text>
              </View>
            );
          }}
          numColumns={1}
          keyExtractor={index => index.toString()}
        />
      </View>
    );
  }
}

export default connect(initStates, initActions)(TotalLibroCajaPage);
