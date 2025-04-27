import { Table } from "react-daisyui";
import HighscoreRow from "./HighscoreRow";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import _ from "lodash";

export interface Highscore {
	username: string;
	points: number;
	runTime: number;
	memory: number;
	language: string;
	attempts: number;
}

export default function Highscores() {
	const [highscores, setHighscores] = useState([] as Highscore[]);
	const { id } = useParams();

	async function fetchHighscores() {
		try {
			const response = await axios.get("/api/solution/list/" + id);
			const result: Highscore[] = response.data.map((element: any) => ({
				username: element.user.username,
				points: element.maxPoints,
				runTime: 0, // This is no longer available in the API
				memory: element.maxMemory,
				language: element.language,
				attempts: element.attempts
			}));

			// Sort by points (descending) and then by memory (ascending)
			const sorted = _.sortBy(result, ["memory"]);
			const reverse = _.reverse(sorted);
			const points = _.sortBy(reverse, "points");
			const final = _.reverse(points);

			setHighscores(final);
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		fetchHighscores();
	}, [id]);

	const exportToCSV = () => {
		const headers = ["Név", "Összpontszám", "Programozási nyelv", "Próbálkozások", "Max. memóriahasználat (MB)"];
		const csvContent = [
			headers.join(","),
			...highscores.map(h => [
				h.username,
				h.points,
				h.language,
				h.attempts,
				(h.memory / 1000).toFixed(2)
			].join(","))
		].join("\n");

		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const link = document.createElement("a");
		link.href = URL.createObjectURL(blob);
		link.download = `highscores_${id}.csv`;
		link.click();
	};

	const exportToJSON = () => {
		const jsonContent = JSON.stringify(highscores, null, 2);
		const blob = new Blob([jsonContent], { type: "application/json" });
		const link = document.createElement("a");
		link.href = URL.createObjectURL(blob);
		link.download = `highscores_${id}.json`;
		link.click();
	};

	return (
		<>
			<div className="w-full flex flex-col items-center">
				<div className="flex justify-between items-center w-1/2 mb-4">
					<h2>Legjobb eredmények</h2>
					<div className="flex gap-2">
						<button className="btn btn-sm btn-outline" onClick={exportToCSV}>
							Export CSV
						</button>
						<button className="btn btn-sm btn-outline" onClick={exportToJSON}>
							Export JSON
						</button>
					</div>
				</div>
				<div className="w-1/2 text-center mt-10">
					<Table>
						<Table.Head>
							<span />
							<span>Név</span>
							<span>Összpontszám</span>
							<span>Programozási nyelv</span>
							<span>Próbálkozások</span>
							<span>Max. memóriahasználat</span>
						</Table.Head>

						<Table.Body>
							{highscores.map((highscore, index) => (
								<HighscoreRow highscore={highscore} index={index + 1} key={index} />
							))}
						</Table.Body>
					</Table>
				</div>
			</div>
		</>
	);
}
