import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Text, View, TouchableOpacity, StyleSheet, FlatList} from 'react-native';
import Svg from '../../Svg';
import * as usuarioActions from '../../Actions/usuarioActions';
import tema from '../../config/style.json';
import Barra from '../../Componente/barra';


const initActions = {
  ...usuarioActions,
};
const initStates = state => {
  return {state};
};
class ServicioMesaPage extends Component {
  static navigationOptions = {
    headerShown: false,
  };
  constructor(props) {
    super(props);
    
    
    this.state = {
      obj: {
        user: {
          value: '',
          error: false,
        },
        pass: {
          value: '',
          error: false,
        },
      },
    };
  }
  render() {
    return (
      <View
        style={{
          flex: 1,
          width: '100%',
          backgroundColor: tema.fondo,
        }}>
        <Barra titulo={'Servicios Mesa'} navigation={this.props.navigation}
        
        />
        <View
          style={{
            width: '100%',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <FlatList
            style={{width: '100%'}}
            data={this.props.state.serviciosReducer.dataMesa}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('ver mesa', {
                      dataMesa: item,
                    });
                  }}
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={{color: '#fff', fontSize: 15, margin: 15}}>
                    {item.nombre}
                  </Text>
                  <Svg
                    name={'Atencion Mesa'}
                    style={{
                      width: 80,
                      height: 80,
                      fill: '#fff',
                    }}
                  />
                </TouchableOpacity>
              );
            }}
            numColumns={2}
            keyExtractor={index => index.toString()}
          />
        </View>
      </View>
    );
  }
}

export default connect(initStates, initActions)(ServicioMesaPage);
