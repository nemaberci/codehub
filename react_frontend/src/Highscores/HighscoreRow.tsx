import { Table } from "react-daisyui";
import { Highscore } from "./Highscores";

export default function HighscoreRow({ highscore, index }: { highscore: Highscore; index: number }) {
	return (
		<Table.Row hover className="cursor-pointer">
			<span>{index}</span>
			<span>{highscore.username}</span>
			<span>{highscore.points}</span>
			<span>{highscore.language}</span>
			<span>{highscore.attempts}</span>
			<span>{(highscore.memory ?? 0) / 1000} MB</span>
		</Table.Row>
	);
}
