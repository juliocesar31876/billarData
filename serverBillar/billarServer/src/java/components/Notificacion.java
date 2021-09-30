package components;

import conexion.Conexion;
import conexion.ConexionPostgres;
import java.io.IOException;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.UUID;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.websocket.Session;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import socket.sessions;
public class Notificacion {
    public Notificacion(JSONObject data, Session session) {
        try {
            if (!data.isNull("type")) {
                switch (data.getString("type")) {
                  
                     case "getAllNotificacion": {
                        getAllNotificacion(data, session);
                        break;
                    }
                }
            } else {
                data.put("error", "No existe el campo type");
            }
        } catch (Exception ex) {
            try {
                session.getBasicRemote().sendText("{estado:'error' ,error:'" + ex.getLocalizedMessage() + "'}");
            } catch (IOException ex1) {
                System.out.println("Error en en constructor de la class Login.java");
            }
        }
    }
    private void getAllNotificacion(JSONObject data, Session session) throws SQLException, JSONException {
        Conexion con = ConexionPostgres.getInstance();
        JSONObject usuario = con.getSessionUser(session.getId());
        
        String consulta = "SELECT row_to_json(tabla.*) as json\n" +
                            "from(\n" +
                            "select tabla.json as notificaciones, cantidad.cant as cantidad\n" +
                            "from (\n" +
                            "    select json_agg(row_to_json(tabla.*)) as json\n" +
                            "    from (\n" +
                            "    select notificacion.*,persona.nombres, persona.apellidos\n" +
                            "    from notificacion, usuario, persona\n" +
                            "    where notificacion.key_usuario = '" + usuario.getString("key") + "'\n" +
                            "    and notificacion.key_usuario_from = usuario.key\n" +
                            "    and usuario.key_persona = persona.key\n" +
                            "    order by notificacion.fecha desc limit 20\n" +
                            "    ) tabla\n" +
                            ") tabla ,\n" +
                            "(\n" +
                            "    select count(*) as cant\n" +
                            "    from notificacion\n" +
                            "    where key_usuario = '" + usuario.getString("key") + "'\n" +
                            "    and estado = 1\n" +
                            ") cantidad\n" +
                            ") as tabla\n";
        JSONObject obj = con.ejecutarConsultaObject(consulta);
        data.put("data",obj);
        data.put("estado", "exito");
    }
   
}
