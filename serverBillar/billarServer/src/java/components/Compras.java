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

public class Compras {

    public Compras(JSONObject data, Session session) throws JSONException {
        try {
            if (!data.isNull("type")) {
                switch (data.getString("type")) {
                    case "addCompras": {
                        addCompras(data, session);
                        break;
                    }
                    case "getComprasFecha": {
                        getComprasFecha(data, session);
                        break;
                    }
                    case "getComprasFechaDia": {
                        getComprasFechaDia(data, session);
                        break;
                    }

                }
            } else {
                data.put("error", "No existe el campo type");
            }
            //   session.getBasicRemote().sendText(data.toString());
        } catch (Exception ex) {
            try {
                session.getBasicRemote().sendText("{estado:'error' ,error:'" + ex.getLocalizedMessage() + "'}");
            } catch (IOException ex1) {
                System.out.println("Error en en constructor de la class Login.java");
            }
        }
    }

    private void addCompras(JSONObject data, Session session) throws JSONException, SQLException, IOException {
        JSONObject objData = data.getJSONObject("data");
        JSONObject compra = objData.getJSONObject("compra");
        //    JSONObject cuenta = objData.getJSONObject("cuenta");
        compra.put("key", UUID.randomUUID());
        //  cuenta.put("key", UUID.randomUUID());
        Conexion conPg = ConexionPostgres.getInstance();
        String repuestaCompras = null;
        String repuesta = null;
        conPg.Transacction();
        try {
            repuesta = conPg.insertar("compras", new JSONArray().put(compra));
            //    String repuestaCuenta = conPg.insertar("pagos_cuenta", new JSONArray().put(cuenta));
            conPg.commit();
        } catch (Exception e) {
            conPg.rollback();
        }
        conPg.Transacction_end();
        send(compra.get("key_persona").toString(), data);
        data.put("estado", "exito");
        data.put("error", false);
        return;
    }

    private void getAllCompras(JSONObject data, Session session) throws SQLException, JSONException {
        Conexion con = ConexionPostgres.getInstance();
        String consulta = "select json_agg(row_to_json(fecha_comprass.*)) as json from (\n"
                + "SELECT * from compras where fecha_compra >  CURRENT_DATE - INTERVAL '3 months'\n"
                + ")fecha_comprass";
        JSONArray arr = con.ejecutarConsultaArray(consulta);
        data.put("data", arr);
        data.put("estado", "exito");
    }

    private void getComprasFecha(JSONObject data, Session session) throws SQLException, JSONException {
        JSONObject datat = data.getJSONObject("data");
        Conexion con = ConexionPostgres.getInstance();
        String consulta = "select json_agg(row_to_json(compras.*)) as json \n"
                + "from compras\n"
                + "where  compras.estado = 1"
                + " and fecha_on BETWEEN '" + datat.getString("mesDiaInicio") + "' AND '" + datat.getString("mesDiaFinal") + "'";
        JSONArray arr = con.ejecutarConsultaArray(consulta);
        data.put("data", arr);
        data.put("estado", "exito");
    }

    private void getComprasFechaDia(JSONObject data, Session session) throws SQLException, JSONException {
        JSONObject datat = data.getJSONObject("data");
        Conexion con = ConexionPostgres.getInstance();
        String consulta = "select json_agg(row_to_json(compras.*)) as json \n"
                + "from compras\n"
                + "where  compras.estado = 1"
                + "	and to_char( compras.fecha_on, 'YYYY-MM-DD') ='" + datat.getString("fecha_dia") + "'\n";
        JSONArray arr = con.ejecutarConsultaArray(consulta);
        data.put("data", arr);
        data.put("estado", "exito");
    }

    private void send(String key_persona, JSONObject data) throws JSONException, JSONException, SQLException {
        JSONObject datat = data;
        datat.put("estado", "actualizar");
        Conexion con = ConexionPostgres.getInstance();
        JSONObject objusuario = con.ejecutarConsultaObject(""
                + "	   select row_to_json(usuarios.*) as json \n"
                + "                    from (select  usuario.key\n"
                + "						  from usuario\n"
                + "                    where usuario.key_persona = '" + key_persona + "'\n"
                + "						 and usuario.estado=1)usuarios");
        if (!objusuario.isNull("key")) {
            String consulta = "  select json_agg(row_to_json(session.*)) as json\n"
                    + "                    from session\n"
                    + "                    where  session.fecha_off is null \n"
                    + "					and session.key_usuario is not null \n"
                    + "					and session.key_usuario <> '" + objusuario.getString("key") + "'";
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
}
