package components;

import conexion.Conexion;
import conexion.ConexionPostgres;
import java.io.IOException;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.UUID;
import javax.websocket.Session;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import socket.server;
import utils.utils;

public class Usuario {

    public Usuario(JSONObject data, Session session) throws JSONException {
        try {
            if (!data.isNull("type")) {
                switch (data.getString("type")) {
                    case "login": {
                        login(data, session);
                        break;
                    }
                    case "logout": {
                        logout(data, session);
                        break;
                    }
                    case "registroCliente": {
                        registroCliente(data, session);
                        break;
                    }
                    case "registroFacebook": {
                        registroFacebook(data, session);
                        break;
                    }
                    case "actualizar": {
                        actualizar(data, session);
                        break;
                    }
                    case "editarPerfil": {
                        editarPerfil(data, session);
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


    public static void login(JSONObject data, Session session) throws JSONException, IOException, SQLException {
        JSONObject newdata = data.getJSONObject("data");
        if (!newdata.isNull("user")) {
            if (!newdata.isNull("pass")) {
                String pass = utils.toSha256(newdata.getString("pass"));
                newdata.put("pass", pass);
                Conexion conPg = ConexionPostgres.getInstance();
                //String funct = "select login(?,?)";
                String consulta = "select  row_to_json(u.*) as login\n"
                        + "                from  usuario u\n"
                        + "                where  u.user = ? and u.pass=?";
                PreparedStatement ps = conPg.statamet(consulta);
                ps.setString(1, newdata.getString("user"));
                ps.setString(2, pass);
                ResultSet rs = ps.executeQuery();
                if (rs.next()) {
                    String resp = rs.getString("login");
                    if (resp == null) {
                        data.put("estado", "error");
                        data.put("error", "Error en la informacion del usuario.");
                    } else {
                        JSONObject _session = new JSONObject("{usuario:" + resp + "}");
                        _session.getJSONObject("usuario").remove("pass");
                        JSONObject persona = conPg.ejecutarConsultaObject("select row_to_json(persona.*) as json\n"
                                + "from persona where persona.key = '" + _session.getJSONObject("usuario").getString("key_persona") + "'");
                        _session.getJSONObject("usuario").put("persona", persona);
                        data.remove("data");
                        data.put("data", _session.getJSONObject("usuario"));
                        data.put("estado", "exito");
                        updateSession(session.getId(), _session.getJSONObject("usuario").getString("key"));
                        server.updateUserSession(session.getId(), _session.getJSONObject("usuario").getString("key"), session);
                    }
                } else {
                    data.put("estado", "error");
                    data.put("error", "Error en la informacion del usuario.");
                }

                ps.close();
                rs.close();
            } else {
                data.put("estado", "error");
                data.put("error", "Ingrese la contraseña");
            }
        } else {
            data.put("estado", "error");
            data.put("error", "Ingrese el usuario");
        }
//        session.getBasicRemote().sendText(data.toString());
    }

    public static JSONObject login_key(String key) throws JSONException, IOException, SQLException {
        JSONObject data = new JSONObject();
        Conexion conPg = ConexionPostgres.getInstance();
        //    String funct = "select login_key(?) as login";
        String funct = "select  row_to_json(u.*) as login\n"
                + "                from  usuario u\n"
                + "                where  u.key = ?";
        PreparedStatement ps = conPg.statamet(funct);
        ps.setString(1, key);
        ResultSet rs = ps.executeQuery();

        if (rs.next()) {
            String resp = rs.getString("login");
            if (resp == null) {

                data.put("component", "usuario");
                data.put("type", "login");
                data.put("estado", "error");
                data.put("usuario", false);
            } else {
                JSONObject _session = new JSONObject("{usuario:" + resp + "}");
                data.put("component", "usuario");
                data.put("type", "login");
                data.put("estado", "exito");
/////VERIFICAION SI NO EXITE EN PERSONA VERIFICA SI EXISTE EN EL CLIENTE 
                JSONObject persona = conPg.ejecutarConsultaObject("select row_to_json(persona.*) as json\n"
                        + "from persona where persona.key = '" + _session.getJSONObject("usuario").getString("key_persona") + "'");
                _session.getJSONObject("usuario").put("persona", persona);
                data.put("usuario", _session.getJSONObject("usuario"));
            }
        }

        ps.close();
        rs.close();
        return data;
    }

    private void logout(JSONObject data, Session session) throws IOException {
        session.getBasicRemote().sendText(data.toString());
    }

    private void registroFacebook(JSONObject data, Session session) throws JSONException, SQLException, IOException {
        JSONArray arr = new JSONArray();
        JSONObject objUsuario = new JSONObject();
        JSONObject objData = data.getJSONObject("data");
        JSONObject objCliente = objData.getJSONObject("persona");
        String key_facebook = objData.getString("key_facebook");
        JSONObject is_user = ConexionPostgres.getInstance().ejecutarConsultaObject(""
                + "select row_to_json(usuario.*) as json "
                + "from usuario "
                + "where usuario.key_facebook= '" + key_facebook + "'");
        if (is_user.isNull("key")) {
            objCliente.put("key", UUID.randomUUID());
            objCliente.put("estado", 1);
            arr.put(objData);
            Conexion conPg = ConexionPostgres.getInstance();
            conPg.Transacction();
            try {
                String keypersona = conPg.insertar("cliente", new JSONArray().put(objCliente));
                objUsuario.put("key_persona", keypersona);
                objUsuario.put("key", UUID.randomUUID());
                objUsuario.put("key_facebook", key_facebook);
                String key = conPg.insertar("usuario", new JSONArray().put(objUsuario));
                conPg.commit();
            } catch (Exception e) {
                conPg.rollback();
            }
            conPg.Transacction_end();
            JSONObject usuario = new JSONObject("{usuario:" + objUsuario + "}");
            usuario.getJSONObject("usuario").put("persona", objCliente);
            updateSession(session.getId(), usuario.getJSONObject("usuario").getString("key"));
            server.updateUserSession(session.getId(), usuario.getJSONObject("usuario").getString("key"), session);
            data.put("estado", "exito");
            data.put("data", usuario.getJSONObject("usuario"));
            data.put("error", false);
            return;
        } else {
            data.put("estado", "error");
            data.put("error", "existe_usuario");
        }
    }

    private void registroCliente(JSONObject data, Session session) throws JSONException, SQLException, IOException {

        JSONArray arr = new JSONArray();
        JSONObject datat = data.getJSONObject("data");
        JSONObject usuario = datat.getJSONObject("usuario");
        JSONObject cliente = datat.getJSONObject("cliente");

        JSONObject is_user = ConexionPostgres.getInstance().ejecutarConsultaObject(""
                + "select row_to_json(usuario.*) as json "
                + "from usuario "
                + "where usuario.user = '" + usuario.getString("user") + "'");
        if (is_user.isNull("key")) {
            cliente.put("key", UUID.randomUUID());
            arr.put(datat);
            Conexion conPg = ConexionPostgres.getInstance();
            conPg.Transacction();
            try {
                String keypersona = conPg.insertar("cliente", new JSONArray().put(cliente));
                usuario.put("key_persona", keypersona);
                usuario.put("key", UUID.randomUUID());
                String sha2 = utils.toSha256(usuario.getString("pass"));
                usuario.put("pass", sha2);
                String key = conPg.insertar("usuario", new JSONArray().put(usuario));
                conPg.commit();
            } catch (Exception e) {
                conPg.rollback();
            }
            conPg.Transacction_end();
            data.remove("data");
            usuario.put("persona", cliente);
            JSONObject _session = new JSONObject("{usuario:" + usuario + "}");
            data.put("usuario", _session);
            data.put("estado", "exito");
            data.put("error", false);
            return;
        } else {
            data.put("estado", "error");
            data.put("error", "existe usuario");
        }
    }

    public static int updateSession(String key_socket, String key_usuario) throws SQLException {
        String consulta = "UPDATE session\n"
                + "	SET key_usuario=?\n"
                + "	WHERE key_socket= ?";
        Conexion con = ConexionPostgres.getInstance();
        PreparedStatement ps = con.statamet(consulta);
        ps.setString(1, key_usuario);
        ps.setString(2, key_socket);
        int row = ps.executeUpdate();
        ps.close();

        return row;
    }

    public static int closeSession(String key_socket) throws SQLException {
        String consulta = "UPDATE session\n"
                + "	SET fecha_off=now()\n"
                + "	WHERE key_socket = ?";
        Conexion con = ConexionPostgres.getInstance();
        PreparedStatement ps = con.statamet(consulta);

        ps.setString(1, key_socket);
        int row = ps.executeUpdate();
        ps.close();
        return row;
    }

    private void actualizar(JSONObject data, Session session) throws JSONException, SQLException {
        Conexion con = ConexionPostgres.getInstance();
        JSONArray arr = new JSONArray();
        JSONObject datat = data.getJSONObject("data");

        JSONObject is_user = ConexionPostgres.getInstance().ejecutarConsultaObject(""
                + "select row_to_json(usuario.*) as json "
                + "from usuario "
                + "where usuario.user = '" + datat.getString("user") + "'");
        con.update("usuario", new JSONArray().put(is_user));
        if (is_user.isNull("key")) {
            datat.put("key", UUID.randomUUID());
            datat.put("estado", 1);
            arr.put(datat);
            Conexion conPg = ConexionPostgres.getInstance();

            String keypersona = conPg.insertar("persona", new JSONArray().put(datat));

            datat.put("key_persona", keypersona);
            datat.put("key", UUID.randomUUID());
            String sha2 = utils.toSha256(datat.getString("pass"));
            datat.put("pass", sha2);

            String key = conPg.insertar("usuario", new JSONArray().put(datat));

            data.put("estado", "exito");

        } else {
            data.put("estado", "error");
            data.put("error", "existe_usuario");
        }

    }

    private void editarPerfil(JSONObject data, Session session) throws JSONException, SQLException {
        Conexion con = ConexionPostgres.getInstance();
        JSONObject datat = data.getJSONObject("data");
        String tabla = datat.getString("tabla");
        String setcolumna = datat.getString("columna");
        String setvalue = datat.getString("value");
        String wColumna = datat.getString("wcolumna");
        String wValue = datat.getString("wvalue");
        String Consulta = "UPDATE public." + tabla
                + "	SET " + "\"" + (setcolumna) + "\"" + " = " + setvalue + " \n"
                + "	WHERE " + wColumna + " = " + wValue + ";";
        boolean re = con.updateData(Consulta);

        data.put("estado", "exito");
    }

}
