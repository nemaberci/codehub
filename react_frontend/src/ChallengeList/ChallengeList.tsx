import { Table } from "react-daisyui";
import ChallengeListRow from "./ChallengeListRow";
import { useEffect, useState } from "react";
import axios from "axios";

export interface Challenge {
	id: string;
	name: string;
	shortDescription: string;
	points: number[];
	uploader: string;
	uploadTime: string;
}

export default function ChallengeList() {
	const [challenges, setChallenges] = useState([]);

	async function fetchChallenges() {
		try {
			const response = await axios.get("/api/challenge/list");
			response.data.map((challenge: any) => {
				const points: number[] = challenge.testCases.map((testCase: any) => testCase.score);
				return {
					id: challenge.id,
					name: challenge.name,
					shortDescription: challenge.description,
					uploader: challenge.user,
					points: points,
					uploadTime: challenge.uploadedAt,
				};
			});
			setChallenges(response.data);
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		fetchChallenges();
	}, []);

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
							{challenges.map((challenge: any, index) => (
								<ChallengeListRow challenge={challenge} index={index + 1} key={challenge.id} />
							))}
						</Table.Body>
					</Table>
				</div>
			</div>
		</>
	);
}
