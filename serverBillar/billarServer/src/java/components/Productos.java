package components;

import conexion.Conexion;
import conexion.ConexionPostgres;
import java.io.IOException;
import java.sql.SQLException;
import static java.time.Instant.now;
import java.util.UUID;
import javax.websocket.Session;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import socket.sessions;

public class Productos {

    public Productos(JSONObject data, Session session) throws JSONException {
        try {
            if (!data.isNull("type")) {
                switch (data.getString("type")) {
                    case "addProducto": {
                        addProducto(data, session);
                        break;
                    }
                    case "addTipoProducto": {
                        addTipoProducto(data, session);
                        break;
                    }
                    case "getAllTipoProducto": {
                        getAllTipoProducto(data, session);
                        break;
                    }
                    case "getAllProducto": {
                        getAllProducto(data, session);
                        break;
                    }
                    case "getAllAgregaciones": {
                        getAllAgregaciones(data, session);
                        break;
                    }
                   
                    case "addTipoAgregaciones": {
                        addTipoAgregaciones(data, session);
                        break;
                    }
                    case "getAllTipoAgregaciones": {
                        getAllTipoAgregaciones(data, session);
                        break;
                    }
                    case "getAllVista": {
                        getAllVista(data, session);
                        break;
                    }
                    case "getProductosModelo": {
                        getProductosModelo(data, session);
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

    private void addTipoAgregaciones(JSONObject data, Session session) throws JSONException, SQLException, IOException {
        JSONObject objData = data.getJSONObject("data");
        objData.put("key", UUID.randomUUID());
        Conexion conPg = ConexionPostgres.getInstance();
        String producto = null;
        JSONObject tipoProducto = conPg.ejecutarConsultaObject(""
                + "select row_to_json(agregaciones_tipo.*) as json "
                + "from agregaciones_tipo "
                + "where  agregaciones_tipo.key_sucursal = '" + objData.getString("key_sucursal") + "' "
                + "and agregaciones_tipo.nombre = '" + objData.getString("nombre") + "'");
        if (tipoProducto.isNull("key")) {
            conPg.Transacction();
            try {
                producto = conPg.insertar("agregaciones_tipo", new JSONArray().put(objData));
                conPg.commit();
            } catch (Exception e) {
                conPg.rollback();
            }
            conPg.Transacction_end();
            send(data, session);
            data.put("estado", "exito");
            data.put("error", false);
        } else {
            data.put("estado", "error");
            data.put("error", "existe tipo producto");
        }
        return;
    }

    private void getAllTipoAgregaciones(JSONObject data, Session session) throws SQLException, JSONException {
        Conexion con = ConexionPostgres.getInstance();
        String key_vista = data.getString("key_vista");
        String consulta = "select json_agg(row_to_json(agregaciones_tipos.*)) as json from (\n"
                + "                select agregaciones_tipo.*,( "
                + "                 select json_agg(row_to_json(agregaciones.*)) from agregaciones"
                + "                 where   agregaciones.key_agregaciones_tipo = agregaciones_tipo.key"
                + "                 ) as  agregaciones from agregaciones_tipo  where agregaciones_tipo.key_vista='" + key_vista + "'\n"
                + "			   ) agregaciones_tipos";
        JSONArray arr = con.ejecutarConsultaArray(consulta);
        data.put("data", arr);
        data.put("estado", "exito");
    }

    private void addProducto(JSONObject data, Session session) throws JSONException, SQLException, IOException {
        JSONObject datat = data.getJSONObject("data");
        datat.put("key", UUID.randomUUID());
        datat.put("fecha_on", now());
        Conexion conPg = ConexionPostgres.getInstance();
        String producto = null;
        JSONObject addproducto = conPg.ejecutarConsultaObject(""
                + "select row_to_json(productos.*) as json "
                + "from productos "
                + "where productos.nombre = '" + datat.getString("nombre") + "' and productos.key_tipo_producto='" + datat.getString("key_tipo_producto") +"' ");
        if (addproducto.isNull("key")) {
            conPg.Transacction();
            try {
                producto = conPg.insertar("productos", new JSONArray().put(datat));
                conPg.commit();
            } catch (Exception e) {
                conPg.rollback();
            }
            conPg.Transacction_end();
            send(data, session);
            data.put("estado", "exito");
            data.put("error", false);
        } else {
            data.put("estado", "error");
            data.put("error", "existe tipo producto");
        }
        return;
    }

    private void addTipoProducto(JSONObject data, Session session) throws JSONException, SQLException, IOException {
        data.getJSONObject("data").put("key", UUID.randomUUID());
        JSONObject datat = data.getJSONObject("data");
        Conexion conPg = ConexionPostgres.getInstance();
        String producto = null;
        JSONObject tipoProducto = conPg.ejecutarConsultaObject(""
                + "select row_to_json(producto_tipo.*) as json "
                + "from producto_tipo "
                + "where producto_tipo.nombre = '" + datat.getString("nombre") + "'");
        if (tipoProducto.isNull("key")) {
            conPg.Transacction();
            try {
                producto = conPg.insertar("producto_tipo", new JSONArray().put(datat));
                conPg.commit();
            } catch (Exception e) {
                conPg.rollback();
            }
            conPg.Transacction_end();
            data.put("estado", "exito");
            data.put("error", false);
        } else {
            data.put("estado", "error");
            data.put("error", "existe tipo producto");
        }
        return;
    }


    private void send(JSONObject data, Session session) throws JSONException, JSONException, SQLException {
        JSONObject datat = data;
        datat.put("estado", "actualizar");
        Conexion con = ConexionPostgres.getInstance();
        JSONObject usuario = con.getSessionUser(session.getId());
        if (!usuario.isNull("key")) {
            String consulta = "  select json_agg(row_to_json(session.*)) as json\n"
                    + "                    from session\n"
                    + "                    where  session.fecha_off is null \n"
                    + "					and session.key_usuario is not null \n"
                    + "					and session.key_usuario <> '" + usuario.getString("key") + "'";
            JSONArray sessiones = con.ejecutarConsultaArray(consulta);
            JSONObject _session;
            for (int i = 0; i < sessiones.length(); i++) {
                _session = sessiones.getJSONObject(i);
                try {
                    sessions.users.get(_session.getString("key_usuario")).get(_session.getString("key_socket")).getBasicRemote().sendText(datat.toString());
                } catch (Exception e) {
                    con.apagarSession(_session.getString("key_socket"));
                    sessions.users.get(_session.getString("key_usuario")).remove(_session.getString("key_socket"));
                }
            }
        }

    }

    private void getAllTipoProducto(JSONObject data, Session session) throws SQLException, JSONException {
        Conexion con = ConexionPostgres.getInstance();
        JSONObject objData = data.getJSONObject("data");
        String key_sucursal = objData.getString("key_sucursal");
        String consulta = "select json_agg(row_to_json(producto_tipos.*)) as json from (\n"
                + "                select producto_tipo.*,(\n"
                + "					select json_agg(row_to_json(productos.*)) from productos\n"
                + "					where productos.key_tipo_producto = producto_tipo.key ) as productos\n"
                + "                from producto_tipo\n"
                + "                where producto_tipo.estado = 1 and producto_tipo.key_sucursal='" + key_sucursal + "' )producto_tipos \n";
        JSONArray arr = con.ejecutarConsultaArray(consulta);
        data.put("data", arr);
        data.put("estado", "exito");
    }

    private void getAllProducto(JSONObject data, Session session) throws SQLException, JSONException {
        Conexion con = ConexionPostgres.getInstance();
        JSONObject objData = data.getJSONObject("data");
        String key_sucursal = objData.getString("key_sucursal");
        String consulta = "select json_agg(row_to_json(producto.*)) as json from (\n"
                + "                select productos.*\n"
                + "                from productos\n"
                + "                where productos.estado = 1)producto";
        JSONArray arr = con.ejecutarConsultaArray(consulta);
        data.put("data", arr);
        data.put("estado", "exito");
    }

    private void getAllAgregaciones(JSONObject data, Session session) throws SQLException, JSONException {
        Conexion con = ConexionPostgres.getInstance();

        String consulta = "select json_agg(row_to_json(agregacioness.*)) as json from (\n"
                + "                select agregaciones.*\n"
                + "                from agregaciones\n"
                + "                where agregaciones.estado = 1)agregacioness";
        JSONArray arr = con.ejecutarConsultaArray(consulta);
        data.put("data", arr);
        data.put("estado", "exito");
    }

    private void getProductosModelo(JSONObject data, Session session) throws JSONException, SQLException {
        JSONObject objData = data.getJSONObject("data");
        String key_vista = objData.getString("key_vista");
        Conexion con = ConexionPostgres.getInstance();
        String consulta = "select json_agg(row_to_json(modelos.*)) as json from (\n"
                + "		select tipo_producto.key,tipo_producto.nombre,tipo_producto.key_tipo_vista, (\n"
                + "			select json_agg(row_to_json(productos.*)) as productos from productos\n"
                + "			where productos.key_tipo_producto=tipo_producto.key\n"
                + "		) from tipo_producto\n"
                + "	where tipo_producto.key_tipo_vista='" + key_vista + "'\n"
                + ") modelos";
        JSONArray arr = con.ejecutarConsultaArray(consulta);
        data.put("data", arr);
        data.put("estado", "exito");
    }

    private void getAllVista(JSONObject data, Session session) throws SQLException, JSONException {
        Conexion con = ConexionPostgres.getInstance();
        String consulta = "select json_agg(row_to_json(vista.*)) as json from (\n"
                + "                select producto_tipo_vista.*\n"
                + "                from producto_tipo_vista\n"
                + "                where producto_tipo_vista.estado = 1)vista";
        JSONArray arr = con.ejecutarConsultaArray(consulta);
        data.put("data", arr);
        data.put("estado", "exito");
    }
}
