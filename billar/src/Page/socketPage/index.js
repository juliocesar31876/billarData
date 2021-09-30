import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
const initStates = state => {
  return {state};
};
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View>
        <TouchableOpacity
          style={{
            width: '100%',
            height: 100,
            alignItems: 'center',
            borderWidth: 1,
            justifyContent: 'center',
          }}
          onPress={() => {
            var dataSend = {
              tipo: 'hola',
              ruta: 'usuario',
              data: 'dasdas',
              err: false,
            };
            this.props.state.socketReducer.socket.send(
              JSON.stringify(dataSend),
            );
          }}>
          <Text>MyComponent</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default connect(initStates)(index);
