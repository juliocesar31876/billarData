import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Dimensions,
  StatusBar,
} from 'react-native';
import Svg from '../../Svg';
import * as usuarioActions from '../../Actions/usuarioActions';
import tema from '../../config/style.json';

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
class LoginPage extends Component {
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
  hanlechage(dato) {
    this.state.obj[dato.id] = {
      value: dato.text,
      error: false,
    };
    this.setState({...this.state});
  }
  Login() {
    var exito = true;
    var data = {};
    for (const key in this.state.obj) {
      var obj = this.state.obj[key];
      if (obj.value === '') {
        this.state.obj[key].error = true;
        exito = false;
      } else {
        data[key] = obj.value;
      }
    }
    this.setState({...this.state}); //este es para renderisar
    if (exito) {
      console.log(data);
      this.props.login(this.props.state.socketReducer.socket, data);
    }
  }
  render() {
    if (this.props.state.usuarioReducer.estado === 'exito') {
      this.props.state.usuarioReducer.estado = '';
      this.props.navigation.replace('carga');
    }
    if (this.props.state.usuarioReducer.estado === 'error') {
      this.props.state.usuarioReducer.estado = '';
      this.state.obj.pass.error = true;
      this.state.obj.user.error = true;
      this.setState({...this.state});
    }
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: tema.fondo,
        }}>
        <ScrollView
          style={{
            flex: 1,
          }}>
          <View
            style={{
              flex: 1,
              marginTop: 50,
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <View
              style={{
                flex: 1,
                width: '100%',
                height: 120,
                marginTop: 100,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Svg
                name="logo"
                style={{
                  width: Dimensions.get('window').width * 0.5,
                  height: Dimensions.get('window').width * 0.5,
                  fill: '#fff',
                }}
              />
            </View>
            <View
              style={{
                flex: 1,
                marginTop: 20,
                width: '100%',
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  flex: 1,
                  width: '80%',
                  flexDirection: 'column',
                }}>
                <Text style={{fontSize: 13, color: '#fff'}}>Usuario</Text>
                <TextInput
                  autoCapitalize={'none'}
                  onChangeText={text =>
                    this.hanlechage({text: text, id: 'user'})
                  }
                  placeholder={'Usuario'}
                  value={this.state.obj.user.value}
                  style={
                    this.state.obj.user.error ? styles.error : styles.input
                  }
                />
                <Text style={{marginTop: 5, fontSize: 13, color: '#fff'}}>
                  Contraseña
                </Text>
                <TextInput
                  secureTextEntry={true}
                  autoCapitalize={'none'}
                  onChangeText={text =>
                    this.hanlechage({text: text, id: 'pass'})
                  }
                  placeholder={'Password'}
                  value={this.state.obj.pass.value}
                  style={
                    this.state.obj.pass.error ? styles.error : styles.input
                  }
                />
              </View>
              <TouchableOpacity
                onPress={() => this.Login()}
                style={{
                  width: 130,
                  height: 40,
                  borderWidth: 2,
                  marginTop: 50,
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderColor: '#fff',
                }}>
                <Text style={{color: '#fff', fontSize: 12}}>
                  {' '}
                  Iniciar Session
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default connect(initStates, initActions)(LoginPage);
