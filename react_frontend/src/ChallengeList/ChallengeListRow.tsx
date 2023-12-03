import { Table } from "react-daisyui";
import { useNavigate } from "react-router-dom";
import { Challenge } from "./ChallengeList";

export default function ChallengeListRow({ challenge, index }: { challenge: Challenge; index: number }) {
	const navigate = useNavigate();

	return (
		<Table.Row hover className="cursor-pointer" onClick={() => navigate("/editor/" + challenge.id)}>
			<span>{index}</span>
			<span>{challenge.name}</span>
			<span>{challenge.shortDescription}</span>
			<span>{challenge.totalPoints}</span>
			<span>{challenge.uploader}</span>
			<span>{challenge.uploadTime}</span>
		</Table.Row>
	);
}
