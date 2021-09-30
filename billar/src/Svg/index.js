import React from 'react';
import {Text} from 'react-native';
import Volver from '../SvgImg/volver.svg';
import Logo from '../SvgImg/logo.svg';
import Billar from '../SvgImg/mesaBillar.svg';
import Mesa from '../SvgImg/mesa.svg';
import Producto from '../SvgImg/verProducto.svg';
import Caja from '../SvgImg/librocaja.svg';
import Tienda from '../SvgImg/tienda.svg';
import Mas from '../SvgImg/mas.svg';
import Menos from '../SvgImg/menos.svg';
import Agregar from '../SvgImg/add.svg';
import AnadirProducto from '../SvgImg/productos/anadirProducto.svg';
import TipoProducto from '../SvgImg/productos/tipoProducto.svg';
import Tiempo from '../SvgImg/reloj.svg';
import Tragos from '../SvgImg/tragos.svg';
import Finalizar from '../SvgImg/finalizar.svg';
const Svg = props => {
  switch (props.name) {
    case 'finalizar':
      return <Finalizar style={props.style} />;
    case 'tiempo':
      return <Tiempo style={props.style} />;
    case 'tragos':
      return <Tragos style={props.style} />;
    case 'mas':
      return <Mas style={props.style} />;
    case 'menos':
      return <Menos style={props.style} />;
    case 'agregar':
      return <Agregar style={props.style} />;
    case 'sucursales':
      return <Tienda style={props.style} />;
    case 'volver':
      return <Volver style={props.style} />;
    case 'Productos':
      return <Producto style={props.style} />;
    case 'logo':
      return <Logo style={props.style} />;
    case 'Servicios Billar':
      return <Billar style={props.style} />;
    case 'billar':
      return <Billar style={props.style} />;
    case 'Atencion Mesa':
      return <Mesa style={props.style} />;
    case 'Caja Total':
      return <Caja style={props.style} />;
    case 'agregar productos':
      return <AnadirProducto style={props.style} />;
    case 'tipo produto':
      return <TipoProducto style={props.style} />;
    default:
      return <Text>SVG</Text>;
  }
};

export default Svg;
