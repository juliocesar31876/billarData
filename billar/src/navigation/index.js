import * as React from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import InicioPage from './../Page/InicioPage';
import LoginPage from './../Page/LoginPage';
import CargaPage from './../Page/CargaPage';
import SucursalesPage from './../Page/SucursalesPage';
import ServicioBillarPage from './../Page/ServicioBillarPage';
import VerServiciosPage from './../Page/ServicioBillarPage/VerServiciosPage';
import ProductosPage from './../Page/ProductosPage';
import ServicioMesaPage from './../Page/ServicioMesaPage';
import VerServicioMesaPage from './../Page/ServicioMesaPage/VerServicioMesaPage';
import TotalLibroCajaPage from './../Page/TotalLibroCajaPage';
const Stack = createNativeStackNavigator();
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="carga" component={CargaPage} />
        <Stack.Screen name="login" component={LoginPage} />
        <Stack.Screen name="inicio" component={InicioPage} />
        <Stack.Screen name="sucursal" component={SucursalesPage} />
        <Stack.Screen name="servicio billar" component={ServicioBillarPage} />
        <Stack.Screen name="mesa billar" component={VerServiciosPage} />
        <Stack.Screen name="productos" component={ProductosPage} />
        <Stack.Screen name="atencion mesa" component={ServicioMesaPage} />
        <Stack.Screen name="ver mesa" component={VerServicioMesaPage} />
        <Stack.Screen name="total caja" component={TotalLibroCajaPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
