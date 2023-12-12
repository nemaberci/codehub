import { Table } from "react-daisyui";
import HighscoreRow from "./HighscoreRow";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import _ from "lodash";

export interface Highscore {
	username: string;
	points: number;
	//timeSpent: number;
	runTime: number;
	memory: number;
}

export default function Highscores() {
	const [highscores, setHighscores] = useState([] as Highscore[]);
	const { id } = useParams();

	async function fetchHighscores() {
		try {
			const response = await axios.get("/api/solution/list/" + id);
			const result: Highscore[] = [];
			for (const element of response.data) {
				result.push({
					username: element.user,
					points: _.sum(element.testCaseResults.map((result: any) => result.points)),
					runTime: _.sum(element.testCaseResults.map((result: any) => result.time)),
					memory: _.max(element.testCaseResults.map((result: any) => result.memory))!,
				});
			}
			//const result = _.sortBy(response.data, []);
			const sorted = _.sortBy(result, "runTime");
			const reverse = _.reverse(sorted);
			const points = _.sortBy(reverse, "points");
			const reverse2 = _.reverse(points);
			setHighscores(reverse2);
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
							<span>Összpontszám</span>
							{/*<span>Eltelt idő</span>*/}
							<span>Összes futásidő</span>
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
