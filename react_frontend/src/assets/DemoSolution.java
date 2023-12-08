import java.util.Scanner;

public class Solution {

	public static void main(String[] args) {
		Scanner s = new Scanner(System.in);
		int cases = s.nextInt();
		for(int i=0;i<cases;i++) {
			System.out.println("Case #"+(i+1)+":");
			int rows = s.nextInt();
			int columns = s.nextInt();
			
			
			for(int row=0;row<rows;row++) {
				
				for(int column=0;column<columns;column++) {
					if(row == 0 && column == 0) {
						System.out.print('..');
					}else {
						System.out.print('+-');
					}
				}
				
				System.out.println('+');
				
				for(int column=0;column<columns;column++) {
					if(row == 0 && column == 0) {
						System.out.print('..');
					}else {
						System.out.print('|.');
					}
				}
				System.out.println('|');
				
				
			}
			
			for(int column=0;column<columns;column++) {
				System.out.print('+-');
			}
			System.out.println('+');
		}
		
		s.close();

	}

}