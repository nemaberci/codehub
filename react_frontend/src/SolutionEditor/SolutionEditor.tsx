import { CaretCircleRight, CircleNotch, Question, Trash, TrendUp } from "@phosphor-icons/react";
import { Editor } from "@monaco-editor/react";
import { Button, Divider } from "react-daisyui";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import TabView from "../components/Tabs";
import { useNavigate, useParams } from "react-router-dom";
// @ts-expect-error demo file
import demoTask from "../assets/DemoTask.md";
// @ts-expect-error demo file
import demoSolution from "../assets/DemoSolution.java";
import Markdown from "react-markdown";
import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function SolutionEditor() {
	const navigate = useNavigate();
	const [text, setText] = useState("");
	const [solution, setSolution] = useState("");
	const [running, setRunning] = useState(false);

	const { id: challengeId } = useParams();
	const userId = (jwtDecode(localStorage.getItem("token")!) as any).userId;

	async function fetchText() {
		setText(await fetch(demoTask).then((res) => res.text()));
	}

	async function fetchSolution() {
		setSolution(await fetch(demoSolution).then((res) => res.text()));
	}

	async function fetchResult() {
		try {
			const response = await axios.get(`/api/solution/result/${challengeId}/${userId}`);
			console.log(response.data);
		} catch (e) {
			console.error(e);
		}
	}

	async function submitSolution() {
		try {
			setRunning(true);
			await axios.post(`/api/solution/solve`, {
				challengeId: "challenge-7ce170c5-b9c6-41f1-bc6c-ee27256de508",
				folderContents: [
					{
						name: "Solution.java",
						content: btoa(solution),
					},
				],
			});
		} catch (e) {
			console.log(e);
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
							<Button color="error" startIcon={<Trash size={24} />} onClick={fetchResult}>
								Eredmény
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
