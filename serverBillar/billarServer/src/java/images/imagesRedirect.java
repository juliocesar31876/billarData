/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package images;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/images/*")
public class imagesRedirect extends HttpServlet {

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
        String imgName = request.getPathInfo().substring(1);
        String tipo = request.getParameter("tipo");

        File file = null;
        switch (tipo) {
            case "usuario":
                file = validarUsuario(file, imgName);
                break;
            case "producto":
                file = validarProducto(file, imgName, tipo);
                break;
            case "promocion":
                file = validarProducto(file, imgName, tipo);
                break;
        }

        response.setHeader("Content-Type", getServletContext().getMimeType(imgName));
        response.setHeader("Content-Length", String.valueOf(file.length()));
        response.setHeader("Content-Disposition", "inline; filename=\"" + imgName + "\"");
        Files.copy(file.toPath(), response.getOutputStream());
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

    private File validarProducto(File file, String imgName, String tipo) {
        if (imgName.equals("null.png")) {
            imgName = "default.png";
        }
        file = new File(Props.url + "billar/" + tipo + "/", imgName);
        if (!file.exists()) {
//            imgName = "user_desconocido.png";
            imgName = "";
            file = new File(Props.url + "billar/" + tipo + "/", imgName);
        }
        return file;
    }

    private File validarUsuario(File file, String imgName) {
        if (imgName.equals("null.png")) {
            imgName = "default.png";
        }
        file = new File(Props.url + "billar/perfil_usuario/", imgName);
        if (!file.exists()) {
//            imgName = "user_desconocido.png";
            imgName = "";
            file = new File(Props.url + "billar/perfil_usuario/", imgName);
        }
        return file;
    }

    private File validarPersona(File file, String imgName) {
        if (imgName.equals("null.png")) {
            imgName = "";
        }
        file = new File(Props.url + "billar/persona/", imgName);
        if (!file.exists()) {
            imgName = "";
            file = new File(Props.url + "billar/persona/", imgName);
        }
        return file;
    }

}
