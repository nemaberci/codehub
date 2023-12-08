import { CaretCircleRight, CircleNotch, Question, Trash, TrendUp } from "@phosphor-icons/react";
import { Editor } from "@monaco-editor/react";
import { Button, Divider } from "react-daisyui";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import TabView from "../components/Tabs";
import { useNavigate } from "react-router-dom";
// @ts-expect-error demo file
import demoTask from "../assets/DemoTask.md";
// @ts-expect-error demo file
import demoSolution from "../assets/DemoSolution.java";
import Markdown from "react-markdown";
import { useEffect, useState } from "react";
import axios from "axios";

export default function SolutionEditor() {
	const navigate = useNavigate();
	const [text, setText] = useState("");
	const [solution, setSolution] = useState("");
	const [running, setRunning] = useState(false);

	async function fetchText() {
		setText(await fetch(demoTask).then((res) => res.text()));
	}

	async function fetchSolution() {
		setSolution(await fetch(demoSolution).then((res) => res.text()));
	}

	async function submitSolution() {
		try { 
			
			setRunning(true);
			const response = await axios.post("http://localhost:3001/solution/solve", {
				"challengeId": "challenge-7ce170c5-b9c6-41f1-bc6c-ee27256de508",
				"folderContents": [
				  {
					"name": "Solution.java",
					"content": btoa(solution),
				  }
				]
			},
			{
				headers:{
					Authorization:`Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDIwNTM0MzYsImV4cCI6MTczMzYxMTAzNn0.WqM_eJflqKMTlkP9L3SNFYQzMK_UQAwqR30Utmwh16RjOlg1roYWAegMC619bEfp4Oh9QSDlVZtLFPRS7-O0esYeyBiLaioZ6pX25kYMXTfEdtKfRVmdlKFNIfNFJKn5P9srPNqOs-ObI8gtf2vZp8b1Ef1NanFry6zPhTtoTO3U7UkNoPAu9t7oTzji8RcprYDRg8t7NeNakK8oyHUZHqtzToONaM1de69uYGY-P8IFU5W1MK8vGB6GNYZIuxlYb0-SiiTXtwGXckHEiAup5bo0h3XhD56R2LHSsH8lDUcrgCZb5bTJehvzOp9WIC5-Y73Yoj_tjHM3bv2eZOYMMlQDxPpQxllGppRobLwnGQ9JlvotmSGC231rVmIffGIx3tK2rmLrESn1oUNy4nomhw8QvcaYC-PzBJFzL9RyveYHkJel6X3czEm-RIOchDlxbMQV5Wwkeu0BOMGo9KFVFd_lL73XW47ogtxhtbwX13pKQUv-jxT9xVjHWa0yUtxN`
				}
			});
			
		} catch(e) {
			console.log(e)
		} finally { 
			setRunning(false);
		}
		//alert(solution);
		setTimeout(() => setRunning(false), 2000);
	}

	useEffect(() => {
		fetchText();
		fetchSolution();
	}, []);

	let runIcon = <></>;
	if (running) {
		runIcon = <CircleNotch size={24} className="spinning-fast" />;
	} else {
		runIcon = <CaretCircleRight size={24} />;
	}

	return (
		<>
			<Allotment>
				<Allotment.Pane preferredSize={"45%"}>
					<div className="h-full overflow-auto p-4">
						<article className="prose overflow-auto max-w-none">
							<Markdown>{text}</Markdown>
						</article>
					</div>
				</Allotment.Pane>
				<Allotment vertical>
					<Allotment.Pane>
						<TabView />
						<Editor
							height="90vh"
							width="100%"
							defaultLanguage="java"
							value={solution}
							theme="vs-dark"
							onChange={(value) => {
								console.log("changed");
								setSolution(value ?? "");
							}}
						/>
					</Allotment.Pane>

					<Allotment.Pane minSize={216} preferredSize={216} className="p-4">
						<div className="flex gap-2 flex-wrap">
							<Button color="success" startIcon={runIcon} onClick={submitSolution}>
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
								Súgó
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
