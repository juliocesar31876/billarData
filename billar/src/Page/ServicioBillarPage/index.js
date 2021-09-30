import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Text, View, TouchableOpacity, StyleSheet, FlatList} from 'react-native';
import Svg from '../../Svg';
import * as usuarioActions from '../../Actions/usuarioActions';
import tema from '../../config/style.json';
import Barra from '../../Componente/barra';

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#ffffff',
    color: '#000',
    marginTop: 10,
    borderRadius: 8,
    width: '100%',
    height: 35,
    fontSize: 10,
  },
  error: {
    borderWidth: 2,
    borderColor: '#f00',
    backgroundColor: '#ffffff',
    color: '#000',
    marginTop: 10,
    borderRadius: 8,
    width: '100%',
    fontSize: 10,
    height: 35,
  },
});
const initActions = {
  ...usuarioActions,
};
const initStates = state => {
  return {state};
};
class ServicioBillarPage extends Component {
  static navigationOptions = {
    headerShown: false,
  };
  constructor(props) {
    super(props);
    /////navigation guardamos en cada pagina
    props.state.navigationReducer.navigation = props.navigation;
    ///////////////////////////////////
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
        <Barra titulo={'Servicios Billar'} navigation={this.props.navigation} />
        <View
          style={{
            width: '100%',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <FlatList
            style={{width: '100%'}}
            data={this.props.state.serviciosReducer.dataMesaBillar}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('mesa billar', {
                      dataMesa: item,
                    });
                  }}
                  style={{
                    flex: 1,
                    height: 150,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={{color: '#fff', fontSize: 15, margin: 15}}>
                    {item.nombre}
                  </Text>
                  <Svg
                    name={'billar'}
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

export default connect(initStates, initActions)(ServicioBillarPage);
