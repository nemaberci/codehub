import {
	CaretCircleRight,
	CheckFat,
	CircleNotch,
	CloudArrowDown,
	TrendUp,
	X,
	XCircle,
} from "@phosphor-icons/react";
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
import _ from "lodash";

export default function SolutionEditor() {
	const navigate = useNavigate();
	const [text, setText] = useState("");
	const [title, setTitle] = useState("");
	const [totalPoints, setTotalPoints] = useState(0);
	const [solution, setSolution] = useState("");
	const [running, setRunning] = useState(false);
	const [results, setResults] = useState({ testCaseResults: [] });
	const [buildResult, setBuildResult] = useState({
		done: false,
		buildResultOk: false,
		buildResultOutput: "",
	});
	//const [intervalHandle, setIntervalHandle] = useState(null);

	const { id: challengeId } = useParams();
	const userId = (jwtDecode(localStorage.getItem("token")!) as any).userId;

	async function fetchText() {
		try {
			const response = await axios.get("/api/challenge/get/" + challengeId);
			setText(response.data.description);
			setTitle(response.data.name);
			setTotalPoints(_.sumBy(response.data.testCases, "points"));
		} catch (error) {
			console.error(error);
		}
	}

	async function fetchSolution() {
		setSolution(await fetch(startingSolution).then((res) => res.text()));
	}

	async function fetchResult() {
		try {
			setResults({ testCaseResults: [] });
			// fetch build result first
			const buildResponse = await axios.get(`/api/solution/build_result/${challengeId}/${userId}`);
			const buildResultOk = buildResponse.data.buildResult;
			const buildResultOutput = buildResponse.data.buildOutput;

			setBuildResult({ done: true, buildResultOk, buildResultOutput });
			if (buildResultOk) {
				// if build ok then fetch result
				const response = await axios.get(`/api/solution/result/${challengeId}/${userId}`);
				setResults(response.data);
				setRunning(false);
				/*if (response.data.testCaseResults?.length > 0) {
					
					if (intervalHandle) {
						clearInterval(intervalHandle);
						setIntervalHandle(null);
					}
				}*/
			}
		} catch (e) {
			console.error(e);
			setBuildResult({ done: false, buildResultOk: false, buildResultOutput: "" });
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
			//setIntervalHandle(setInterval(fetchResult, 15000));
			setTimeout(() => setRunning(false), 10000);
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

	let lastRunTitle = "";
	if (results.testCaseResults.length > 0) {
		const lastPoints = _.sumBy(results.testCaseResults, "points");
		lastRunTitle = `Legutóbbi sikeres futtatás eredménye (${lastPoints}/${totalPoints})`;
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

					<Allotment.Pane minSize={326} preferredSize={326} className="p-4">
						<div className=" overflow-auto h-full block">
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
							{buildResult.done ? (
								buildResult.buildResultOk ? (
									<h4>Fordítás sikeres</h4>
								) : (
									<h4>Fordítási hiba:{buildResult.buildResultOutput}</h4>
								)
							) : (
								<h4>Még nincsenek eredmények</h4>
							)}
							<Divider />
							<h4>{lastRunTitle}</h4>
							{results.testCaseResults.map((result: any, index) => (
								<>
									<b>
										{index + 1}. részfeladat{" "}
										{result.points > 0 ? <CheckFat color="green" /> : <XCircle color="red" />}
									</b>
									<br />
									Futásidő: {Math.ceil(result.time)} ms
									<br />
									Max. memóriahasználat: {result.memory / 1000} MB
									<br />
									Pontok: <b>{result.points}</b>
									<Divider />
								</>
							))}
						</div>
					</Allotment.Pane>
				</Allotment>
			</Allotment>
		</>
	);
}
