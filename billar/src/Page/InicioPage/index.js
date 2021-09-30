import React, {Component} from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import style from './../../config/style.json';
import {connect} from 'react-redux';
import Svg from '../../Svg';
import Barra from '../../Componente/barra';
const initStates = state => {
  return {state};
};
class InicioPage extends Component {
  constructor(props) {
    super(props);
    /////navigation guardamos en cada pagina
    props.state.navigationReducer.navigation = props.navigation;
    ///////////////////////////////////
    this.state = {
      menu: [
        {
          nombre: 'Servicios Billar',
          pagina: 'servicio billar',
        },
        {
          nombre: 'Productos',
          pagina: 'productos',
        },
        {
          nombre: 'Atencion Mesa',
          pagina: 'atencion mesa',
        },
        {
          nombre: 'Caja Total',
          pagina: 'total caja',
        },
      ],
    };
  }
  handleClick(pagina) {
    this.props.navigation.navigate(pagina);
  }

  render() {
    return (
      <View
        style={{
          width: '100%',
          alignItems: 'center',
          backgroundColor: style.fondo,
          flex: 1,
        }}>
        <Barra
          titulo={'Inicio'}
          navigation={this.props.navigation}
          sudtitulo={this.props.state.usuarioReducer.usuarioLog.sucursal.nombre}
        />
        <View
          style={{
            width: '100%',
            alignItems: 'center',
          }}>
          <FlatList
            style={{width: '100%', paddingBottom: 10}}
            data={this.state.menu}
            renderItem={({item}) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    this.handleClick(item.pagina);
                  }}
                  style={{
                    width: '45%',
                    margin: 10,
                    justifyContent: 'center',
                    borderWidth: 2,
                    borderColor: '#fff',
                    borderRadius: 10,
                    height: 120,
                    padding: 10,
                    alignItems: 'center',
                  }}>
                  <Svg
                    name={item.nombre}
                    style={{
                      width: 45,
                      height: 45,
                      fill: '#fff',
                    }}
                  />
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 14,
                      color: '#fff',
                      fontWeight: 'bold',
                    }}>
                    {item.nombre.toLowerCase()}
                  </Text>
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
export default connect(initStates)(InicioPage);
