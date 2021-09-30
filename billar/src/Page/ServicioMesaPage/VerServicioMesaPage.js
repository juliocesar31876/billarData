import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import Svg from '../../Svg';
import * as usuarioActions from '../../Actions/usuarioActions';
import * as serviciosActions from '../../Actions/serviciosActions';
import * as popupActions from '../../Actions/popupActions';
import tema from '../../config/style.json';
import Barra from '../../Componente/barra';
import Estado from '../../Componente/estado';
import socketConfig from '../../config/socket.json';
import moment from 'moment';

const initActions = {
  ...usuarioActions,
  ...serviciosActions,
  ...popupActions,
};
const initStates = state => {
  return {state};
};
class VerServicioMesaPage extends Component {
  static navigationOptions = {
    headerShown: false,
  };
  constructor(props) {
    super(props);
    const {dataMesa} = props.route.params;

    this.state = {
      dataGetServicio: false,
      dataServicioProducto: [],
      total: 0,
      dataMesa,
      dataCantidad: false,
      mesa: true,
      dataArrayDetalle: [],
    };
  }
  popupProducto = estados => {
    var objDataTipoProducto =
      this.props.state.productosReducer.dataTipoProducto;
    var array = [];
    objDataTipoProducto.map(data => {
      if (data.productos) {
        data.productos.map(obj => {
          array.push(obj);
        });
      }
    });
    const selecTipo = obj => {
      var estado = true;
      this.state.dataServicioProducto.map(data => {
        if (data.key === obj.key) {
          alert('Ya existe en la lista ');
          estado = false;
          return <View />;
        }
      });
      if (this.state.mesa) {
        this.state.dataGetServicio.servicios_detalle.map(data => {
          if (data.key_producto === obj.key) {
            alert('Ya existe en la lista ');
            estado = false;
            return <View />;
          }
        });
      }
      if (estado) {
        obj['cantidad'] = '1';
        this.state.total += obj.cantidad * obj.precio;
        this.state.dataServicioProducto.push(obj);
        this.setState({...this.state});
        this.props.cerrarPopup();
      }
    };
    this.props.abrirPopup(() => {
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
            productos
          </Text>

          <View
            style={{
              flex: 1,
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <FlatList
              style={{width: '100%'}}
              data={array}
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity
                    onPress={() => selecTipo(item)}
                    style={{
                      margin: 5,
                      width: '45%',
                      height: 50,
                      borderRadius: 10,
                      borderBottomWidth: 1,
                      flexDirection: 'row',
                      borderColor: '#fff',
                      alignItems: 'center',
                      backgroundColor: tema.fondo,
                    }}>
                    <Text
                      style={{
                        margin: 4,
                        color: '#fff',
                        fontSize: 15,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        flex: 1,
                      }}>
                      {item.nombre}
                    </Text>
                    <View
                      style={{
                        width: 45,
                        height: 45,
                        borderRadius: 100,
                        overflow: 'hidden',
                      }}>
                      <Image
                        source={{
                          uri:
                            socketConfig.url_get_foto +
                            '?tipo=producto/&nombre=' +
                            item.key,
                        }}
                        style={{width: '100%', height: '100%'}}
                      />
                    </View>
                  </TouchableOpacity>
                );
              }}
              numColumns={2}
              keyExtractor={index => index.toString()}
            />
          </View>
        </View>
      );
    });
  };

  guardarServicio() {
    var estado = true;
    var arrayDetalle = [];
    var fecha = moment().format('YYYY-MM-DD');
    var hora = moment().format('HH:mm:ss');
    var fecha_on = fecha + 'T' + hora;

    this.state.dataServicioProducto.map((data, key) => {
      arrayDetalle.push({
        nombre: data.nombre,
        key_producto: data.key,
        fecha_on,
        estado: 1,
        cantidad: data.cantidad,
        precio: data.precio,
        precio_produccion: data.precio_produccion,
      });
    });
    if (arrayDetalle.length === 0) {
      alert('No ha agregago ningun Productos');
      return <View />;
    }
    var servicios = {
      fecha_on,
      estado: 1,
      key_sucursal: this.props.state.usuarioReducer.usuarioLog.sucursal.key,
      habilitado: true,
      mesa: true,
      key_mesa: this.state.dataMesa.key,
    };
    this.props.addServicio(this.props.state.socketReducer.socket, {
      servicios,
      servicios_detalle: arrayDetalle,
    });
  }
  terminarServicio() {
    var fecha = moment().format('YYYY-MM-DD');
    var hora = moment().format('HH:mm:ss');
    var fecha_off = fecha + 'T' + hora;
    this.props.finalizarServicio(this.props.state.socketReducer.socket, {
      key_servicio: this.props.state.serviciosReducer.dataGetServicio.key,
      fecha_off,
    });
  }
  guardarServicioDetalle() {
    var servicioDetalle = [];
    var arrayServicio = [];
    var fecha = moment().format('YYYY-MM-DD');
    var hora = moment().format('HH:mm:ss');
    var fecha_on = fecha + 'T' + hora;

    this.props.state.serviciosReducer.dataGetServicio.servicios_detalle.map(
      data => {
        servicioDetalle.push(data);
      },
    );
    this.state.dataServicioProducto.map(data => {
      arrayServicio.push({
        nombre: data.nombre,
        key_producto: data.key,
        fecha_on,
        estado: 1,
        cantidad: data.cantidad,
        precio: data.precio,
        precio_produccion: data.precio_produccion,
      });
    });
    this.props.updataGetServicios(this.props.state.socketReducer.socket, {
      servicioDetalle,
      arrayServicio,
      key_servicio: this.props.state.serviciosReducer.dataGetServicio.key,
    });
  }
  vistaServicio() {
    this.state.mesa = false;
    return (
      <View style={{width: '100%'}}>
        <FlatList
          style={{width: '100%'}}
          data={this.state.dataServicioProducto}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                style={{
                  flex: 1,
                  padding: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 100,
                    overflow: 'hidden',
                  }}>
                  <Image
                    source={{
                      uri:
                        socketConfig.url_get_foto +
                        '?tipo=producto/&nombre=' +
                        item.key,
                    }}
                    style={{width: '100%', height: '100%'}}
                  />
                </View>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 15,
                    margin: 15,
                    flex: 0.8,
                    textAlign: 'center',
                  }}>
                  {item.nombre}
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 15,
                    margin: 15,
                    flex: 1,
                    textAlign: 'center',
                  }}>
                  Precio : {item.precio}
                </Text>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      var cantidad =
                        this.state.dataServicioProducto[index]['cantidad'];

                      cantidad = Number(cantidad);
                      cantidad += 1;
                      this.state.dataServicioProducto[index]['cantidad']++;
                      this.state.total += item.precio * 1;
                      this.setState({...this.state});
                    }}
                    style={{
                      width: 30,
                      height: 30,
                      borderWidth: 1,
                      borderRadius: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderColor: '#fff',
                    }}>
                    <Svg
                      name={'mas'}
                      style={{
                        width: 15,
                        height: 15,
                        fill: '#fff',
                      }}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 15,
                      margin: 15,
                      flex: 1,
                      textAlign: 'center',
                    }}>
                    {!item.cantidad ? 0 : item.cantidad}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      var cantidad =
                        this.state.dataServicioProducto[index]['cantidad'];

                      cantidad = Number(cantidad);
                      cantidad -= 1;
                      if (this.state.dataCantidad[index] === cantidad) {
                        return <View />;
                      }
                      this.state.dataServicioProducto[index]['cantidad']--;
                      this.state.total -= item.precio * cantidad;
                      this.setState({...this.state});
                    }}
                    style={{
                      borderRadius: 10,
                      width: 30,
                      height: 30,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 1,
                      borderColor: '#fff',
                    }}>
                    <Svg
                      name={'menos'}
                      style={{
                        width: 15,
                        height: 15,
                        fill: '#fff',
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          }}
          numColumns={1}
          keyExtractor={index => index.toString()}
        />
      </View>
    );
  }
  vistaGetServicio() {
    return (
      <View style={{width: '100%'}}>
        <FlatList
          style={{width: '100%'}}
          data={
            this.props.state.serviciosReducer.dataGetServicio.servicios_detalle
          }
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                style={{
                  flex: 1,
                  padding: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 100,
                    overflow: 'hidden',
                  }}>
                  <Image
                    source={{
                      uri:
                        socketConfig.url_get_foto +
                        '?tipo=producto/&nombre=' +
                        item.key_producto,
                    }}
                    style={{width: '100%', height: '100%'}}
                  />
                </View>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 15,
                    margin: 15,
                    flex: 0.8,
                    textAlign: 'center',
                  }}>
                  {item.nombre}
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 15,
                    margin: 15,
                    flex: 1,
                    textAlign: 'center',
                  }}>
                  Precio : {item.precio}
                </Text>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      var cantidad =
                        this.props.state.serviciosReducer.dataGetServicio
                          .servicios_detalle[index]['cantidad'];

                      cantidad = Number(cantidad);
                      cantidad += 1;
                      this.props.state.serviciosReducer.dataGetServicio
                        .servicios_detalle[index]['cantidad']++;
                      this.state.total += item.precio * 1;
                      this.setState({...this.state});
                    }}
                    style={{
                      width: 30,
                      height: 30,
                      borderWidth: 1,
                      borderRadius: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderColor: '#fff',
                    }}>
                    <Svg
                      name={'mas'}
                      style={{
                        width: 15,
                        height: 15,
                        fill: '#fff',
                      }}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 15,
                      margin: 15,
                      flex: 1,
                      textAlign: 'center',
                    }}>
                    {!item.cantidad ? 0 : item.cantidad}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      var cantidad =
                        this.props.state.serviciosReducer.dataGetServicio
                          .servicios_detalle[index]['cantidad'];

                      cantidad = Number(cantidad);
                      cantidad -= 1;
                      if (cantidad === 0) {
                        return <View />;
                      }
                      this.props.state.serviciosReducer.dataGetServicio
                        .servicios_detalle[index]['cantidad']--;
                      this.state.total -= item.precio * cantidad;
                      this.setState({...this.state});
                    }}
                    style={{
                      borderRadius: 10,
                      width: 30,
                      height: 30,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 1,
                      borderColor: '#fff',
                    }}>
                    <Svg
                      name={'menos'}
                      style={{
                        width: 15,
                        height: 15,
                        fill: '#fff',
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          }}
          numColumns={1}
          keyExtractor={index => index.toString()}
        />
        <FlatList
          style={{width: '100%'}}
          data={this.state.dataServicioProducto}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                style={{
                  flex: 1,
                  padding: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 100,
                    overflow: 'hidden',
                  }}>
                  <Image
                    source={{
                      uri:
                        socketConfig.url_get_foto +
                        '?tipo=producto/&nombre=' +
                        item.key,
                    }}
                    style={{width: '100%', height: '100%'}}
                  />
                </View>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 15,
                    margin: 15,
                    flex: 0.8,
                    textAlign: 'center',
                  }}>
                  {item.nombre}
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 15,
                    margin: 15,
                    flex: 1,
                    textAlign: 'center',
                  }}>
                  Precio : {item.precio}
                </Text>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      var cantidad =
                        this.state.dataServicioProducto[index]['cantidad'];

                      cantidad = Number(cantidad);
                      cantidad += 1;
                      this.state.dataServicioProducto[index]['cantidad']++;
                      this.state.total += item.precio * 1;
                      this.setState({...this.state});
                    }}
                    style={{
                      width: 30,
                      height: 30,
                      borderWidth: 1,
                      borderRadius: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderColor: '#fff',
                    }}>
                    <Svg
                      name={'mas'}
                      style={{
                        width: 15,
                        height: 15,
                        fill: '#fff',
                      }}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 15,
                      margin: 15,
                      flex: 1,
                      textAlign: 'center',
                    }}>
                    {!item.cantidad ? 0 : item.cantidad}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      var cantidad =
                        this.state.dataServicioProducto[index]['cantidad'];

                      if (this.state.dataCantidad[index] === cantidad) {
                        return <View />;
                      }
                      cantidad = Number(cantidad);
                      cantidad -= 1;
                      this.state.dataServicioProducto[index]['cantidad']--;
                      this.state.total -= item.precio * cantidad;
                      this.setState({...this.state});
                    }}
                    style={{
                      borderRadius: 10,
                      width: 30,
                      height: 30,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 1,
                      borderColor: '#fff',
                    }}>
                    <Svg
                      name={'menos'}
                      style={{
                        width: 15,
                        height: 15,
                        fill: '#fff',
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          }}
          numColumns={1}
          keyExtractor={index => index.toString()}
        />
      </View>
    );
  }
  render() {
    if (
      this.props.state.serviciosReducer.estado === 'cargando' &&
      this.props.state.serviciosReducer.type === 'getServicio'
    ) {
      return <Estado estado={'cargando'} />;
    }
    if (!this.props.state.serviciosReducer.dataGetServicio) {
      this.props.getServicio(this.props.state.socketReducer.socket, {
        key_mesa_billar: '',
        key_mesa: this.state.dataMesa.key,
      });
      return <Estado estado={'cargando'} />;
    }
    if (
      this.props.state.serviciosReducer.estado === 'exito' &&
      this.props.state.serviciosReducer.type === 'getServicio'
    ) {
      this.props.state.serviciosReducer.estado = '';
      if (
        Object.keys(this.props.state.serviciosReducer.dataGetServicio)
          .length === 0
      ) {
        this.state.dataGetServicio =
          this.props.state.serviciosReducer.dataGetServicio;
      } else {
        this.state.dataGetServicio =
          this.props.state.serviciosReducer.dataGetServicio;
        var array_cantidad = [];
        this.props.state.serviciosReducer.dataGetServicio.servicios_detalle.map(
          data => {
            array_cantidad.push(data.cantidad);
            this.state.total += data.cantidad * data.precio;
          },
        );
        this.state.dataCantidad = array_cantidad;
      }
    }
    if (this.props.state.serviciosReducer.estado === 'exito') {
      this.props.state.serviciosReducer.dataGetServicio = false;
      this.props.navigation.goBack();
    }
    return (
      <View
        style={{
          flex: 1,
          width: '100%',
          backgroundColor: tema.fondo,
        }}>
        <Barra
          titulo={'Servicios Mesa'}
          navigation={this.props.navigation}
          funcion={() => {
            this.props.state.serviciosReducer.dataGetServicio = false;
          }}
        />
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
          }}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{textAlign: 'center', color: '#fff'}}>
              Total : {this.state.total} Bs
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Svg
              name="Atencion Mesa"
              style={{width: 40, height: 40, fill: '#fff'}}
            />
          </View>
        </View>
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            onPress={() => this.popupProducto()}
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Svg name="agregar" style={{width: 30, height: 30, fill: '#fff'}} />
            <Text style={{color: '#fff', fontSize: 10, margin: 10}}>
              Agreagar Productos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (!this.state.mesa) {
                this.guardarServicio();
                return <View />;
              }
              this.guardarServicioDetalle();
            }}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 15,
            }}>
            <Svg name="tragos" style={{width: 30, height: 30, fill: '#fff'}} />
            <Text style={{color: '#fff', fontSize: 10, margin: 10}}>
              Guardar Servicio
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.terminarServicio();
            }}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 15,
            }}>
            <Svg
              name="finalizar"
              style={{width: 30, height: 30, fill: '#fff'}}
            />
            <Text style={{color: '#fff', fontSize: 10, margin: 10}}>
              Terminar Servicios
            </Text>
          </TouchableOpacity>
        </View>
        {Object.keys(this.props.state.serviciosReducer.dataGetServicio)
          .length === 0
          ? this.vistaServicio()
          : this.vistaGetServicio()}
      </View>
    );
  }
}

export default connect(initStates, initActions)(VerServicioMesaPage);
