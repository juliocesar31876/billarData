import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Linking,
  Animated,
  Text,
  Dimensions,
} from 'react-native';
import {connect} from 'react-redux';
import Carga from './carga';
import Svg from '../../Svg';
import tema from '../../config/style.json';

class CargaPage extends Component {
  constructor(props) {
    super(props);
    /////navigation guardamos en cada pagina
    props.state.navigationReducer.navigation = props.navigation;
    ///////////////////////////////////
    this.state = {
      startValue: new Animated.Value(1),
      endValue: 1.3,
    };
  }

  componentDidMount() {
    // B
    Animated.loop(
      Animated.spring(this.state.startValue, {
        toValue: this.state.endValue,
        friction: 1,
        useNativeDriver: true,
      }),
      {iterations: 1000},
    ).start();
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: tema.fondo,
        }}>
        <Animated.View
          style={[
            styles.square,
            {
              transform: [
                {
                  scale: this.state.startValue,
                },
              ],
            },
          ]}>
          <View
            style={{
              width: '100%',
              alignItems: 'center',
            }}>
            <Svg
              name="logo"
              style={{
                width: Dimensions.get('window').width * 0.5,
                height: Dimensions.get('window').width * 0.9,
                fill: '#fff',
              }}
            />
          </View>
        </Animated.View>
        <Carga  navigation={this.props.navigation}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  square: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const initStates = state => {
  return {state};
};

export default connect(initStates)(CargaPage);
