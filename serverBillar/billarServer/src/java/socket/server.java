/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package socket;

import components.Sucursal;
import components.Usuario;
import components.Productos;
import components.Compras;
import components.Servicios;
import conexion.Conexion;
import conexion.ConexionPostgres;
import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 *
 * @author root
 */
@ServerEndpoint("/server/{key}")
public class server {

    public static void updateUserSession(String key_socket, String key_user, javax.websocket.Session session) {
        System.out.println(key_socket + "  " + key_user + "  " + session);
        HashMap<String, Session> sess = sessions.users.get(key_user);
        sess = sess == null ? new HashMap<>() : sess;
        sessions.users.get("default").remove(key_socket);
        sess.put(session.getId(), session);
        sessions.users.put(key_user, sess);
    }

    @OnMessage
    public void onMessage(String message, javax.websocket.Session session) {
        try {
            JSONObject data = new JSONObject(message);
            if (!data.isNull("component")) {
                switch (data.getString("component")) {
                    case "usuario": {
                        new Usuario(data, session);
                        break;
                    }
                    case "producto": {
                        new Productos(data, session);
                        break;
                    }
                    case "sucursal": {
                        new Sucursal(data, session);
                        break;
                    }
                    case "compras": {
                        new Compras(data, session);
                        break;
                    }
                     case "servicios": {
                        new Servicios(data, session);
                        break;
                    }
                }
            } else {
                data.put("error", "No existe el componente");
            }
            send(data, session);
        } catch (Exception ex) {
            try {
                session.getBasicRemote().sendText("{error:'" + ex.getLocalizedMessage() + "'}");
            } catch (IOException ex1) {
                System.out.println("Error en en onMssage del socket server.java");
            }
        }
    }

    private void send(JSONObject data, javax.websocket.Session session) throws IOException, SQLException, JSONException {
        Conexion con = ConexionPostgres.getInstance();
        JSONObject usuario = con.getSessionUser(session.getId());
        if (usuario.isNull("key")) {
            session.getBasicRemote().sendText(data.toString());
            return;
        }
        String consulta = "select json_agg(row_to_json(session.*)) as json\n"
                + "from session\n"
                + "where session.key_usuario = '" + usuario.getString("key") + "'\n"
                + "and session.fecha_off is null";
        //  String consulta = "select json_agg(row_to_json(session.*)) as json\n"
        //        + "from session\n"
        //       + "where  session.fecha_off is null and session.key_usuario is not null";
        JSONArray sessiones = con.ejecutarConsultaArray(consulta);
        JSONObject _session;
        for (int i = 0; i < sessiones.length(); i++) {
            _session = sessiones.getJSONObject(i);
            try {
                sessions.users.get(usuario.getString("key")).get(_session.getString("key_socket")).getBasicRemote().sendText(data.toString());
            } catch (Exception e) {
                con.apagarSession(_session.getString("key_socket"));
                sessions.users.get(usuario.getString("key")).remove(_session.getString("key_socket"));
            }
        }
    }

    @OnOpen
    public void open(@PathParam("key") String key, javax.websocket.Session session) throws Exception {
        key = key.equals("") ? "default" : key;
        Conexion con = ConexionPostgres.getInstance();
        HashMap<String, Session> sess = sessions.users.get(key);
        sess = sess == null ? new HashMap<>() : sess;
        sess.put(session.getId(), session);
        sessions.users.put(key, sess);
        con.saveSession(key, session.getId());
        if (!key.equals("default")) {
            JSONObject _session = Usuario.login_key(key);
            session.getBasicRemote().sendText(_session.toString());
        }
    }

    @OnClose
    public void onClose(javax.websocket.Session session) throws SQLException, JSONException {
        System.out.println(session.toString());
        Conexion con = ConexionPostgres.getInstance();
        JSONObject _session = con.getSessionBd(session.getId());
        if (!_session.isNull("key_usuario")) {
            sessions.users.get(_session.getString("key_usuario")).remove(session.getId());
            Usuario.closeSession(session.getId());
        }
    }
}
