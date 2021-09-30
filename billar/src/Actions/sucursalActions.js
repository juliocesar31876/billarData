export const getAllSucursal = (socket) => async (dispatch) => {
    var objToSend = {
        component: "sucursal",
        type: "getAllSucursal",
        estado: "cargando"
    };
    if (!socket) {
        dispatch({
            ...objToSend,
            estado: "error"
        })
        return;
    }
    socket.send(JSON.stringify(objToSend));
    dispatch({
        ...objToSend,
        estado: "cargando"
    })
}
export const getSucursal = (socket, data) => async (dispatch) => {
    var objToSend = {
        component: "sucursal",
        data,
        type: "getSucursal",
        estado: "cargando"
    };
    if (!socket) {
        dispatch({
            ...objToSend,
            estado: "error"
        })
        return;
    }
    socket.send(JSON.stringify(objToSend));
    dispatch({
        ...objToSend,
        estado: "cargando"
    })
}


