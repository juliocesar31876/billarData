const initialState = {
    estado: "Not Found",
    dataSucursal: false,
    dataGetSucursal: false,
    dataSelectSucursal: false
}
export default (state, action) => {
    if (!state) return initialState
    if (action.component == "sucursal") {
        switch (action.type) {
            case "getAllSucursal":
                getAllSucursal(state, action);
                break;
            case "getSucursal":
                getSucursal(state, action);
                break;
        }
        state = { ...state };
    }
    return state;
}
const getAllSucursal = (state, action) => {
    state.estado = action.estado
    state.type = action.type
    if (action.estado === "exito") {
        if (!state.dataSucursal || action.data.length === 0) {
            state.dataSucursal = {}
            state.estado = ""
        }
        action.data.map((obj) => {
            state.dataSucursal[obj.key] = obj
        })
    }
}
const getSucursal = (state, action) => {
    state.estado = action.estado
    state.type = action.type
    if (action.estado === "exito") {
        if (!state.dataGetSucursal || action.data.length === 0) {
            state.dataGetSucursal = {}
        }
        state.dataGetSucursal = action.data
    }
}
