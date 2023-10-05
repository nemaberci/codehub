import {
  CaretCircleRight,
  Question,
  Trash,
  TrendUp,
} from "@phosphor-icons/react";
import { Editor } from "@monaco-editor/react";
import { Button, Divider } from "react-daisyui";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import TabView from "./components/Tabs";
import { useNavigate } from "react-router-dom";

export default function SolutionEditor() {
  const navigate = useNavigate();
  return (
    <>
      <Allotment>
        <Allotment.Pane preferredSize={"45%"}>
          <div className="h-full overflow-auto p-4">
            <article className="prose overflow-auto max-w-none">
              <p>
                <h3>Problem</h3>
                <p>
                  A secret team of programmers is plotting to disrupt the
                  programming language landscape and bring punched cards back by
                  introducing a new language called
                  <i>Punched Card Python</i> that lets people code in Python
                  using punched cards! Like good disrupters, they are going to
                  launch a viral campaign to promote their new language before
                  even having the design for a prototype. For the campaign, they
                  want to draw punched cards of different sizes in ASCII art.
                </p>
                <p>
                  <img
                    src="https://web.archive.org/web/20230223052715im_/https://codejam.googleapis.com/dashboard/get_file/AQj_6U262jpm6Qd7uxxBv1jstjtSrZPrnp58urkNJJQ5Ol7y1bJepKIazfTkMpkRzBodMQB8RiruyLu_TJY37T67YQ/punched_card.png"
                    alt="Example Punched Card."
                  />
                </p>
                <p>
                  The ASCII art of a punched card they want to draw is similar
                  to an <b>R x C</b> matrix without the top-left cell. That
                  means, it has <b>( R . C ) - 1</b>cells in total. Each cell is
                  drawn in ASCII art as a period (<code>.</code>) surrounded by
                  dashes (<code>-</code>) above and below, pipes (<code>|</code>
                  ) to the left and right, and plus signs (<code>+</code>) for
                  each corner. Adjacent cells share the common characters in the
                  border. Periods (<code>.</code>) are used to align the cells
                  in the top row.
                </p>
                <p>
                  For example, the following is a punched card with <b>R = 3</b>{" "}
                  rows and <b>C = 4</b>
                  columns:
                </p>
                <p></p>
                <pre>
                  ..+-+-+-+ ..|.|.|.| +-+-+-+-+ |.|.|.|.| +-+-+-+-+ |.|.|.|.|
                  +-+-+-+-+
                </pre>
                <p></p>
                <p>
                  There are more examples with other sizes in the samples below.
                  Given the integers
                  <span className="MathJax_Preview">
                    <span className="MJXp-math" id="MJXp-Span-27">
                      <span className="MJXp-mrow" id="MJXp-Span-28">
                        <span className="MJXp-mi MJXp-bold" id="MJXp-Span-29">
                          R
                        </span>
                      </span>
                    </span>
                  </span>
                  and
                  <span className="MathJax_Preview">
                    <span className="MJXp-math" id="MJXp-Span-30">
                      <span className="MJXp-mrow" id="MJXp-Span-31">
                        <span className="MJXp-mi MJXp-bold" id="MJXp-Span-32">
                          C
                        </span>
                      </span>
                    </span>
                  </span>
                  describing the size of a punched card, print the ASCII art
                  drawing of it as described above.
                </p>

                <h3>Input</h3>

                <h3>Output</h3>

                <h3>Limits</h3>
                <p>
                  Time limit: 5 seconds.
                  <br />
                  Memory limit: 1 GB.
                  <br />
                </p>

                <h4>Test Set 1 (Visible Verdict)</h4>
                <p></p>

                <h3>Sample</h3>
                <div className="problem-io-wrapper-new">
                  <div className="sampleio-wrapper">
                    <div className="sample-input">
                      <div className="sample-header">
                        <div className="sample-header-text">Sample Input</div>
                      </div>
                      <div className="sample-content">
                        <pre
                          className="sample-content-text"
                          id="sample_input_0"
                        >
                          3 3 4 2 2 2 3
                        </pre>
                      </div>
                    </div>
                    <div className="sample-output">
                      <div className="sample-header">
                        <div className="sample-header-text">Sample Output</div>
                      </div>
                      <div className="sample-content">
                        <pre
                          className="sample-content-text"
                          id="sample_output_0"
                        >
                          Case #1: ..+-+-+-+ ..|.|.|.| +-+-+-+-+ |.|.|.|.|
                          +-+-+-+-+ |.|.|.|.| +-+-+-+-+ Case #2: ..+-+ ..|.|
                          +-+-+ |.|.| +-+-+ Case #3: ..+-+-+ ..|.|.| +-+-+-+
                          |.|.|.| +-+-+-+
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>

                <p>
                  Sample Case #1 is the one described in the problem statement.
                  Sample Cases #2 and #3 are additional examples. Notice that
                  the output for each case contains exactly
                  <span className="MathJax_Preview">
                    <span className="MJXp-math" id="MJXp-Span-85">
                      <span className="MJXp-mrow" id="MJXp-Span-86">
                        <span className="MJXp-mi MJXp-bold" id="MJXp-Span-87">
                          R
                        </span>
                      </span>
                      <span className="MJXp-mo" id="MJXp-Span-88">
                        ⋅
                      </span>
                      <span className="MJXp-mrow" id="MJXp-Span-89">
                        <span className="MJXp-mi MJXp-bold" id="MJXp-Span-90">
                          C
                        </span>
                      </span>
                      <span className="MJXp-mo" id="MJXp-Span-91">
                        +
                      </span>
                      <span className="MJXp-mn" id="MJXp-Span-92">
                        3
                      </span>
                    </span>
                  </span>
                  periods.
                </p>
              </p>
            </article>
          </div>
        </Allotment.Pane>
        {/*<Allotment.Pane preferredSize={250}>
					<div className="text-right">
						<Menu horizontal>
							<Menu.Item>
								<a>
									<FilePlus size={20} />
								</a>
							</Menu.Item>
						</Menu>
					</div>
					<Menu>
						<Menu.Item>
							<a>
								<FileIcon icon={FileText} />
								resume.pdf
							</a>
						</Menu.Item>
						<Menu.Item>
							<Menu.Details
								open={true}
								label={
									<>
										<FileIcon icon={Folder} />
										My Files
									</>
								}
							>
								<Menu.Item>
									<a>
										<FileIcon icon={FileImage} />
										Project-final.psd
									</a>
								</Menu.Item>
								<Menu.Item>
									<a>
										<FileIcon icon={FileImage} />
										Project-final-2.psd
									</a>
								</Menu.Item>
								<Menu.Item>
									<Menu.Details
										open={true}
										label={
											<>
												<FileIcon icon={Folder} />
												Images
											</>
										}
									>
										<Menu.Item>
											<a>
												<FileIcon icon={Image} />
												Screenshot1.png
											</a>
										</Menu.Item>
										<Menu.Item>
											<a>
												<FileIcon icon={Image} />
												Screenshot2.png
											</a>
										</Menu.Item>
										<Menu.Item>
											<Menu.Details
												open={true}
												label={
													<>
														<FileIcon icon={Folder} />
														Others
													</>
												}
											>
												<Menu.Item>
													<a>
														<FileIcon icon={Image} />
														Screenshot3.png
													</a>
												</Menu.Item>
											</Menu.Details>
										</Menu.Item>
									</Menu.Details>
								</Menu.Item>
							</Menu.Details>
						</Menu.Item>
						<Menu.Item>
							<a>
								<FileIcon icon={FileText} />
								reports-final-2.pdf
							</a>
						</Menu.Item>
					</Menu>
				</Allotment.Pane>*/}
        <Allotment vertical>
          <Allotment.Pane>
            <TabView />
            <Editor
              height="90vh"
              width="100%"
              defaultLanguage="java"
              defaultValue={`import java.util.Scanner;

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

}'`}
              theme="vs-dark"
            />
          </Allotment.Pane>

          <Allotment.Pane minSize={216} preferredSize={216} className="p-4">
            <div className="flex gap-2 flex-wrap">
              <Button
                color="success"
                startIcon={<CaretCircleRight size={24} />}
              >
                Indítás
              </Button>
              <Button
                color="info"
                startIcon={<TrendUp size={24} />}
                onClick={() => navigate("/highscores/1")}
              >
                Toplista
              </Button>
              <Button color="neutral" startIcon={<Question size={24} />}>
                Valami
              </Button>
              <Button color="error" startIcon={<Trash size={24} />}>
                Törlés
              </Button>
            </div>
            <Divider />
            Futásidő: 33 ms
            <br />
            Max. memóriahasználat: 616 kB
          </Allotment.Pane>
        </Allotment>
      </Allotment>
    </>
  );
}
