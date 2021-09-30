package components;

import conexion.Conexion;
import conexion.ConexionPostgres;
import java.io.IOException;
import java.sql.SQLException;
import java.util.UUID;
import javax.websocket.Session;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class Servicios {

    public Servicios(JSONObject data, Session session) throws JSONException {
        try {
            if (!data.isNull("type")) {
                switch (data.getString("type")) {
                    case "addServicio": {
                        addServicio(data, session);
                        break;
                    }
                    case "finalizarServicio": {
                        finalizarServicio(data, session);
                        break;
                    }
                    case "finalizarTiempo": {
                        finalizarTiempo(data, session);
                        break;
                    }
                    case "habilitarTiempo": {
                        habilitarTiempo(data, session);
                        break;
                    }
                    case "updataGetServicios": {
                        updataGetServicios(data, session);
                        break;
                    }
                    case "getAllMesaBillar": {
                        getAllMesaBillar(data, session);
                        break;
                    }
                    case "getAllPrecioTiempo": {
                        getAllPrecioTiempo(data, session);
                        break;
                    }
                    case "getAlllMesa": {
                        getAlllMesa(data, session);
                        break;
                    }
                    case "getServicio": {
                        getServicio(data, session);
                        break;
                    }
                    case "totalLibroCaja": {
                        totalLibroCaja(data, session);
                        break;
                    }
                }
            } else {
                data.put("error", "No existe el campo type");
            }
//            session.getBasicRemote().sendText(data.toString());
        } catch (Exception ex) {
            try {
                session.getBasicRemote().sendText("{estado:'error' ,error:'" + ex.getLocalizedMessage() + "'}");
            } catch (IOException ex1) {
                System.out.println("Error en en constructor de la class Login.java");
            }
        }
    }

    private void totalLibroCaja(JSONObject data, Session session) throws JSONException {
        Conexion con = ConexionPostgres.getInstance();
        String consultaProductos = "select json_agg(row_to_json(detalle.*)) as json from (\n"
                + "select (\n"
                + "	select productos.nombre from productos\n"
                + "	where servicios_detalle.key_producto=productos.key\n"
                + "	),\n"
                + "	   sum(COALESCE(servicios_detalle.precio*servicios_detalle.cantidad,0)) as precio_venta,\n"
                + "	   sum(COALESCE(servicios_detalle.precio_produccion*servicios_detalle.cantidad,0)) as precio_produccion \n"
                + "from servicios_detalle\n"
                + "GROUP by servicios_detalle.key_producto\n"
                + ") as detalle";
        String consultaTiempo = "select row_to_json(tiempo) as json from (\n"
                + "select  sum(servicios.total_tiempo) as total_tiempo \n"
                + "from servicios\n"
                + ") as tiempo";

        try {
            JSONObject dataTiempo = con.ejecutarConsultaObject(consultaTiempo);
            JSONArray dataProductos = con.ejecutarConsultaArray(consultaProductos);
            data.put("dataTiempo", dataTiempo);
            data.put("dataProductos", dataProductos);
            data.put("estado", "exito");
        } catch (Exception e) {
            data.put("estado", "error");
            data.put("error", e.toString());
        }
    }

    private void habilitarTiempo(JSONObject data, Session session) throws SQLException, JSONException {
        Conexion con = ConexionPostgres.getInstance();
        JSONObject obj = data.getJSONObject("data");
        String key_servicio = obj.getString("key_servicio");
        String fecha_on = obj.getString("fecha_on");

        String consulta = "UPDATE servicios\n"
                + "SET tiempo_finalizado = false , tiempo='" + fecha_on + "' \n"
                + "where servicios.key='" + key_servicio + "'";
        try {
            con.commit();
            con.EjecutarUpdate(consulta);
        } catch (Exception e) {
            con.rollback();
        }
        data.put("estado", "exito");
    }

    private void finalizarTiempo(JSONObject data, Session session) throws SQLException, JSONException {
        Conexion con = ConexionPostgres.getInstance();
        JSONObject obj = data.getJSONObject("data");
        String key_servicio = obj.getString("key_servicio");
        String consulta = "UPDATE servicios\n"
                + "SET tiempo_finalizado = true \n"
                + "where servicios.key='" + key_servicio + "'";
        try {
            con.commit();
            con.EjecutarUpdate(consulta);
        } catch (Exception e) {
            con.rollback();
        }
        data.put("estado", "exito");
    }

    private void finalizarServicio(JSONObject data, Session session) throws SQLException, JSONException {
        Conexion con = ConexionPostgres.getInstance();
        JSONObject obj = data.getJSONObject("data");
        String key_servicio = obj.getString("key_servicio");
        String fecha_off = obj.getString("fecha_off");
        String consulta = "UPDATE servicios\n"
                + "SET tiempo_finalizado = true ,fecha_off='" + fecha_off + "'  \n"
                + "where servicios.key='" + key_servicio + "'";
        try {
            con.commit();
            con.EjecutarUpdate(consulta);
        } catch (Exception e) {
            con.rollback();
        }
        data.put("estado", "exito");
    }

    private void updataGetServicios(JSONObject data, Session session) throws SQLException, JSONException {
        Conexion con = ConexionPostgres.getInstance();
        JSONObject objData = data.getJSONObject("data");
        String key_servicio = objData.getString("key_servicio");
        JSONArray detalle_servicio = objData.getJSONArray("servicioDetalle");
        JSONArray arrayServicio = objData.getJSONArray("arrayServicio");
        try {
            con.commit();
            for (int i = 0; i < detalle_servicio.length(); i++) {
                JSONObject detalle = detalle_servicio.getJSONObject(i);
                String key_detalle = detalle.getString("key");
                String consulta = "UPDATE servicios_detalle\n"
                        + "SET cantidad =" + detalle.getInt("cantidad") + " \n"
                        + "where servicios_detalle.key_servicio='" + key_servicio + "'  and servicios_detalle.key='" + key_detalle + "' ";
                con.updateData(consulta);
            }
            for (int i = 0; i < arrayServicio.length(); i++) {
                JSONObject objDetalle = arrayServicio.getJSONObject(i);
                objDetalle.put("key", UUID.randomUUID());
                objDetalle.put("key_servicio", key_servicio);
                String key = con.insertar("servicios_detalle", new JSONArray().put(objDetalle));
            }

        } catch (Exception e) {
            con.rollback();
        }
        data.put("estado", "exito");
    }

    private void getAllPrecioTiempo(JSONObject data, Session session) throws SQLException, JSONException {
        Conexion con = ConexionPostgres.getInstance();
        String consulta = "select json_agg(row_to_json(precio_tiempo.*)) as json from (\n"
                + "                select precio_tiempo.*\n"
                + "                from precio_tiempo\n"
                + "                where precio_tiempo.estado = 1  )precio_tiempo \n";
        JSONArray arr = con.ejecutarConsultaArray(consulta);
        data.put("data", arr);
        data.put("estado", "exito");
    }

    private void addServicio(JSONObject data, Session session) throws SQLException, JSONException {
        Conexion con = ConexionPostgres.getInstance();
        JSONObject obj = data.getJSONObject("data");
        JSONObject servicios = obj.getJSONObject("servicios");
        String key_servicio = "";
        JSONArray servicio_detalle = obj.getJSONArray("servicios_detalle");
        String key_servicio_detalle = "";
        String consulta = "";
        con.Transacction();
        try {
            servicios.put("key", UUID.randomUUID());
            key_servicio = con.insertar("servicios", new JSONArray().put(servicios));
            if (servicio_detalle.length() > 0) {
                for (int i = 0; i < servicio_detalle.length(); i++) {
                    JSONObject objDetalle = servicio_detalle.getJSONObject(i);
                    objDetalle.put("key", UUID.randomUUID());
                    objDetalle.put("key_servicio", key_servicio);
                    key_servicio_detalle = con.insertar("servicios_detalle", new JSONArray().put(objDetalle));
                }
            }
            con.commit();
        } catch (Exception e) {
            con.rollback();
        }
        data.put("estado", "exito");
    }

    private void getServicio(JSONObject data, Session session) throws SQLException, JSONException {
        Conexion con = ConexionPostgres.getInstance();
        JSONObject obj = data.getJSONObject("data");
        String key_mesa = obj.getString("key_mesa");
        String key_mesa_billar = obj.getString("key_mesa_billar");
        String consulta = "";
        if (key_mesa.equals("")) {

            consulta = "select row_to_json(servicios.*) as json from (\n"
                    + "	select * ,(\n"
                    + "		select json_agg(servicios_detalle.*) as servicios_detalle from servicios_detalle\n"
                    + "		where servicios_detalle.key_servicio = servicios.key \n"
                    + "	) from servicios\n"
                    + "	where servicios.key_mesa_billar='" + key_mesa_billar + "'\n"
                    + " and servicios.fecha_off isnull and servicios.habilitado=true  ) servicios";
        } else {
            consulta = "select row_to_json(servicios.*) as json from (\n"
                    + "	select * ,(\n"
                    + "		select json_agg(servicios_detalle.*) as servicios_detalle  from servicios_detalle\n"
                    + "		where servicios_detalle.key_servicio = servicios.key \n"
                    + "	) from servicios\n"
                    + "	where servicios.key_mesa='" + key_mesa + "'\n"
                    + " and servicios.fecha_off isnull ) servicios";
        }
        JSONObject arr = con.ejecutarConsultaObject(consulta);
        data.put("data", arr);
        data.put("estado", "exito");
    }

    private void getAllMesaBillar(JSONObject data, Session session) throws SQLException, JSONException {
        Conexion con = ConexionPostgres.getInstance();
        JSONObject obj = data.getJSONObject("data");
        String key_sucursal = obj.getString("key_sucursal");
        String consulta = "	\n"
                + "	select json_agg(row_to_json(billar.*)) as json from (\n"
                + "		select mesa_billar.* from mesa_billar\n"
                + "		where mesa_billar.key_sucursal = '" + key_sucursal + "'\n"
                + "	) as billar";
        JSONArray arr = con.ejecutarConsultaArray(consulta);
        data.put("data", arr);
        data.put("estado", "exito");
    }

    private void getAlllMesa(JSONObject data, Session session) throws SQLException, JSONException {
        JSONObject obj = data.getJSONObject("data");
        String key_sucursal = obj.getString("key_sucursal");
        Conexion con = ConexionPostgres.getInstance();
        String consulta = "select json_agg(row_to_json(billar.*)) as json from (\n"
                + "		select mesa.* from mesa\n"
                + "		where mesa.key_sucursal = '" + key_sucursal + "'\n"
                + "	) as billar";
        JSONArray arr = con.ejecutarConsultaArray(consulta);
        data.put("data", arr);
        data.put("estado", "exito");
    }

}
