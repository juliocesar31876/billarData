//import liraries
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {servicioFoto} from '../../Servicios/index';
import RNFS from 'react-native-fs';
import socketData from '../../config/socket.json';
// create a component
const MyComponent = () => {

  const updateFoto = async data => {
      var estadoFoto = servicioFoto.enviarFoto(
        data.uri,
        'image',
        {
          nombre: 'material',
          type: 'productos',
        },
        'POST',
      );
        if (!estadoFoto) {
          alert("error al enviar la foto")
        }
    };

  return (
    <View style={{width: '100%', alignItems: 'center'}}>
      <TouchableOpacity
        style={{
          width: '100%',
          height: 100,
          alignItems: 'center',
          borderWidth: 1,
          justifyContent: 'center',
        }}
        onPress={() => servicioFoto.foto(updateFoto)}>
        <Text>MyComponent</Text>
      </TouchableOpacity>
      <View
        style={{
          width: 300,
          height: 300,
          borderWidth: 1,

          borderColor: '#000',
        }}>
        <Image
          source={{
            uri: socketData.url_get_foto + '?tipo=productos/&nombre=dasdasdas',
          }}
          style={{width: '100%', height: '100%'}}
        />
      </View>
    </View>
  );
};
export default MyComponent;
