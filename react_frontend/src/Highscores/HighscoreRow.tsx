import { Table } from "react-daisyui";
import { Highscore } from "./Highscores";

export default function HighscoreRow({ highscore, index }: { highscore: Highscore; index: number }) {
	//const minutes = Math.floor(highscore.timeSpent / 60);
	//const seconds = highscore.timeSpent % 60;
	//const zeroSeconds = (seconds < 10 ? "0" : "") + seconds;
	return (
		<Table.Row hover className="cursor-pointer">
			<span>{index}</span>
			<span>{highscore.username}</span>
			<span>{highscore.points}</span>
			{/*<span>{minutes + ":" + zeroSeconds}</span>*/}
			<span>{Math.ceil(highscore.runTime)} ms</span>
			<span>{(highscore.memory ?? 0) / 1000} MB</span>
		</Table.Row>
	);
}
