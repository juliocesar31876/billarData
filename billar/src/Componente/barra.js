import React from 'react';
import {TouchableOpacity, View, Text, Image, Dimensions} from 'react-native';
import {connect} from 'react-redux';
import tema from '../config/style.json';
import Svg from '../Svg';

const Barra = props => {
  if (props.titulo === 'Inicio') {
    return (
      <View
        style={{
          marginTop: 50,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Svg
          name={'logo'}
          style={{
            width: Dimensions.get('window').width * 0.4,
            height: Dimensions.get('window').width * 0.2,
            fill: '#fff',
          }}
        />
        <View style={{marginTop: 20}}>
          <Text
            style={{
              color: '#fff',
              fontSize: 20,
              margin: 5,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            {props.sudtitulo}
          </Text>
        </View>
      </View>
    );
  }
  return (
    <View
      style={{
        width: '100%',
        height: 50,
        flexDirection: 'row',
        backgroundColor: tema.fondo,
      }}>
      <TouchableOpacity
        onPress={() => {
          if (!props.funcion) {
            props.navigation.goBack();
            return <View />;
          }
          props.funcion();
          props.navigation.goBack();
        }}
        style={{
          flex: 0.2,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Svg
          name={'volver'}
          style={{
            width: 30,
            height: 30,
            fill: '#fff',
            margin: 5,
          }}
        />
      </TouchableOpacity>
      <View
        style={{
          flex: 0.8,
          justifyContent: 'center',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Text
          style={{
            color: '#fff',
            fontSize: 13,
            flex: 1,
          }}>
          {props.titulo}
        </Text>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Svg
            name={'logo'}
            style={{
              width: 30,
              height: 30,
              fill: '#fff',
            }}
          />
        </View>
      </View>
    </View>
  );
};
const initStates = state => {
  return {state};
};
export default connect(initStates)(Barra);
