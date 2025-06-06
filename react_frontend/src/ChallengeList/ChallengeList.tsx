import { Table } from "react-daisyui";
import ChallengeListRow from "./ChallengeListRow";
import { useEffect, useState } from "react";
import axios from "axios";
import _ from "lodash";
import {User, Challenge as ReturnedChallenge} from "../client/returnedTypes";

export interface Challenge {
	id: string;
	name: string;
	shortDescription: string;
	points: number[];
	uploader: string;
	uploadTime: string;
	uploaderUserId: string;
}

export default function ChallengeList() {
	const init: Challenge[] = [];
	const [challenges, setChallenges] = useState(init);

	async function fetchChallenges() {
		try {
			const response = await axios.get<ReturnedChallenge[]>("/api/challenge/list");
			const userIds: Set<string> = new Set(response.data.map((challenge: any) => challenge.userId));
			console.log("userIds", userIds)
			const userMap: { [key: string]: string } = {};
			// todo: batch request
			const promises = Array.from(userIds).map(async (userId) => {
				const userResponse = await axios.get<User>(`/api/user/by_id/${userId}`);
				userMap[userId] = userResponse.data.username;
			});
			(await Promise.all(promises))
			console.log("userMap", userMap)
			const mapped = response.data.map((challenge) => {
				const points: number[] = challenge.testCases.map((testCase: any) => testCase.points);
				const uploadTime = new Date(challenge.createdAt?._seconds * 1000).toLocaleString();
				return {
					id: challenge.id,
					name: challenge.name,
					shortDescription: challenge.shortDescription,
					uploader: userMap[challenge.userId],
					points: points,
					uploadTime: uploadTime,
					uploaderUserId: challenge.userId,
				};
			});
			const sorted: any[] = _.reverse(_.sortBy(mapped, "uploadTime"));
			setChallenges(sorted);
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		fetchChallenges();
	}, []);

	return (
		<div className="w-full flex flex-col items-center py-8">
			<div className="container mx-auto px-6">
				<h2 className="text-3xl font-bold mb-6 text-center">
					Feladatok
				</h2>
				<div className="overflow-x-auto shadow-lg rounded-lg">
					<Table className="w-full border-0 [&_th]:border-0 [&_td]:border-0">
						<Table.Head className="bg-primary text-primary-content">
							<span className="pl-6">#</span>
							<span>Név</span>
							<span>Leírás</span>
							<span>Pontszámok</span>
							<span>Feltöltötte</span>
							<span>Feltöltés ideje</span>
							<span className="pr-6 text-center">Műveletek</span>
						</Table.Head>

						<Table.Body>
							{challenges.map((challenge: any, index) => (
								<ChallengeListRow challenge={challenge} index={index + 1} key={challenge.id} onDelete={fetchChallenges} />
							))}
						</Table.Body>
					</Table>
				</div>
			</div>
		</div>
	);
}
