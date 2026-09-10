import org.springframework.security.crypto.bcrypt.BCrypt;
public class Check {
  public static void main(String[] args) {
    String hash = "$2a$10$IjcVxXElTLU/xzL.1fzu/eAU67ksfq4GK8pnUGzBZDqRx4hRKs5KG";
    String[] cands = {"Admin@123","admin@123","admin123","Admin123","admin","password","Pass@123","Admin@321","admin@algoforge.local","admin@algoforge.com","123456","secret","Welcome@123","Algoforge@123","admin@algoforge.local","Admin@2024","AlgoForge@123"};
    for (String c : cands) {
      System.out.println(c + " => " + BCrypt.checkpw(c, hash));
    }
  }
}
