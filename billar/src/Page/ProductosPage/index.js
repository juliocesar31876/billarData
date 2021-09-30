import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Text,
    View,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    ScrollView,
    Dimensions
} from 'react-native';
import Svg from '../../Svg';
import * as usuarioActions from '../../Actions/usuarioActions'
import Barra from '../../Componente/barra';
import VerProductos from './Modelos/VerProductos';
import AddProductos from './Modelos/AddProductos';
import AddTIpoProduto from './Modelos/AddTIpoProduto';
class ProductosPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            componet: "Agregar productos"
        }
    }
    selectComponet() {
        switch (this.state.componet) {
            case "Ver productos":
                return <VerProductos />
            case "Agregar productos":
                return <AddProductos />
            case "Tipo Produto":
                return <AddTIpoProduto />
            default:
                return <View />
        }
    }
    select(text) {
        this.state.componet = text
        this.setState({ ...this.state })
    }
    barraMenu() {
        return (
            <View style={{
                width: "100%",
                height: 50,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
            }}>
                {["Agregar productos", "Tipo Produto", "Ver productos"].map((text) => {
                    var color = "#fff"
                    var icono = text.toLowerCase()
                    if (this.state.componet === text) {
                        color = "#999"
                    }
                    if (text === "Ver productos") {
                        icono = "productos"
                    }
                    return (
                        <TouchableOpacity
                            onPress={() => {
                                this.select(text)
                            }}
                            style={{
                                flex: 1,
                                height: "100%",
                                margin: 5,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderColor: color,
                            }}>
                            <Svg name={icono}
                                style={{
                                    width: Dimensions.get('window').width * 0.080,
                                    height: 40,
                                    fill: color,
                                }} />

                            <Text style={{
                                color: color,
                                fontSize: 8,
                                textAlign: "center",
                                fontWeight: 'bold',
                            }}>{text}</Text>
                        </TouchableOpacity>
                    )


                })
                }
            </View>
        )
    }
    render() {

        return (
            <View style={{
                backgroundColor: "#000",
                flex: 1,
                width: Dimensions.get("window").width,
                height: Dimensions.get("window").height,
                alignItems: 'center',

            }}>
                <Barra titulo={this.state.titulo} navigation={this.props.navigation} />
                <ScrollView style={{
                    width: '100%',
                }}>
                    {this.selectComponet()}
                </ScrollView>
                {this.barraMenu()}
            </View>
        );
    }
};
const initActions = ({
    ...usuarioActions
});
const initStates = (state) => {
    return { state }
};
export default connect(initStates, initActions)(ProductosPage);
