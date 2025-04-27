import {Button, Table, Tooltip} from "react-daisyui";
import { useNavigate } from "react-router-dom";
import { Challenge } from "./ChallengeList";
import {NotePencil, Trash} from "@phosphor-icons/react";
import {jwtDecode} from "jwt-decode";
import axios from "axios";

export default function ChallengeListRow({ challenge, index, onDelete }: { challenge: Challenge; index: number, onDelete: () => Promise<void> }) {
	const navigate = useNavigate();

	const userId: string = (jwtDecode(localStorage.getItem("token")!) as {userId: string}).userId;
	const deleteChallenge = async () => {
		try {
			await axios.delete(`/api/challenge/delete/${challenge.id}`);
			await onDelete();
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<Table.Row
			hover
			className="cursor-pointer"
			onClick={() => navigate("/editor/" + challenge.id)}
		>
			<span className="pl-6">{index}</span>
			<span>{challenge.name}</span>
			<span>{challenge.shortDescription}</span>
			<span>{challenge.points.join(" / ")}</span>
			<span>{challenge.uploader}</span>
			<span>{challenge.uploadTime}</span>
			<span className="pr-6 flex justify-center items-center h-full">
				{challenge.uploaderUserId === userId && (
					<div className="flex justify-center items-center space-x-2 h-full">
						<Tooltip message="Szerkesztés">
							<Button
								size="xs"
								color="primary"
								onClick={(e) => {
									navigate("/edit/" + challenge.id + "/testcases");
									e.stopPropagation();
								}}
							>
								<NotePencil size={16} />
							</Button>
						</Tooltip>
						<Tooltip message="Törlés">
							<Button
								size="xs"
								color="error"
								onClick={(e) => {
									deleteChallenge();
									e.stopPropagation();
								}}
							>
								<Trash size={16} />
							</Button>
						</Tooltip>
					</div>
				)}
			</span>
		</Table.Row>
	);
}
