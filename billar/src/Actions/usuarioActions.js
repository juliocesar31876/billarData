export const login = (socket, datos) => async (dispatch) => {
    var objToSend = {
        component: "usuario",
        type: "login",
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


export const editarPerfil = (socket, obj) => async (dispatch) => {
    const _obj = {
        component: "usuario",
        type: "editarPerfil",
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