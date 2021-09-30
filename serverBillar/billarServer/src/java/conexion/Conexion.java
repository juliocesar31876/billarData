package conexion;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Savepoint;
import java.sql.Statement;
import static java.time.Instant.now;
import java.util.UUID;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class Conexion {
//    public static Connection con;  //POR QUE LA CONEXION INCIA OTRA INSTANCIA EN LA BASE DE DATOS
//    public static boolean loggedIn = false;

    public Connection con;
    public boolean loggedIn = false;
    private Conexion ConexionConectada = null;
    protected ResultSet rs;
    private String usr, pass, baseDatos, puerto, ip;

    public Conexion() throws SQLException {
        if (ConexionConectada == null) {
            loggedIn = false;
            this.usr = "postgres";
            this.pass = "kratos760";
            this.pass = "postgres";
            //this.baseDatos = "antojitos";
            this.baseDatos = "billar";
            //this.ip = "185.70.197.117";
            this.ip = "192.168.0.34";
            this.puerto = "5432";
            Conectar();
        } else {
            con = ConexionConectada.getConnection();
        }
    }

    public boolean verifyConection() {
        try {
            System.out.println("VERIFICANDO LA CONEXION A POSTGRES");
            boolean isValid = con.isClosed();
            return true;
        } catch (SQLException ex) {
            Logger.getLogger(Conexion.class.getName()).log(Level.SEVERE, null, ex);
            return false;
        }
    }

    public PreparedStatement statamet(String sql) {
        try {
            return con.prepareStatement(sql);
        } catch (SQLException ex) {
            Logger.getLogger(Conexion.class.getName()).log(Level.SEVERE, null, ex);
            return null;
        }
    }

    public CallableStatement callable_statamet(String sql) {
        try {
            return con.prepareCall(sql);
        } catch (SQLException ex) {
            Logger.getLogger(Conexion.class.getName()).log(Level.SEVERE, null, ex);
            return null;
        }
    }

    public boolean ifConnected() {
        try {
//            System.out.println(con.isClosed());
            if (loggedIn == true && !con.isClosed()) {
//              con = Conexion.getDatabaseConnection().getConnection();
                return true;
            } else {
                System.out.println("CONECCION A LA BASE DE DATOS PERDIDA, RECONECTANDO");
                return false;
            }
        } catch (Exception e) {

            return false;
        }

    }

    public Savepoint SavePoint() {
        try {
            return con.setSavepoint();
        } catch (SQLException ex) {
            Logger.getLogger(Conexion.class.getName()).log(Level.SEVERE, null, ex);
            return null;
        }
    }

    public Connection getConnection() {
        return con;
    }

    public void Transacction() {

        try {
            if (con.getAutoCommit()) {
                con.setAutoCommit(false);
            }
        } catch (SQLException ex) {
            Logger.getLogger(Conexion.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public void Transacction_end() {
        try {
            if (!con.getAutoCommit()) {
                con.setAutoCommit(true);
            }
        } catch (SQLException ex) {
            Logger.getLogger(Conexion.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public void commit() {
        try {
            con.commit();
        } catch (SQLException ex) {
            // Logger.getLogger(Conexion.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public void rollback() {
        try {
            con.rollback();
        } catch (SQLException ex) {
            // Logger.getLogger(Conexion.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public void rollback(Savepoint savepoint) {
        try {
            con.rollback(savepoint);
        } catch (SQLException ex) {
            Logger.getLogger(Conexion.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public void EjecutarSentencia(String sentencia) throws SQLException {
        //ifConnected();         
        PreparedStatement ps = con.prepareStatement(sentencia);
        ps.execute();
        ps.close();
    }

    public void EjecutarDDL(String sentencia) throws SQLException {
        Statement ps;
        ps = con.createStatement();
        ps.execute(sentencia);
        ps.close();
    }

    public void EjecutarUpdate(String sentencia) throws ClassNotFoundException, IllegalAccessException, InstantiationException, SQLException {
        ifConnected();
        PreparedStatement ps = con.prepareStatement(sentencia);
        ps.executeUpdate();
        ps.close();
    }

    public void Close() {
        if (loggedIn) {
            try {
                con.close();
                loggedIn = false;
            } catch (SQLException ex) {
                loggedIn = false;
            }
        }
    }

    public void Conectar() throws SQLException {
        try {
            Class.forName("org.postgresql.Driver");
            Login();
        } catch (Exception e) {

        }
    }

    private void Login() {
        try {
            con = DriverManager.getConnection("jdbc:postgresql://" + ip + ":" + puerto + "/" + baseDatos, usr, pass);
            loggedIn = true;
            ConexionConectada = this;

        } catch (SQLException ex) {
            Logger.getLogger(Conexion.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public boolean isLoggedIn() {
        return loggedIn;
    }

    public void setLoggedIn(boolean loggedIn) {
        this.loggedIn = loggedIn;
    }

    public ResultSet getRs() {
        return rs;
    }

    public void setRs(ResultSet rs) {
        this.rs = rs;
    }

    public String getUsr() {
        return usr;
    }

    public void setUsr(String usr) {
        this.usr = usr;
    }

    public String getBaseDatos() {
        return baseDatos;
    }

    public void setBaseDatos(String baseDatos) {
        this.baseDatos = baseDatos;
    }

    public String getPuerto() {
        return puerto;
    }

    public void setPuerto(String puerto) {
        this.puerto = puerto;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public String insertar(String nombre_tabla, JSONArray jsona) throws JSONException, SQLException {
        String funct = "insert into " + nombre_tabla + " (select * from json_populate_recordset(null::" + nombre_tabla + ", '" + jsona.toString() + "')) RETURNING key";
        PreparedStatement ps = statamet(funct);
        ResultSet rs = ps.executeQuery();
        String key = "";
        if (rs.next()) {
            key = rs.getString("key");
        }
        rs.close();
        ps.close();
        return key;
    }

    public JSONObject ejecutarConsultaObject(String consulta) throws SQLException, JSONException {
        PreparedStatement ps = statamet(consulta);
        ResultSet rs = ps.executeQuery();
        JSONObject obj = new JSONObject();
        if (rs.next()) {
            obj = rs.getString("json") != null ? new JSONObject(rs.getString("json")) : new JSONObject();
        }
        rs.close();
        ps.close();
        return obj;
    }

    public String ejecutarConsultaString(String consulta) throws SQLException, JSONException {
        PreparedStatement ps = statamet(consulta);
        ResultSet rs = ps.executeQuery();
        String obj = "[]";
        if (rs.next()) {
            obj = rs.getString("json") != null ? rs.getString("json") : "[]";
        }
        rs.close();
        ps.close();
        return obj;
    }

    public void apagarSession(String key_socket) throws SQLException {
        String consulta = "update session set fecha_off = now() where key_socket = '" + key_socket + "'";
        EjecutarSentencia(consulta);
    }

    public JSONArray ejecutarConsultaArray(String consulta) throws SQLException, JSONException {
        PreparedStatement ps = statamet(consulta);
        ResultSet rs = ps.executeQuery();
        JSONArray arr = new JSONArray();
        if (rs.next()) {
            arr = rs.getString("json") == null ? new JSONArray() : new JSONArray(rs.getString("json"));
        }
        rs.close();
        ps.close();
        return arr;
    }

    public boolean saveSession(String user_key, String key_socket) throws JSONException, SQLException {
        JSONObject ses = new JSONObject();
        ses.put("key", UUID.randomUUID());
        if (!user_key.equals("default")) {
            ses.put("key_usuario", user_key);
        }
        ses.put("key_socket", key_socket);
        ses.put("estado", 1);
        ses.put("fecha_on", now());
        insertar("session", new JSONArray().put(ses));
        return true;
    }

    public JSONObject getUsuario(String key) throws SQLException, JSONException {
        String consulta = "SELECT row_to_json(usuario.*) as json\n"
                + "from usuario\n"
                + "where usuario.key = '" + key + "'\n"
                + "and usuario.estado = 1";
        return ejecutarConsultaObject(consulta);
    }

    public JSONObject getPersona(String key) throws SQLException, JSONException {
        String consulta = "SELECT row_to_json(persona.*) as json\n"
                + "from usuario, persona\n"
                + "where usuario.key = '" + key + "'\n"
                + "and persona.key = usuario.key_persona\n"
                + "";
        return ejecutarConsultaObject(consulta);
    }

    public JSONObject getSessionBd(String key_socket) throws SQLException, JSONException {
        String consulta = "select row_to_json(session.*) as json\n"
                + "from session\n"
                + "where session.key_socket='" + key_socket + "'";
        return ejecutarConsultaObject(consulta);
    }

    public JSONObject getSessionUser(String key_socket) throws SQLException, JSONException {
        String consulta = "select row_to_json(t.*) as json from (\n"
                + "select usuario.*\n"
                + "from session, usuario\n"
                + "where session.key_socket='" + key_socket + "' and session.key_usuario = usuario.key) t";
        return ejecutarConsultaObject(consulta);
    }
//    public JSONObject getSessionUser(String session_id, String razon_social) throws SQLException, JSONException{
//        String consulta = "select row_to_json(t.*) as json from (\n"
//                + "select usuario.*\n"
//                + "from strasol.sessiones,\n"
//                + "strasol.usuario,\n"
//                + "strasol.empresa,\n"
//                + "strasol.empresa_usuario\n"
//                + "where sessiones.session_id='"+session_id+"'\n"
//                + "and sessiones.user_key = usuario.key\n"
//                + "and empresa_usuario.id_usuario = usuario.id\n"
//                + "and empresa_usuario.id_empresa= empresa.id\n"
//                + "and empresa.razon_social = '"+razon_social+"'\n"
//                + ") t";
//        return ejecutarConsultaObject(consulta);
//    } 

    public String getNombrePersona(JSONObject persona) throws JSONException {
        String nombre = persona.isNull("nombres") ? " " : persona.getString("nombres") + " ";
        nombre += persona.isNull("apellidos") ? "" : persona.getString("apellidos");
        nombre = nombre.length() > 1 ? nombre : "Desconocido";
        return nombre;
    }

    public String update(String nombre_tabla, JSONArray json) throws SQLException, JSONException {
        String funct = "select actualizar('" + nombre_tabla + "', '" + json.toString() + "') as json";
        PreparedStatement ps = statamet(funct);
        ResultSet rs = ps.executeQuery();
        String key = "";
        if (rs.next()) {
            key = rs.getString("json");
        }
        rs.close();
        ps.close();
        return key;
    }

    public boolean updateData(String consulta) throws SQLException, JSONException {
        PreparedStatement ps = statamet(consulta);
        boolean rs = ps.execute();
        ps.close();
        return rs;
    }
}
