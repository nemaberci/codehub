import { Table } from "react-daisyui";
import ChallengeListRow from "./ChallengeListRow";

export interface Challenge {
	id: string;
	name: string;
	shortDescription: string;
	totalPoints: number;
	uploader: string;
	uploadTime: string;
}

const demoChallengeList: Challenge[] = [
	{
		id: "0",
		name: "Punched Cards",
		shortDescription: "Lyukkártyák szöveges generálása paraméterek alapján",
		totalPoints: 5,
		uploader: "Google",
		uploadTime: "2010-01-04 27:02:03",
	},
	{
		id: "1",
		name: "Stream",
		shortDescription: "Streamek streamelése videokártyába",
		totalPoints: 100,
		uploader: "JZ",
		uploadTime: "2014-14-14 14:14:14",
	},
	{
		id: "2",
		name: "Zárójelek",
		shortDescription: "Érvényes zárójelezés ellenőrzése",
		totalPoints: 3,
		uploader: "Prog1",
		uploadTime: "2020-20-20 20:20:20",
	},
	{
		id: "3",
		name: "Bűvös négyzetek",
		shortDescription: "Bűvös négyzet megoldó készítése",
		totalPoints: 11,
		uploader: "Prog2",
		uploadTime: "2021-21-21 21:21:21",
	},
	{
		id: "4",
		name: "Zárójelek",
		shortDescription: "Érvényes zárójelezés ellenőrzése",
		totalPoints: 3,
		uploader: "Prog1",
		uploadTime: "2020-20-20 20:20:20",
	},
	{
		id: "5",
		name: "Feladat2",
		shortDescription: "Még egy feladat",
		totalPoints: 4,
		uploader: "Prog3",
		uploadTime: "2023-23-23 23:23:23",
	},
];

export default function ChallengeList() {
	return (
		<>
			<div className="h-screen w-full flex flex-col items-center">
				<h2>Feladatok</h2>
				<div className="max-w-1/2 text-center mt-10">
					<Table>
						<Table.Head>
							<span />
							<span>Név</span>
							<span>Leírás</span>
							<span>Összpontszám</span>
							<span>Feltöltötte</span>
							<span>Feltöltés ideje</span>
						</Table.Head>

						<Table.Body>
							{demoChallengeList.map((challenge, index) => (
								<ChallengeListRow challenge={challenge} index={index + 1} key={index} />
							))}
						</Table.Body>
					</Table>
				</div>
			</div>
		</>
	);
}
