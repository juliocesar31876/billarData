import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Alert,
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
class VerServiciosPage extends Component {
  static navigationOptions = {
    headerShown: false,
  };
  constructor(props) {
    super(props);
    const {dataMesa} = props.route.params;

    this.props.state.serviciosReducer.clearData = () => {
      this.props.state.serviciosReducer.dataGetServicio = false;
    };
    this.state = {
      dataMesa,
      dataServicio: false,
      servicios_detalle: [],
      total: 0,
      date: new Date(),
      totalTiempo: 0,
      arrayCantidad: [],
      dataGetServicio: false,
      dataGetServicio1: false,
      arrayServicio: [],
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
      if (estados) {
        this.state.dataGetServicio.servicios_detalle.map(data => {
          if (data.key_producto === obj.key) {
            alert('Ya existe en la lista ');
            estado = false;
          }
        });
        this.state.arrayServicio.map(data => {
          if (data.key === obj.key) {
            alert('Ya existe en la lista ');
            estado = false;
          }
        });
        if (estado) {
          obj['cantidad'] = '1';
          this.state.total += obj.cantidad * obj.precio;
          this.state.arrayServicio.push(obj);
        }
      }
      this.state.servicios_detalle.map(data => {
        if (data.key === obj.key) {
          alert('Ya existe en la lista ');
          estado = false;
          return <View />;
        }
      });
      if (estado) {
        obj['cantidad'] = '1';
        this.state.total += obj.cantidad * obj.precio;
        this.state.servicios_detalle.push(obj);
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
  habilitarTiempo() {
    var hora = moment().format('HH:mm:ss');
    var fecha_on = hora;
    this.props.habilitarTiempo(this.props.state.socketReducer.socket, {
      key_servicio: this.state.dataGetServicio.key,
      fecha_on,
    });
  }
  popupTiempo = () => {
    const terminarTiempo = () => {
      this.props.finalizarTiempo(this.props.state.socketReducer.socket, {
        key_servicio: this.state.dataGetServicio.key,
      });
      this.props.cerrarPopup();
    };
    this.props.abrirPopup(() => {
      return (
        <View
          style={{
            width: '90%',
            height: '40%',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: tema.fondo,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#fff',
          }}>
          <Text
            style={{
              color: '#fff',
              fontWeight: 'bold',
              margin: 10,
              fontSize: 20,
            }}>
            Finalizar Tiempo
          </Text>
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-evenly',
              flexDirection: 'row',
              margin: 15,
            }}>
            <Text
              style={{
                color: '#fff',
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: 20,
              }}>
              Total Tiempo :
            </Text>
            <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 20}}>
              {this.state.totalTiempo} Bs
            </Text>
          </View>
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              onPress={() => {
                terminarTiempo();
              }}
              style={{
                width: 120,
                height: 40,
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: '#fff',
              }}>
              <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 20}}>
                Finalizar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    });
  };
  addServicio() {
    var fecha = moment().format('YYYY-MM-DD');
    var hora = moment().format('HH:mm:ss');
    var fecha_on = fecha + 'T' + hora;
    var servicios_detalle = [];
    if (this.state.servicios_detalle.length > 0) {
      this.state.servicios_detalle.map(data => {
        servicios_detalle.push({
          fecha_on,
          precio: data.precio,
          precio_produccion: data.precio_produccion,
          cantidad: data.cantidad,
          estado: 1,
          key_producto: data.key,
          nombre: data.nombre,
        });
      });
    }
    var dataSend = {
      servicios: {
        fecha_on,
        estado: 1,
        key_mesa_billar: this.state.dataMesa.key,
        key_mesa: '',
        habilitado: true,
        tiempo: hora,
        total_tiempo:this.state.totalTiempo,
        key_sucursal: this.props.state.usuarioReducer.usuarioLog.sucursal.key,
      },
      servicios_detalle,
    };
    this.props.addServicio(this.props.state.socketReducer.socket, dataSend);
  }
  crearServicio() {
    return (
      <View
        style={{
          width: '100%',
          flex: 1,
          alignItems: 'center',
        }}>
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            flexDirection: 'row',
          }}>
          <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 20}}>
            Habilitar tiempo
          </Text>
          <TouchableOpacity
            onPress={() => {
              this.addServicio();
            }}
            style={{
              width: 120,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
              backgroundColor: 'red',
            }}>
            <Text style={{color: '#fff'}}>Habilitar </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-evenly',
              flexDirection: 'row',
              margin: 15,
            }}>
            <Text
              style={{
                color: '#fff',
                flex: 1,
                textAlign: 'center',
                fontSize: 15,
              }}>
              Agregar Productos
            </Text>
            <Text style={{color: '#fff', flex: 0.5, fontSize: 15}}>
              Total : {this.state.total}
            </Text>
            <TouchableOpacity
              onPress={() => {
                this.popupProducto(false);
              }}>
              <Svg
                name={'agregar'}
                style={{
                  width: 35,
                  height: 35,
                  fill: '#fff',
                }}
              />
            </TouchableOpacity>
          </View>

          <FlatList
            style={{width: '100%'}}
            data={this.state.servicios_detalle}
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
                          this.state.servicios_detalle[index]['cantidad'];

                        cantidad = Number(cantidad);
                        cantidad += 1;
                        this.state.servicios_detalle[index]['cantidad']++;
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
                          this.state.servicios_detalle[index]['cantidad'];

                        cantidad = Number(cantidad);
                        cantidad -= 1;
                        if (cantidad === 0) {
                          return <View />;
                        }
                        this.state.servicios_detalle[index]['cantidad']--;
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
      </View>
    );
  }
  terminarServicio() {
    var fecha = moment().format('YYYY-MM-DD');
    var hora = moment().format('HH:mm:ss');
    var fecha_off = fecha + 'T' + hora;
    this.props.finalizarServicio(this.props.state.socketReducer.socket, {
      key_servicio: this.state.dataGetServicio.key,
      fecha_off,
    });
  }
  updateServicio() {
    var servicioDetalle = [];
    this.state.dataGetServicio.servicios_detalle.map((data, key) => {
      servicioDetalle.push(data);
    });
    var arrayServicio = [];
    var fecha = moment().format('YYYY-MM-DD');
    var hora = moment().format('HH:mm:ss');
    var fecha_on = fecha + 'T' + hora;
    this.state.arrayServicio.map((data, key) => {
      arrayServicio.push({
        fecha_on,
        precio: data.precio,
        precio_produccion: data.precio_produccion,
        cantidad: data.cantidad,
        estado: 1,
        key_producto: data.key,
        nombre: data.nombre,
      });
    });
    if (arrayServicio.length === 0 && servicioDetalle.length === 0) {
      alert('No realizado ninguna agregacion de servicio');
      return <View />;
    }
    this.props.updataGetServicios(this.props.state.socketReducer.socket, {
      servicioDetalle,
      arrayServicio,
      key_servicio: this.state.dataGetServicio.key,
    });
  }
  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 1000);
  }
  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date(),
    });
  }
  calcularTiempoPrecio(data) {
    var tiempoPrecio = this.props.state.serviciosReducer.dataPrecioTiempo[0];
    var cantidadHora = 0;
    var cantidadMinutos = 0;
    if (data.horaTiempo > data.hora) {
      for (let index = data.hora; index < data.horaTiempo; index++) {
        cantidadHora++;
      }
      if (data.minutos === data.minutosTiempo) {
        var precioHora = tiempoPrecio.precio * cantidadHora;
        this.state.total += precioMinutos + precioHora;
      } else {
        for (let index = data.minutos; index < 60; index++) {
          cantidadMinutos++;
        }
        for (let index = 0; index < data.minutosTiempo; index++) {
          cantidadMinutos++;
        }
        if (cantidadMinutos > 60) {
          cantidadMinutos -= 60;
        }
        if (cantidadMinutos > 30) {
          var precioHora = tiempoPrecio.precio * cantidadHora;
          var total = precioHora;
          this.state.totalTiempo = total;
        } else {
          var precio = tiempoPrecio.precio / 2;
          var precioHora = tiempoPrecio.precio * cantidadHora;
          var total = precio + precioHora;
          this.state.totalTiempo = total;
        }
      }
    } else {
      for (let index = data.minutos; index < data.minutosTiempo; index++) {
        cantidadMinutos++;
      }
      if (cantidadMinutos > 30) {
        var precioMinutos = tiempoPrecio.precio;
        var precioHora = tiempoPrecio.precio * cantidadHora;
        var total = precioMinutos + precioHora;
        this.state.totalTiempo = total;
      } else {
        var precio = tiempoPrecio.precio / 2;
        var precioHora = tiempoPrecio.precio * cantidadHora;
        var total = precio + precioHora;
        this.state.totalTiempo = total;
      }
    }
  }
  verHora() {
    var hora = this.state.dataGetServicio.tiempo.split(':')[0];
    hora = hora.split('0')[1];
    var minutos = this.state.dataGetServicio.tiempo.split(':')[1];
    var horaTiempo = this.state.date.getHours();
    var minutosTiempo = this.state.date.getMinutes();
    this.calcularTiempoPrecio({
      hora,
      minutos,
      horaTiempo,
      minutosTiempo,
    });
    var tiempoHora =
      this.state.date.getHours() +
      ' : ' +
      this.state.date.getMinutes() +
      ' : ' +
      this.state.date.getSeconds();
    return (
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 20}}>
          Hora Actual
        </Text>
        <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 20}}>
          {tiempoHora}
        </Text>
      </View>
    );
  }
  verServicio() {
    var colorTiempo = '#fff';
    if (this.state.dataGetServicio.tiempo_finalizado) {
      colorTiempo = 'red';
    }
    if (!this.state.dataGetServicio.servicios_detalle) {
      this.state.dataGetServicio.servicios_detalle = [];
    }
    return (
      <View
        style={{
          width: '100%',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 20}}>
          Servicios Mesa Billar
        </Text>
        {this.verHora()}
        {!this.state.dataGetServicio.tiempo_finalizado ? (
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 15}}>
                Tiempo Comienzo
              </Text>
              <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 15}}>
                {this.state.dataGetServicio.tiempo}
              </Text>
            </View>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 15}}>
                Total Cobro tiempo
              </Text>
              <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 15}}>
                {this.state.totalTiempo} Bs
              </Text>
            </View>
          </View>
        ) : (
          <View />
        )}
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <View
            style={{
              alignItems: 'center',
              margin: 10,
              flex: 1,
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={() => {
                if (!this.state.dataGetServicio.tiempo_finalizado) {
                  this.popupTiempo();
                  return <View />;
                }
                this.habilitarTiempo();
              }}
              style={{
                borderRadius: 10,
              }}>
              <Svg
                name={'tiempo'}
                style={{
                  width: 35,
                  height: 35,
                  fill: colorTiempo,
                }}
              />
            </TouchableOpacity>
            <Text
              style={{
                color: '#fff',
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: 10,
              }}>
              {!this.state.dataGetServicio.tiempo_finalizado
                ? 'Terminar Tiempo'
                : 'Habilitar Tiempo'}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              margin: 10,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={() => {
                this.updateServicio();
              }}>
              <Svg
                name={'tragos'}
                style={{
                  width: 35,
                  height: 35,
                  fill: '#fff',
                }}
              />
            </TouchableOpacity>
            <Text
              style={{
                color: '#fff',
                fontWeight: 'bold',
                fontSize: 10,
                textAlign: 'center',
              }}>
              Guardar nuevos productos
            </Text>
          </View>
          <View
            style={{
              margin: 10,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={() => {
                this.popupProducto(true);
              }}>
              <Svg
                name={'agregar'}
                style={{
                  width: 35,
                  height: 35,
                  fill: '#fff',
                }}
              />
              <Text
                style={{
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: 10,
                  textAlign: 'center',
                }}>
                Agregar Productos
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              margin: 10,
              alignItems: 'center',
              justifyContent: 'space-evenly',
            }}>
            <TouchableOpacity onPress={() => this.terminarServicio()}>
              <Svg
                name={'finalizar'}
                style={{
                  width: 35,
                  height: 35,
                  fill: '#fff',
                }}
              />
            </TouchableOpacity>
            <Text
              style={{
                color: '#fff',
                fontWeight: 'bold',
                fontSize: 10,
                textAlign: 'center',
              }}>
              Terminar Servicio
            </Text>
          </View>
        </View>

        <FlatList
          style={{width: '100%'}}
          data={this.state.dataGetServicio.servicios_detalle}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('mesa billar', {
                    dataMesa: item,
                  });
                }}
                style={{
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <View
                  style={{
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
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
                    Prec: {item.precio}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      var cantidad = item.cantidad + 1;
                      this.state.dataGetServicio.servicios_detalle[
                        index
                      ].cantidad = cantidad;
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
                      if (this.state.arrayCantidad[index] === item.cantidad) {
                        return <View />;
                      }
                      var cantidad = item.cantidad;
                      cantidad--;
                      this.state.dataGetServicio.servicios_detalle[
                        index
                      ].cantidad = cantidad;
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
          data={this.state.arrayServicio}
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
                  padding: 10,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
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
                    Prec: {item.precio}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      var cantidad =
                        this.state.arrayServicio[index]['cantidad'];
                      cantidad = Number(cantidad);
                      cantidad += 1;
                      this.state.arrayServicio[index]['cantidad']++;
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
                        this.state.arrayServicio[index]['cantidad'];

                      cantidad = Number(cantidad);
                      cantidad -= 1;
                      if (cantidad === 0) {
                        return <View />;
                      }
                      this.state.arrayServicio[index]['cantidad']--;
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

    if (
      this.props.state.serviciosReducer.estado === 'exito' &&
      this.props.state.serviciosReducer.type === 'getServicio'
    ) {
      this.props.state.serviciosReducer.estado = '';
      var arrayCantidadDetalle = [];
      if (this.props.state.serviciosReducer.dataGetServicio) {
        if (this.props.state.serviciosReducer.dataGetServicio.servicios_detalle) {
        this.props.state.serviciosReducer.dataGetServicio.servicios_detalle.map(
          (data, key) => {
            arrayCantidadDetalle.push(data.cantidad);
          },
        );
        }
        this.state.dataGetServicio =
          this.props.state.serviciosReducer.dataGetServicio;
        this.state.dataGetServicio1 =
          this.props.state.serviciosReducer.dataGetServicio;

        this.state.arrayCantidad = arrayCantidadDetalle;
        this.setState({...this.state});
      } else {
        this.state.dataGetServicio = {};
      }
    }
    if (
      this.props.state.serviciosReducer.estado === 'exito' &&
      this.props.state.serviciosReducer.type === 'addServicio'
    ) {
      this.props.state.serviciosReducer.dataGetServicio = false;
      this.props.navigation.goBack();
      this.props.state.serviciosReducer.type = '';
    }
    if (!this.props.state.serviciosReducer.dataGetServicio) {
      this.props.getServicio(this.props.state.socketReducer.socket, {
        key_mesa_billar: this.state.dataMesa.key,
        key_mesa: '',
      });
    }
    if (this.props.state.serviciosReducer.estado === 'exito') {
      this.props.state.serviciosReducer.estado = '';
      this.props.state.serviciosReducer.dataGetServicio = false;
      this.props.navigation.goBack();
    }
    return (
      <View
        style={{
          flex: 1,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: tema.fondo,
        }}>
        <Barra
          titulo={'Ver ' + this.state.dataMesa.nombre}
          navigation={this.props.navigation}
          funcion={this.props.state.serviciosReducer.clearData}
        />
        <View
          style={{
            width: '90%',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {Object.keys(this.props.state.serviciosReducer.dataGetServicio)
            .length === 0
            ? this.crearServicio()
            : this.verServicio()}
        </View>
      </View>
    );
  }
}

export default connect(initStates, initActions)(VerServiciosPage);
