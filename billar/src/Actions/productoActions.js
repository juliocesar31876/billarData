export const registrarProducto = (socket, datos) => async (dispatch) => {
    var objToSend = {
        component: "producto",
        type: "addProducto",
        data: datos,
        mensaje: "",
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
export const AddTipoProducto = (socket, datos) => async (dispatch) => {
    var objToSend = {
        component: "producto",
        type: "addTipoProducto",
        data: datos,
        mensaje: "",
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
export const addAgregaciones = (socket, datos) => async (dispatch) => {
    var objToSend = {
        component: "producto",
        type: "addAgregaciones",
        data: datos,
        mensaje: "",
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
export const addTipoAgregaciones = (socket, datos) => async (dispatch) => {
    var objToSend = {
        component: "producto",
        type: "addTipoAgregaciones",
        data: datos,
        mensaje: "",
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
export const getAllTipoProducto = (socket,data) => async (dispatch) => {
    var objToSend = {
        component: "producto",
        type: "getAllTipoProducto",
        estado: "cargando",
        data
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
export const getAllProducto = (socket) => async (dispatch) => {
    var objToSend = {
        component: "producto",
        type: "getAllProducto",
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
export const getAllAgregaciones = (socket) => async (dispatch) => {
    var objToSend = {
        component: "producto",
        type: "getAllAgregaciones",
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
export const getAllTipoAgregaciones = (socket,data) => async (dispatch) => {
    var objToSend = {
        component: "producto",
        data,
        type: "getAllTipoAgregaciones",
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
export const actualizarProducto = (dato) => async (dispatch) => {
    var objToSend = {
        component: "producto",
        type: "actualizarProducto",
        data:dato
    };
    dispatch({
        ...objToSend,
    })
}
