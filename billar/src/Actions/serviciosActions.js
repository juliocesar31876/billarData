

export const finalizarServicio = (socket, datos) => async (dispatch) => {
    var objToSend = {
        component: "servicios",
        type: "finalizarServicio",
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
export const habilitarTiempo = (socket, datos) => async (dispatch) => {
    var objToSend = {
        component: "servicios",
        type: "habilitarTiempo",
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
export const finalizarTiempo = (socket, datos) => async (dispatch) => {
    var objToSend = {
        component: "servicios",
        type: "finalizarTiempo",
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
export const updataGetServicios = (socket, datos) => async (dispatch) => {
    var objToSend = {
        component: "servicios",
        type: "updataGetServicios",
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
export const addServicio = (socket, datos) => async (dispatch) => {
    var objToSend = {
        component: "servicios",
        type: "addServicio",
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
export const getServicio = (socket, datos) => async (dispatch) => {
    var objToSend = {
        component: "servicios",
        type: "getServicio",
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
export const getAllMesaBillar = (socket, datos) => async (dispatch) => {
    var objToSend = {
        component: "servicios",
        type: "getAllMesaBillar",
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
export const getAllPrecioTiempo = (socket) => async (dispatch) => {
    var objToSend = {
        component: "servicios",
        type: "getAllPrecioTiempo",
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

export const getAlllMesa = (socket, obj) => async (dispatch) => {
    const _obj = {
        component: "servicios",
        type: "getAlllMesa",
        data: obj,
    }
    if (!socket) {
        dispatch({
            ..._obj,
            estado: "error"
        })
        return;
    }
    socket.send(JSON.stringify(_obj));
    dispatch({
        ..._obj,
        estado: "cargando"
    })

}

export const totalLibroCaja=(socket)=>async (dispatch)=>{
    const _obj={
        component:"servicios",
        type:"totalLibroCaja",
    }
    if (!socket) {
        dispatch({
            ..._obj,
            estado:"error"
        })
    }
    socket.send(JSON.stringify(_obj))
    dispatch({
        ..._obj,
        estado:"cargando"
    })

}