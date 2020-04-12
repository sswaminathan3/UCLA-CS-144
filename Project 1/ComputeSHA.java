import java.security.*;
import java.io.FileInputStream;
import java.io.IOException;

public class ComputeSHA
{
	public static void main(String[] args)
	{
		if (args.length < 2) {
			try {
				String filename = args[0];
				String hash = compute(filename);
				System.out.println(hash);
			} 
			catch (IOException exception) {
				exception.printStackTrace();
			}
		}
		// if there are 2 or more arguments
		else {
			System.err.println("Error: Must provide only one argument.");
		}
		
	}

	public static String compute(String filename) throws IOException
	{
		StringBuilder sb = new StringBuilder();

		try {
			// use SHA-1 message digest algorithm
			MessageDigest md = MessageDigest.getInstance("SHA-1");

			// construct new input stream to read in file
			FileInputStream fis = new FileInputStream(filename);
     
		    // use byte array to read in chunks at a time
		    byte[] byteArr = new byte[1024];
		    // holds number of bytes actually read into byte array
		    int bytesRead = 0; 
		      
		    // read from file until all bytes have been read
		    while ((bytesRead = fis.read(byteArr)) != -1) {
		    	// pass read bytes into message digest object
		        md.update(byteArr, 0, bytesRead);
		    };
		     
		    // close input stream
		    fis.close();

			// generate the message digest; returns new byte array
			byte[] digest = md.digest();
			
			// convert message digest bytes to hex
			for (byte b : digest) {
			    sb.append(String.format("%02x", b & 0xff));
			}
		}		
		catch (NoSuchAlgorithmException nsae) {
			System.err.println("Error: SHA-1 algorithm not available.");
			System.exit(1);
		}

		// return encrypted hex string
		return sb.toString(); 
	}
}