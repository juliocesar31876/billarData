import React from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {connect} from 'react-redux';
import Svg from '../../../../Svg';
import * as productoActions from '../../../../Actions/productoActions';
import * as sucursalActions from '../../../../Actions/sucursalActions';
import * as popupActions from '../../../../Actions/popupActions';
import tema from '../../../../config/style.json';
import {servicioFoto, servicioPopup} from '../../../../Servicios/index';
const initStates = state => {
  return {state};
};
const initActions = {
  ...productoActions,
  ...sucursalActions,
  ...popupActions,
};
const AddProductos = props => {
  const [state, setState] = React.useState({
    obj: {
      nombre: {
        value: '',
        error: false,
      },
      precio_produccion: {
        value: '',
        error: false,
      },
      precio_venta: {
        value: '',
        error: false,
      },
    },
    key_tipo_producto: {
      value: 'Selecione Tipo',
      error: false,
    },
    foto: {
      source: false,
    },
    enviandoFoto: true,
  });

  const hanlechage = data => {
    state.obj[data.id] = {
      value: data.text,
      error: false,
    };
    setState({...state});
  };
  const addFoto = response => {
    if (!response) return <View />;
    state.foto.source = {uri: response.uri};
    setState({...state});
  };

  const enviarFoto = data => {
    var estadoFoto = servicioFoto.enviarFoto(
      data.uri,
      'image',
      data.params,
      'POST',
    );
    if (!estadoFoto) {
      alert('error al enviar la foto');
    }
  };

  if (
    props.state.productosReducer.estado === 'exito' &&
    props.state.productosReducer.type === 'addProducto'
  ) {
    props.state.productosReducer.estado = '';
    props.state.productosReducer.type = '';
    var data = {
      params: {type: 'producto', nombre: props.state.productosReducer.foto},
      uri: state.foto.source.uri,
    };
    enviarFoto(data);
    setState({
      obj: {
        nombre: {
          value: '',
          error: false,
        },
        precio_produccion: {
          value: '',
          error: false,
        },
        precio: {
          value: '',
          error: false,
        },
      },
      key_tipo_producto: {
        value: 'Selecione Tipo',
        error: false,
      },
      foto: {
        source: false,
      },
      enviandoFoto: true,
    });
  }
  const agregarProducto = () => {
    var exito = true;
    var data = {};
    for (const key in state.obj) {
      var obj = state.obj[key];
      if (obj.value === '') {
        exito = false;
        state.obj[key].error = true;
      } else {
        data[key] = obj.value;
      }
    }
    if (!state.key_tipo_producto.data) {
      state.key_tipo_producto.error = true;
      exito = false;
    }
    if (!state.foto.source) {
      exito = false;
      alert('su foto no a ingresado');
    }
    setState({...state});
    if (exito) {
      data['key_tipo_producto'] = state.key_tipo_producto.data.key;
      data['key_sucursal'] = props.state.usuarioReducer.usuarioLog.sucursal.key;
      data['estado'] = 1;
      props.registrarProducto(props.state.socketReducer.socket, data);
    }
  };
  const popupTipo = () => {
    if (
      Object.keys(props.state.productosReducer.dataTipoProducto).length === 0
    ) {
      alert('agregue un tipo de producto');
      return <View />;
    }
    const selecTipo = obj => {
      state.key_tipo_producto.value = obj.nombre;
      state.key_tipo_producto['data'] = obj;
      state.key_tipo_producto.error = false;
      setState({...state});
      props.cerrarPopup();
    };
    props.abrirPopup(() => {
      return (
        <View
          style={{
            width: '90%',
            height: '80%',
            backgroundColor: tema.fondo,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#fff',
          }}>
          <Text
            style={{
              margin: 4,
              fontSize: 25,
              color: '#999',
              width: '100%',
              textAlign: 'center',
              fontWeight: 'bold',
            }}>
            Tipo producto
          </Text>
          <ScrollView
            style={{
              flex: 1,
              width: '100%',
              paddingTop: 10,
            }}>
            <View
              style={{
                flex: 1,
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {Object.keys(props.state.productosReducer.dataTipoProducto).map(
                key => {
                  var obj = props.state.productosReducer.dataTipoProducto[key];
                  return (
                    <TouchableOpacity
                      onPress={() => selecTipo(obj)}
                      style={{
                        margin: 5,
                        width: '90%',
                        height: 50,
                        borderRadius: 10,
                        borderWidth: 1,
                        flexDirection: 'row',
                        borderColor: '#fff',
                        alignItems: 'center',
                        backgroundColor: tema.fondo,
                      }}>
                      <Text
                        style={{
                          margin: 4,
                          color: '#fff',
                          fontSize: 12,
                          textAlign: 'center',
                          flex: 1,
                        }}>
                        {obj.nombre}
                      </Text>
                    </TouchableOpacity>
                  );
                },
              )}
            </View>
          </ScrollView>
        </View>
      );
    });
  };
  const esperandoRepuesta = () => {
    if (
      props.state.productosReducer.type === 'addProducto' &&
      props.state.productosReducer.estado === 'cargando'
    ) {
      return <ActivityIndicator size="small" color="#fff" />;
    }
    if (!state.enviandoFoto) {
      return <ActivityIndicator size="small" color="#fff" />;
    }
    if (!props.state.socketReducer.socket) {
      return <ActivityIndicator size="small" color="#fff" />;
    }
    return (
      <TouchableOpacity
        onPress={() => agregarProducto()}
        style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{color: '#fff', textAlign: 'center', fontSize: 10}}>
          Agreagar producto
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <View
      style={{
        flex: 1,
        width: '100%',
      }}>
      <ScrollView style={{flex: 1}}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
          }}>
          {Object.keys(state.obj).map(key => {
            var data = state.obj[key];
            var keyboardTyp = '';
            if (key === 'precio_venta' || key === 'precio_produccion') {
              keyboardTyp = 'numeric';
            }
            return (
              <View
                style={{
                  width: '80%',
                  margin: 1,
                  marginTop: 10,
                }}>
                <Text style={{fontSize: 12, color: '#fff'}}>
                  {key.toUpperCase()}
                </Text>
                <TextInput
                  autoCapitalize={'none'}
                  keyboardType={keyboardTyp}
                  onChangeText={text => hanlechage({text: text, id: key})}
                  value={data.value}
                  style={data.error ? styles.error : styles.input}
                />
              </View>
            );
          })}

          <View
            style={{
              width: '80%',
              margin: 1,
            }}>
            <Text style={{fontSize: 12, color: '#fff'}}>TIPO PRODUCTO</Text>
            <TouchableOpacity
              onPress={() => popupTipo()}
              style={
                state.key_tipo_producto.error ? styles.error : styles.touc
              }>
              <Text style={{fontSize: 10, color: '#666'}}>
                {state.key_tipo_producto.value.toUpperCase()}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => servicioFoto.galeria(addFoto)}
            style={{
              margin: 5,
              width: 100,
              height: 100,
              borderColor: '#fff',
              borderRadius: 100,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}>
            {state.foto.source ? (
              <Image
                source={{uri: state.foto.source.uri}}
                style={{width: '100%', height: '100%'}}
              />
            ) : (
              <Svg
                name="camara"
                style={{
                  width: 100,
                  height: 100,
                  fill: '#fff',
                }}
              />
            )}
          </TouchableOpacity>
          <Text style={{color: '#fff'}}>Foto</Text>
          <TouchableOpacity
            style={{
              width: 100,
              height: 30,
              margin: 5,
              borderRadius: 5,
              borderWidth: 1,
              marginTop: 15,
              alignItems: 'center',
              justifyContent: 'center',
              borderColor: '#fff',
            }}>
            {esperandoRepuesta()}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  touc: {
    backgroundColor: '#ffffff',
    color: '#000',
    marginTop: 10,
    borderRadius: 8,
    width: '100%',
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  touc2: {
    backgroundColor: '#ffffff',
    color: '#000',
    marginTop: 10,
    borderRadius: 8,
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: '#ffffff',
    color: '#000',
    marginTop: 8,
    borderRadius: 8,
    borderBottomWidth: 1,
    borderColor: '#000',
    width: '100%',
    height: 35,
    fontSize: Dimensions.get('window').width * 0.035,
  },
  error: {
    borderWidth: 1,
    borderColor: '#f00',
    backgroundColor: '#ffffff',
    color: '#000',
    marginTop: 10,
    fontSize: Dimensions.get('window').width * 0.035,
    borderRadius: 8,
    width: '100%',
    height: 35,
  },
});

export default connect(initStates, initActions)(AddProductos);
