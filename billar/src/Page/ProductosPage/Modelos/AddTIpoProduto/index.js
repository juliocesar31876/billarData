import React from 'react';
import { connect } from 'react-redux';
import * as productoActions from '../../../../Actions/productoActions'
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    Dimensions
} from 'react-native';
import Estado from '../../../../Componente/estado';
import tema from '../../../../config/style.json';
const AddTIpoProduto = (props) => {
    const [data, setData] = React.useState({
        nombre: {
            value: "",
            error: false
        }
    })
    var dataTipoProducto = props.state.productosReducer.dataTipoProducto
    var count = 0
    if (!props.state.socketReducer.socket) {
        return <Estado estado={"Reconectando"} />
    }
    if (props.state.productosReducer.type === "addTipoProducto") {
        if (props.state.productosReducer.estado === "exito") {
            props.state.productosReducer.estado = ""
            data.nombre.value = ""
            setData({ ...data })
        }
    }
    if (props.state.productosReducer.estado === "error") {
        props.state.productosReducer.estado = ""
        alert("error : existe ya este nombre ")
    }
    const hanlechage = (text) => {
        data.nombre = {
            value: text,
            error: false
        }
        setData({ ...data })
    }
    const addTipo = () => {
        var exito = true
        var dato = {}
        var sucursal = props.state.sucursalReducer.dataSelectSucursal
        if (data.nombre.value === "") {
            exito = false
            data.nombre.error = true
        } else {
            dato["nombre"] = data.nombre.value
            dato["estado"] = 1
            dato["key_sucursal"] = props.state.usuarioReducer.usuarioLog.sucursal.key
        }
        setData({ ...data })
        if (exito) {
            props.AddTipoProducto(props.state.socketReducer.socket, dato)
        }
    }
    return (
        <View style={{
            flex: 1,
            width: "100%",
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <View style={{
                width: '90%',
                alignItems: 'center',
            }}>

                <Text style={{ color: "#fff", margin: 5, width: '100%', }}>Tipo produto</Text>
                <TextInput
                    autoCapitalize={"none"}
                    onChangeText={text => hanlechage(text)}
                    value={data.nombre.value}
                    style={(data.nombre.error ? styles.error : styles.input)} />
                <View
                    style={{
                        margin: 10,
                        width: 140,
                        marginTop: 20,
                        height: 40,
                        borderRadius: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1,
                        borderColor: "#fff",
                    }}>
                    {props.state.productosReducer.type === "addTipoProducto" && props.state.productosReducer.estado === "cargando" ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <TouchableOpacity onPress={() => addTipo()} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                            <Text style={{
                                color: "#fff",
                                textAlign: "center",
                                fontSize: 12,
                            }}>registrar producto</Text>
                        </TouchableOpacity>
                    )
                    }
                </View>

                <Text style={{ margin: 4, textAlign: "left", width: '100%', color: "#fff", fontWeight: 'bold', }}>Tipo producto </Text>
                {Object.keys(dataTipoProducto).map((key) => {
                    var obj = dataTipoProducto[key]
                    count++
                    return (
                        <View style={{
                            margin: 5,
                            width: "100%",
                            height: 25,
                            flexDirection: 'row',
                            borderColor: "#fff",
                            alignItems: 'center',
                        }}>
                            <Text style={{
                                margin: 4, color: "#fff", fontSize: 12,
                                textAlign: "left", flex: 1,
                            }}>{count} -.  {obj.nombre}</Text>
                        </View>

                    )

                })

                }
            </View>

        </View>
    )
};
const styles = StyleSheet.create({
    touc: {
        backgroundColor: '#ffffff',
        color: '#000',
        marginTop: 10,
        borderRadius: 8,
        width: '100%',
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
    },
    touc2: {
        backgroundColor: '#ffffff',
        color: '#000',
        marginTop: 10,
        borderRadius: 8,
        width: '100%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        backgroundColor: '#ffffff',
        color: '#000',
        marginTop: 8,
        borderRadius: 8,
        borderBottomWidth: 1,
        borderColor: "#000",
        width: '100%',
        height: 35,
        fontSize: Dimensions.get('window').width * 0.035,
    },
    error: {
        borderWidth: 1,
        borderColor: "#f00",
        backgroundColor: '#ffffff',
        color: '#000',
        marginTop: 10,
        fontSize: Dimensions.get('window').width * 0.035,
        borderRadius: 8,
        width: '100%',
        height: 35,
    },
});
const initStates = (state) => {
    return { state }
};
const initActions = ({
    ...productoActions
});
export default connect(initStates, initActions)(AddTIpoProduto);
