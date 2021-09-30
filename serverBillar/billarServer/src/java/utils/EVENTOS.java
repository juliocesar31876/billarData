package utils;

import images.Props;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.RenderingHints;
import java.awt.geom.AffineTransform;
import java.awt.image.AffineTransformOp;
import java.awt.image.BufferedImage;
import java.awt.image.RenderedImage;
import java.io.*;
import java.nio.file.Files;
import javax.imageio.ImageIO;
import javax.servlet.http.Part;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.FilenameUtils;

public class EVENTOS {

    public static String guardar_file(Part file, String url, String nombre) throws IOException {

        int dbs = 2048;
        String arr[] = url.split("/");
        String rootPath = Props.url;
        File roF = new File(rootPath);
        if (!roF.exists()) {
            roF.mkdirs();
        }
        // ftp.enterLocalPassiveMode();
        String urlTemp = "billar";
        for (int i = 0; i < arr.length; i++) {
            urlTemp += "/" + arr[i];
            File d = new File(rootPath + urlTemp);
            if (!d.exists()) {
                d.mkdirs();
            }

        }
        File f = new File(rootPath + "/billar/" + url + "/" + nombre);
        BufferedImage image = ImageIO.read(file.getInputStream());
        int w, h;
        double porc = 100;
        if (image.getWidth() > image.getHeight()) {
            if (image.getWidth() > 500) {
                porc = 500 * 100 / image.getWidth();
            }
        } else {
            if (image.getHeight() > 500) {
                porc = 500 * 100 / image.getHeight();
            }
        }
        w = (int) (image.getWidth() * (porc / 100));
        h = (int) (image.getHeight() * (porc / 100));
        Graphics2D g = image.createGraphics();
        g.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);

        g.drawImage(image, 0, 0, w, h, null);
        g.dispose();
        ImageIO.write(image.getSubimage(0, 0, w, h), "png", f);
        return nombre;
    }

    public static String obtener_file(String url) throws IOException {
        File file = new File(url);
        String encodedBase64 = null;
        try {
            FileInputStream fileInputStreamReader = new FileInputStream(file);
            byte[] bytes = new byte[(int) file.length()];
            fileInputStreamReader.read(bytes);

            encodedBase64 = new String(Base64.encodeBase64(bytes));
        } catch (Exception e) {
            System.out.println(e);
        }

        return encodedBase64;
    }

}
