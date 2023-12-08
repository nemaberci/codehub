### Problem

A secret team of programmers is plotting to disrupt the programming language landscape and bring punched cards back by introducing a new language called*Punched Card Python* that lets people code in Python using punched cards! Like good disrupters, they are going to launch a viral campaign to promote their new language before even having the design for a prototype. For the campaign, they want to draw punched cards of different sizes in ASCII art.

![Example Punched Card.](https://web.archive.org/web/20230223052715im_/https://codejam.googleapis.com/dashboard/get_file/AQj_6U262jpm6Qd7uxxBv1jstjtSrZPrnp58urkNJJQ5Ol7y1bJepKIazfTkMpkRzBodMQB8RiruyLu_TJY37T67YQ/punched_card.png)

The ASCII art of a punched card they want to draw is similar to an **R x C** matrix without the top-left cell. That means, it has **( R . C ) - 1**cells in total. Each cell is drawn in ASCII art as a period (`.`) surrounded by dashes (`-`) above and below, pipes (`|`) to the left and right, and plus signs (`+`) for each corner. Adjacent cells share the common characters in the border. Periods (`.`) are used to align the cells in the top row.

For example, the following is a punched card with **R = 3** rows and **C = 4**columns:

```
..+-+-+-+ ..|.|.|.| +-+-+-+-+ |.|.|.|.| +-+-+-+-+ |.|.|.|.| +-+-+-+-+
```

There are more examples with other sizes in the samples below. Given the integersRandCdescribing the size of a punched card, print the ASCII art drawing of it as described above.

### Input

### Output

### Limits

Time limit: 5 seconds.  
Memory limit: 1 GB.

#### Test Set 1 (Visible Verdict)

### Sample

Sample Input

```
3 3 4 2 2 2 3
```

Sample Output

```
Case #1: ..+-+-+-+ ..|.|.|.| +-+-+-+-+ |.|.|.|.| +-+-+-+-+ |.|.|.|.| +-+-+-+-+ Case #2: ..+-+ ..|.| +-+-+ |.|.| +-+-+ Case #3: ..+-+-+ ..|.|.| +-+-+-+ |.|.|.| +-+-+-+
```

Sample Case #1 is the one described in the problem statement. Sample Cases #2 and #3 are additional examples. Notice that the output for each case contains exactlyR⋅C+3periods.