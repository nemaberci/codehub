import {
	CaretCircleRight,
	CheckFat,
	CircleNotch,
	CloudArrowDown, GearSix,
	TrendUp,
	XCircle,
} from "@phosphor-icons/react";
import { Editor } from "@monaco-editor/react";
import {Button, Divider} from "react-daisyui";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import TabView from "../components/Tabs";
import { useNavigate, useParams } from "react-router-dom";
import Markdown from "react-markdown";
import {useEffect, useState} from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import _ from "lodash";
import {Challenge, Solution, SolutionBuildResult} from "../client/returnedTypes";
import TestCaseResult from "../client/returnedTypes/TestCaseResult.ts";

export default function SolutionEditor({
	reference
}: {
	reference: boolean;
}) {
	const navigate = useNavigate();
	const [text, setText] = useState("");
	const [title, setTitle] = useState("");
	const [creatorUserId, setCreatorUserId] = useState("");
	const [totalPoints, setTotalPoints] = useState(0);
	const [solution, setSolution] = useState("");
	const [running, setRunning] = useState(false);
	const [results, setResults] = useState<{testCaseResults: TestCaseResult[]}>({ testCaseResults: [] });
	const [buildResult, setBuildResult] = useState({
		done: false,
		buildResultOk: false,
		buildResultOutput: "",
	});
	const [selectedLanguage, setSelectedLanguage] = useState("java");
	const [enabledLanguages, setEnabledLanguages] = useState<string[]>([]);
	//const [intervalHandle, setIntervalHandle] = useState(null);

	const { id: challengeId } = useParams();
	const userId = (jwtDecode(localStorage.getItem("token")!) as any).userId;

	async function fetchText() {
		try {
			const response = await axios.get<Challenge>("/api/challenge/get/" + challengeId);
			setText(response.data.description);
			setTitle(response.data.name);
			setCreatorUserId(response.data.userId);
			setEnabledLanguages(response.data.enabledLanguages);
			setTotalPoints(_.sumBy(response.data.testCases, "points"));
		} catch (error) {
			console.error(error);
		}
	}

	let fetchInitialSolution = async () => {
		try {
			const response = await axios.get<Solution>(`/api/solution/result/${challengeId}/${userId}`);
			if (Array.isArray(response.data.files)) {
				const firstFile = response.data.files![0];
				setSolution(atob(firstFile.content));
				setSelectedLanguage(response.data.language);
			} else {
				fetchDefaultSolution("java");
			}
		} catch (e) {
				fetchDefaultSolution("java");
		}
	}

	let fetchSolution = async (lang = "java") => {
		try {
			const response = await axios.get<Solution>(`/api/solution/result/${challengeId}/${userId}`);
			if (response.data.language === lang) {
				const firstFile = response.data.files![0];
				setSolution(atob(firstFile.content));
				setSelectedLanguage(response.data.language);
			} else {
				fetchDefaultSolution(lang);
			}
		} catch (e) {
			fetchDefaultSolution(lang);
		}
	}

	const fetchDefaultSolution = async (lang: string) => {
		console.log("fetching solution for language", lang);
		switch (lang) {
			case "java":
				setSolution(await fetch("../assets/StartingSolution.java").then((res) => res.text()));
				break;
			case "cpp":
				setSolution(await fetch("../assets/StartingSolution.cpp").then((res) => res.text()));
				break;
		}
	}

	async function fetchResult() {
		try {
			setResults({ testCaseResults: [] });
			// fetch build result first
			const buildResponse = await axios.get<SolutionBuildResult>(`/api/solution/build_result/${challengeId}/${userId}`);
			const buildResultOk = buildResponse.data.buildResult;
			const buildResultOutput = buildResponse.data.buildOutput;
			const done = buildResponse.data.buildResult !== null
				&& typeof buildResponse.data.buildResult !== "undefined"
				&& buildResponse.data.buildOutput !== undefined
				&& buildResponse.data.buildOutput !== null;

			setBuildResult({ done, buildResultOk, buildResultOutput });
			if (buildResultOk) {
				// if build ok then fetch result
				const response = await axios.get<Solution>(`/api/solution/result/${challengeId}/${userId}`);
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
			if (reference) {
				await axios.post(`/api/challenge/add_control_solution/${challengeId}`, {
					controlSolution: {
						language: selectedLanguage,
						folderContents: [
							{
								name: `Solution.${selectedLanguage}`,
								content: btoa(solution),
							}
						],
						entryPoint: `Solution.${selectedLanguage}`
					},
				})
			} else {
				await axios.post(`/api/solution/solve`, {
					challengeId,
					folderContents: [
						{
							// todo: replace with normal file name
							name: `Solution.${selectedLanguage}`,
							content: btoa(solution),
						},
					],
					language: selectedLanguage,
					entryPoint: `Solution.${selectedLanguage}`
				});
			}
			//setIntervalHandle(setInterval(fetchResult, 15000));
			setRunning(false);
		} catch (error) {
			console.error(error);
			setRunning(false);
			alert("Hiba a megoldás beküldésekor");
		}
	}

	useEffect(() => {
		fetchText();
		fetchInitialSolution();
		fetchResult();
	}, []);

	let runIcon: React.JSX.Element;
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

	const selectedLanguageChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedLanguage(e.target.value);
		fetchSolution(e.target.value);
	};

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
						<TabView filename={`Solution.${selectedLanguage}`} />
						<Editor
							height="90vh"
							width="100%"
							defaultLanguage="java"
							language={selectedLanguage}
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
								<select className="select w-full max-w-xs" value={selectedLanguage} onChange={selectedLanguageChanged}>
									{
										enabledLanguages.includes("java") &&
											<option value="java">Java</option>
									}
									{
										enabledLanguages.includes("cpp") &&
											<option value="cpp">C++</option>
									}
								</select>
								<Button color="success" startIcon={runIcon} onClick={submitSolution} disabled={running}>
									{running ? "Kiértékelés" : "Indítás"}
								</Button>
								<Button color="info" startIcon={<CloudArrowDown size={24} />} onClick={fetchResult}>
									Eredmények
								</Button>
								{
									!reference &&
									<>
										<Button
											color="neutral"
											startIcon={<TrendUp size={24} />}
											onClick={() => navigate("/highscores/" + challengeId)}
										>
											Toplista
										</Button>
										{
											userId === creatorUserId &&
											<Button
												color="warning"
												startIcon={<GearSix size={24} />}
												onClick={() => navigate(`/edit/${challengeId}/testcases`)}
											>
												Szerkesztés
											</Button>
										}
									</>
								}
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
