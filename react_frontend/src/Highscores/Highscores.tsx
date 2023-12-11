import { Table } from "react-daisyui";
import HighscoreRow from "./HighscoreRow";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export interface Highscore {
	username: string;
	points: number[];
	timeSpent: number;
	runTime: number[];
	memory: number[];
}

export default function Highscores() {
	const [highscores, setHighscores] = useState([]);
	const { id } = useParams();

	async function fetchHighscores() {
		try {
			const response = await axios.get("/api/solution/list/" + id);
			setHighscores(response.data);
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		fetchHighscores();
	}, []);

	return (
		<>
			<div className="w-full flex flex-col items-center">
				<h2>Legjobb eredmények</h2>
				<div className="w-1/2 text-center mt-10">
					<Table>
						<Table.Head>
							<span />
							<span>Név</span>
							<span>Pontszámok</span>
							<span>Eltelt idő</span>
							<span>Futásidő</span>
							<span>Memóriahasználat</span>
						</Table.Head>

						<Table.Body>
							{highscores.map((highscore: any, index) => (
								<HighscoreRow
									highscore={{
										username: highscore.user,
										points: highscore.testCaseResults.map((result) => result.points),
										timeSpent: 0,
										runTime: highscore.testCaseResults.map((result) => Math.ceil(result.time)),
										memory: highscore.testCaseResults.map((result) => 0),
									}}
									index={index + 1}
									key={index}
								/>
							))}
						</Table.Body>
					</Table>
				</div>
			</div>
		</>
	);
}
