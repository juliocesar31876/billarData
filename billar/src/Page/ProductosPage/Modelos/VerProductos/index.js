import React from 'react';
import {connect} from 'react-redux';
import {ScrollView, View, Text, Image, TouchableOpacity} from 'react-native';
import * as productoActions from '../../../../Actions/productoActions';
import * as popupActions from '../../../../Actions/popupActions';
//import * as fotoActions from '../../../../Actions/fotoActions'
import Estado from '../../../../Componente/estado';
import tema from '../../../../config/style.json';
import socketConfig from '../../../../config/socket.json';
import {servicioFoto} from '../../../../Servicios';
const initStates = state => {
  return {state};
};
const initActions = {
  ...productoActions,
  ...popupActions,
};
const VerProductos = props => {
  const [state, setState] = React.useState({
    tipo: {
      value: 'Todos',
      data: false,
    },
    key_foto_update:false

  });
  if (!props.state.socketReducer.socket) {
    return <Estado estado={'Reconectando'} />;
  }
  const popupTipo = () => {
    if (
      Object.keys(props.state.productosReducer.dataTipoProducto).length === 0
    ) {
      alert('agregue un tipo de producto');
      return <View />;
    }
    const selecTipo = obj => {
      if (obj.nombre === 'todos') {
        state.tipo.value = obj.nombre;
        state.tipo.data = false;
        setState({...state});
        props.cerrarPopup();
        return <View />;
      }
      state.tipo.value = obj.nombre;
      state.tipo.data = obj;
      setState({...state});
      props.cerrarPopup();
    };
    props.abrirPopup(() => {
      return (
        <View
          style={{
            width: '90%',
            height: '80%',
            borderWidth: 2,
            borderColor: '#fff',
            backgroundColor: tema.fondo,
            borderRadius: 10,
          }}>
          <ScrollView style={{width: '100%'}}>
            <View
              style={{
                width: '100%',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  margin: 10,
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: 15,
                }}>
                Tipo producto{' '}
              </Text>
              <TouchableOpacity
                onPress={() => selecTipo({nombre: 'todos'})}
                style={{
                  margin: 5,
                  width: '60%',
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
                  Todos
                </Text>
              </TouchableOpacity>
              {Object.keys(props.state.productosReducer.dataTipoProducto).map(
                key => {
                  var obj = props.state.productosReducer.dataTipoProducto[key];

                  return (
                    <TouchableOpacity
                      onPress={() => selecTipo(obj)}
                      style={{
                        margin: 5,
                        width: '60%',
                        height: 50,
                        borderRadius: 10,
                        borderWidth: 1,
                        flexDirection: 'row',
                        borderColor: '#fff',
                        alignItems: 'center',
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

  const updateFoto = data => {
      if (!state.key_foto_update)return<View/>
    var estadoFoto = servicioFoto.enviarFoto(
      data.uri,
      'image',
      {
        nombre: state.key_foto_update,
        type: 'producto',
      },
      'POST',
    );
    if (!estadoFoto) {
      alert('error al enviar la foto');
    }
    state.key_foto_update=false
    setState({...state})
  };

  const Productos = () => {
    var objDataTipoProducto = props.state.productosReducer.dataTipoProducto;
    var array = [];
    objDataTipoProducto.map(data => {
      if (data.productos) {
        data.productos.map(obj => {
          array.push(obj);
        });
      }
    });
  return (
      <View
        style={{
          flex: 1,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}>
        {array.map(obj => {
          return (
            <View
              style={{
                margin: 10,
                width: '90%',
                padding: 5,
                borderBottomWidth: 1,
                borderColor: '#fff',
                flexDirection: 'row',
              }}>
              <View style={{flex: 0.8, width: '100%'}}>
                <Text
                  style={{
                    color: '#999',
                    fontWeight: 'bold',
                    fontSize: 14,
                    textAlign: 'center',
                    width: '100%',
                  }}>
                  {obj.nombre.toUpperCase()}
                </Text>

                <View style={{flexDirection: 'row', margin: 5}}>
                  <Text style={{flex: 0.8, fontSize: 12, color: '#fff'}}>
                    Precio produccion:
                  </Text>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 12,
                      width: '75%',
                      marginLeft: 5,
                      color: '#fff',
                    }}>
                    {obj.precio_produccion} bs
                  </Text>
                </View>
                <View style={{flexDirection: 'row', margin: 5}}>
                  <Text style={{flex: 0.8, fontSize: 12, color: '#fff'}}>
                    Precio venta :{' '}
                  </Text>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 12,
                      width: '75%',
                      marginLeft: 5,
                      color: '#fff',
                    }}>
                    {obj.precio_venta} bs
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  servicioFoto.galeria(updateFoto);
                  state.key_foto_update=obj.key
                }}
                style={{
                  flex: 0.2,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <View
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 100,
                    overflow: 'hidden',
                  }}>
                  <Image
                    source={{
                      uri:
                        socketConfig.url_get_foto +
                        '?tipo=producto/&nombre=' +
                        obj.key,
                    }}
                    style={{width: '100%', height: '100%'}}
                  />
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    );
  };
  return (
    <View
      style={{
        flex: 1,
        width: '100%',
        alignItems: 'center',
      }}>
      <View
        style={{
          width: '80%',
          height: 50,
          flexDirection: 'row',
          alignItems: 'center',
          margin: 5,
        }}>
        <Text
          style={{
            margin: 5,
            color: '#fff',
            flex: 1,
            fontSize: 12,
            textAlign: 'center',
          }}>
          Selecione el tipo de producto{' '}
        </Text>
        <TouchableOpacity
          onPress={() => popupTipo()}
          style={{
            flex: 1,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 2,
            borderRadius: 10,
            borderColor: '#fff',
          }}>
          <Text style={{color: '#fff'}}> {state.tipo.value}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        style={{
          flex: 1,
          width: '100%',
        }}>
        {Productos()}
      </ScrollView>
    </View>
  );
};

export default connect(initStates, initActions)(VerProductos);
