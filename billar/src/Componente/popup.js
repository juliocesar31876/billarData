import React from 'react';
import {
    View, StyleSheet, TouchableOpacity, Button,
    BackHandler,
    TouchableWithoutFeedback,
    Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import * as popupActions from '../Actions/popupActions';
import  tema from '../config/style.json'
const Popup = (props) => {
    if (!props.state.popupReducer.estado) {
        return <View />
    }
    const cerrarVentana = () => {
        props.cerrarPopup();
        return <View />
    }
    return (
        <View style={{
            position: "absolute",
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height,
            justifyContent: "center",
            alignItems: "center",
        }}>
            <TouchableOpacity onPress={cerrarVentana} style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                backgroundColor: "#00000022"
            }}>
            </TouchableOpacity>
           
                <props.state.popupReducer.element />
        </View>
    );
}
const initActions = ({
    ...popupActions
});
const initStates = (state) => {
    return { state }
};
export default connect(initStates, initActions)(Popup);
