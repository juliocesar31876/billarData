/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package conexion;

import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author ricardopazdemiquel
 */
public class ConexionPostgres {
    
    private static Conexion conexion;

    
    public static Conexion getInstance(){
        if(conexion==null){
            try {
                conexion= new Conexion();
            } catch (SQLException ex) {
                Logger.getLogger(ConexionPostgres.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        
          if(!conexion.ifConnected()){
            try {
                conexion.Conectar();
            } catch (SQLException ex) {
//                Logger.getLogger(SngleCon.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        return conexion;
    }
    
    
}
