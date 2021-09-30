
package utils;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import org.bouncycastle.util.encoders.Hex;


public class utils {
    public static java.sql.Date toDate(String fecha){
        try {
            SimpleDateFormat format = new SimpleDateFormat("MM/dd/yyyy");
            Date parsed = format.parse(fecha);
            return new java.sql.Date(parsed.getTime());
        } catch (ParseException ex) {
            return null;
        }
    }
    public static String toSha256(String text){
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(text.getBytes(StandardCharsets.UTF_8));
            return new String(Hex.encode(hash));
        }catch(Exception e){
            return "";
        }
    }
}
