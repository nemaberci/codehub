import { CaretCircleRight, CircleNotch, CloudArrowDown, TrendUp } from "@phosphor-icons/react";
import { Editor } from "@monaco-editor/react";
import { Button, Divider } from "react-daisyui";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import TabView from "../components/Tabs";
import { useNavigate, useParams } from "react-router-dom";
// @ts-expect-error not a js file
import startingSolution from "../assets/StartingSolution.java";
import Markdown from "react-markdown";
import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function SolutionEditor() {
	const navigate = useNavigate();
	const [text, setText] = useState("");
	const [title, setTitle] = useState("");
	const [solution, setSolution] = useState("");
	const [running, setRunning] = useState(false);
	const [results, setResults] = useState({ testCaseResults: [] });
	const [intervalHandle, setIntervalHandle] = useState(null);

	const { id: challengeId } = useParams();
	const userId = (jwtDecode(localStorage.getItem("token")!) as any).userId;

	async function fetchText() {
		try {
			const response = await axios.get("/api/challenge/get/" + challengeId);
			setText(response.data.description);
			setTitle(response.data.name);
		} catch (error) {
			console.error(error);
		}
	}

	async function fetchSolution() {
		setSolution(await fetch(startingSolution).then((res) => res.text()));
	}

	async function fetchResult() {
		try {
			const response = await axios.get(`/api/solution/result/${challengeId}/${userId}`);
			setResults(response.data);
			if (response.data.testCaseResults?.length > 0) {
				setRunning(false);
				if (intervalHandle) {
					clearInterval(intervalHandle);
				}
			}
		} catch (e) {
			console.error(e);
		}
	}

	async function submitSolution() {
		try {
			setRunning(true);
			await axios.post(`/api/solution/solve`, {
				challengeId,
				folderContents: [
					{
						name: "Solution.java",
						content: btoa(solution),
					},
				],
			});
			setIntervalHandle(setInterval(fetchResult, 15000));
		} catch (error) {
			console.error(error);
			setRunning(false);
			alert("Hiba a megoldás beküldésekor");
		}
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
							<h1>{title}</h1>
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
							<Button color="success" startIcon={runIcon} onClick={submitSolution} disabled={running}>
								{running ? "Kiértékelés" : "Indítás"}
							</Button>
							<Button color="info" startIcon={<CloudArrowDown size={24} />} onClick={fetchResult}>
								Eredmények
							</Button>
							<Button
								color="neutral"
								startIcon={<TrendUp size={24} />}
								onClick={() => navigate("/highscores/" + challengeId)}
							>
								Toplista
							</Button>
						</div>
						<Divider />
						<h4>{results.testCaseResults.length > 0 ? "Eredmények" : "Még nincsenek eredmények"}</h4>
						{results.testCaseResults.map((result, index) => (
							<div>
								<b>{index + 1}. részfeladat</b>
								<br />
								Futásidő: {result.time}
								<br />
								Max. memóriahasználat: {result.memory} kB
								<Divider />
							</div>
						))}
					</Allotment.Pane>
				</Allotment>
			</Allotment>
		</>
	);
}
