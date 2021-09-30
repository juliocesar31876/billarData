/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package images;

import components.Notificacion;
import conexion.Conexion;
import conexion.ConexionPostgres;
import java.io.IOException;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import org.apache.commons.io.FilenameUtils;
import org.json.JSONException;
import org.json.JSONObject;
import utils.EVENTOS;

@MultipartConfig
@WebServlet(name = "imagesController", urlPatterns = {"/imagesController"})
public class imagesController extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        try {
            response.addHeader("Access-Control-Allow-Origin", "*");
            request.setCharacterEncoding("UTF-8");
            response.setCharacterEncoding("UTF-8");
            response.setContentType("text/plain");

            String evento = request.getParameter("type");
            boolean retornar = true;
            String html = "";
            switch (evento) {
                case "subirFoto":
                    html = subirFoto(request);
                    break;
                case "subirFotoProducto":
                    html = subirFotoProducto(request);
                    break;
                case "subirFotoPersona":
                    html = subirFotoPersona(request);
                    break;
            }
            if (retornar) {
                response.getWriter().write(html);
            }
        } catch (Exception ex) {
            Logger.getLogger(imagesController.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

    private String subirFoto(HttpServletRequest request) throws IOException, ServletException, SQLException, JSONException {
        String key = request.getParameter("nombre");
  //      String key_usuario = request.getParameter("key_usuario");
        String tipo = request.getParameter("tipo");
        //  Conexion con = ConexionPostgres.getInstance();
        //    JSONObject usuario = con.getUsuario(key_usuario);
        // if (!usuario.isNull("key")) {
        Part file = request.getPart("archibo");
        String names = "Not file";
        if (file != null) {
            names = file.getSubmittedFileName();
            String ext = FilenameUtils.getExtension(names);
            String path = "";
            switch (tipo) {
                  case "producto":
                    path = tipo;
                    break;
                case "persona":
                    path = tipo;
                    break;
                case "promocion":
                    path = tipo;
                    break;
            }
            names = EVENTOS.guardar_file(file, path, key + "." + ext);
        }
        // JSONObject obj = new JSONObject();
        //        obj.put("component", "foto");
        //      obj.put("type", "cambio");
        //   obj.put("foto", names);
        //    switch (tipo) {
        //     case "usuario":
        //        Notificacion.sendConocidos(key, obj);
        //       break;
        //  case "grupo":
        //     Notificacion.sendToGroup(key, obj);
        //    break;
        // }
        //  }
        return "exito";
    }

    private String subirFotoProducto(HttpServletRequest request) throws IOException, ServletException, SQLException, JSONException {
        String nombre = request.getParameter("nombre");
        String tipo = request.getParameter("tipo");
        Part file = request.getPart("archibo");
        String names = "Not file";
        if (file != null) {
            names = file.getSubmittedFileName();
            String ext = FilenameUtils.getExtension(names);
            String path = "";
            path = tipo;
            names = EVENTOS.guardar_file(file, path, nombre + "." + ext);
        }
        return "exito";
    }

    private String subirFotoPersona(HttpServletRequest request) throws IOException, ServletException, SQLException, JSONException {
        String nombre = request.getParameter("nombre");
        String tipo = request.getParameter("tipo");
        Part file = request.getPart("archibo");
        String names = "Not file";
        if (file != null) {
            names = file.getSubmittedFileName();
            String ext = FilenameUtils.getExtension(names);
            String path = "";
            path = tipo;
            names = EVENTOS.guardar_file(file, path, nombre + "." + ext);
        }
        return "exito";
    }
}
