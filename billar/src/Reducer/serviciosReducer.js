const initialState = {
  dataMesaBillar: false,
  dataMesa: false,
  dataGetServicio: false,
  dataPrecioTiempo: false,
  dataTotalCaja: false,
  estado: 'Not Found',
};
export default (state, action) => {
  if (!state) return initialState;
  if (action.component == 'servicios') {
    switch (action.type) {
      case 'updataGetServicios':
        updataGetServicios(state, action);
        break;
      case 'addServicio':
        addServicio(state, action);
        break;
      case 'finalizarServicio':
        finalizarServicio(state, action);
        break;
      case 'getServicio':
        getServicio(state, action);
        break;
      case 'finalizarTiempo':
        finalizarTiempo(state, action);
        break;
      case 'habilitarTiempo':
        habilitarTiempo(state, action);
        break;

      case 'getAllMesaBillar':
        getAllMesaBillar(state, action);
        break;
      case 'getAlllMesa':
        getAlllMesa(state, action);
        break;
      case 'getAllPrecioTiempo':
        getAllPrecioTiempo(state, action);
        break;
      case 'totalLibroCaja':
        totalLibroCaja(state, action);
        break;
    }
    state = {...state};
  }
  return state;
};
const totalLibroCaja =(state,action)=>{
  state.estado=action.estado
  state.type=action.type
if (action.estado==="exito") {
  state.totalPrecioProduccion=0
  state.totalPrecioVenta=0
  action.dataProductos.map(data=>{
    state.totalPrecioVenta+=data.precio_venta
    state.totalPrecioProduccion+=data.precio_produccion
  })
  state.dataTotalCaja= {
    objProductos:action.dataProductos,
    objTiempo:action.dataTiempo,
  }
}

}
const finalizarServicio = (state, action) => {
  state.estado = action.estado;
  state.type = action.type;
};
const updataGetServicios = (state, action) => {
  state.estado = action.estado;
  state.type = action.type;
};
const finalizarTiempo = (state, action) => {
  state.estado = action.estado;
  state.type = action.type;
};
const habilitarTiempo = (state, action) => {
  state.estado = action.estado;
  state.type = action.type;
};
const getAllPrecioTiempo = (state, action) => {
  state.estado = action.estado;
  state.type = action.type;
  if (action.estado === 'exito') {
    state.dataPrecioTiempo = action.data;
  }
};
const addServicio = (state, action) => {
  state.estado = action.estado;
  state.type = action.type;
};
const getServicio = (state, action) => {
  state.estado = action.estado;
  state.type = action.type;
  if (action.estado === 'exito') {
    state.dataGetServicio = action.data;
  }
};
const getAllMesaBillar = (state, action) => {
  state.estado = action.estado;
  state.type = action.type;
  if (action.estado === 'exito') {
    state.dataMesaBillar = action.data;
  }
};
const getAlllMesa = (state, action) => {
  state.estado = action.estado;
  state.type = action.type;
  if (action.estado === 'exito') {
    state.dataMesa = action.data;
  }
};
