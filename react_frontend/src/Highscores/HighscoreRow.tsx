import { Table } from "react-daisyui";
import { Highscore } from "./Highscores";

export default function HighscoreRow({ highscore, index }: { highscore: Highscore; index: number }) {
	return (
		<Table.Row hover className="cursor-pointer">
			<span>{index}</span>
			<span>{highscore.username}</span>
			<span>{highscore.points.join("/")}</span>
			<span>{Math.floor(highscore.timeSpent / 60) + ":" + (highscore.timeSpent % 60)}</span>
			<span>{highscore.runTime} ms</span>
			<span>{highscore.memory} MB</span>
		</Table.Row>
	);
}
