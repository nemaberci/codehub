import { Table } from "react-daisyui";
import HighscoreRow from "./HighscoreRow";

export interface Highscore {
	username: string;
	points: number[];
	timeSpent: number;
	runTime: number;
	memory: number;
}

const demoHighscore: Highscore[] = [
	{
		username: "Egyik felhasználó",
		points: [5, 5, 5],
		timeSpent: 5 * 60 + 13,
		runTime: 7,
		memory: 2.1,
	},
	{
		username: "Másik felhasználó",
		points: [5, 5, 4],
		timeSpent: 6 * 60 + 11,
		runTime: 9,
		memory: 2.33,
	},
	{
		username: "Harmadik felhasználó",
		points: [5, 5, 3],
		timeSpent: 7 * 60 + 30,
		runTime: 11,
		memory: 2.9,
	},
	{
		username: "Negyedik felhasználó",
		points: [5, 4, 3],
		timeSpent: 17 * 60 + 40,
		runTime: 15,
		memory: 2.91,
	},
];

export default function Highscores() {
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
							{demoHighscore.map((highscore, index) => (
								<HighscoreRow highscore={highscore} index={index + 1} key={index} />
							))}
						</Table.Body>
					</Table>
				</div>
			</div>
		</>
	);
}
