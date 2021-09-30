import socketData from './../config/socket.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
function iniciandoSocketGolang(store) {
  console.log(store);
  var socket = new WebSocket(socketData.url_socket);
  socket.onopen = () => {
    console.log('conexion Exitosa');
    store.dispatch({
      component: 'socket',
      type: 'open',
      reconect: false,
      estado: 'conectado',
      mensaje: 'conectado con exito',
      reintent: 0,
      socket: socket,
      send: socket.send,
    });
  };

  socket.onmessage = mensaje => {
    console.log(mensaje.data);
    try {
      /* var data = JSON.parse(mensaje.data);
      console.log(data.component + ' ' + data.type);
      console.log(data);
      store.dispatch({
        ...data,
      }); */
    } catch (e) {
      console.log(' ERROR===>' + e);
    }
  };

  socket.onclose = closeSocket => {
    console.log('Socket Closed Connection: ', closeSocket);
    store.dispatch({
      component: 'socket',
      type: 'close',
      estado: 'desconectado close',
      mensaje: 'cerro Socket : ' + closeSocket.message(),
      socket: false,
    });
  };

  socket.onerror = errorSocket => {
    store.dispatch({
      component: 'socket',
      type: 'close',
      estado: 'desconectado close',
      mensaje: 'Socket Error: ' + errorSocket.message(),
      socket: false,
    });
  };
}

const iniciandoSocket = async store => {
  const delay = ms => new Promise(res => setTimeout(res, ms));
  var reintent = 0;
  var url = socketData.url_socket;
  const value = await AsyncStorage.getItem('usuario');
  if (value != null) {
    var usuario = JSON.parse(value);
    url = url + usuario.key;
  }
  const Reconnect = async () => {
    reintent++;
    if (reintent > 2) {
      store.dispatch({
        component: 'socket',
        type: 'close',
        estado: 'Reconectando',
        reconect: true,
        mensaje: 'conexion Perdida',
        reintent: reintent,
        socket: false,
      });
    }
    await delay(5000);
    openSocket(url);
    if (store.getState().socketReducer.estado !== 'conectado') {
      Reconnect();
    }
  };
  var openSocket = url => {
    var socket = new WebSocket(url);
    socket.onopen = () => {
      console.log('open');
      store.dispatch({
        component: 'socket',
        type: 'open',
        reconect: false,
        estado: 'conectado',
        mensaje: 'conectado con exito',
        reintent: 0,
        socket: socket,
      });
      reintent = 0;
    };
    socket.onclose = () => {
      console.log('close');

      if (!store.getState().socketReducer.reconect) {
        Reconnect();
        return;
      }
      store.dispatch({
        component: 'socket',
        type: 'close',
        estado: 'desconectado close',
        mensaje: 'conexion Perdida',
        socket: false,
      });
    };
    socket.onerror = event => {
      console.log(event.data);

      store.dispatch({
        component: 'socket',
        type: 'error',
        estado: 'Error',
        mensaje: 'conexion erroenea o  Perdida',
        socket: false,
      });
    };
    socket.addEventListener('message', function (event) {
      console.log('MENSAJE SOCKET');

      try {
        var data = JSON.parse(event.data);
        console.log(data.component + ' ' + data.type);
        console.log(data);
        store.dispatch({
          ...data,
        });
      } catch (e) {
        console.log('ERROR');
      }
    });
  };
  openSocket(url);
};
const Reconnect = async () => {
  reintent++;
  if (reintent > 2) {
    store.dispatch({
      component: 'socket',
      type: 'close',
      estado: 'Reconectando',
      reconect: true,
      mensaje: 'conexion Perdida',
      reintent: reintent,
      socket: false,
    });
  }
  await delay(5000);
  openSocket(url);
  if (store.getState().socketReducer.estado !== 'conectado') {
    Reconnect();
  }
};
const servicioSocket = {
  iniciandoSocket,
  iniciandoSocketGolang,
};

export default servicioSocket;
