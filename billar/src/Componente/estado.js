import React from 'react';
import { View, ActivityIndicator ,Text} from 'react-native';
import tema from '../../src/config/style.json';
const Estado = (props) => {
    return (
        <View style={{ flex: 1, width: "100%",alignItems: 'center', justifyContent: 'center',backgroundColor: tema.fondo, }}>
            <Text style={{ color: "#fff", margin: 5 }}>{props.estado}</Text>
            <ActivityIndicator size="small" color="#fff" /></View>
    )
}
export default Estado;
