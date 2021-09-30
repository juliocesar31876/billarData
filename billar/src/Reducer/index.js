import { combineReducers } from 'redux';
import socketReducer from './socketReducer';
import usuarioReducer from './usuarioReducer';
import navigationReducer from './navigationReducer';
import sucursalReducer from './sucursalReducer';
import serviciosReducer from './serviciosReducer';
import productosReducer from './productosReducer';
import popupReducer from './popupReducer';
export default combineReducers({
    socketReducer,
    usuarioReducer,
    navigationReducer,
    sucursalReducer,
    serviciosReducer,
    productosReducer,
    popupReducer
});