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
			//title={challenge.id}
		>
			<span>{index}</span>
			<span>{challenge.name}</span>
			<span>{challenge.shortDescription}</span>
			<span>{challenge.points.join("/")}</span>
			<span>{challenge.uploader}</span>
			<span>{challenge.uploadTime}</span>
			<span>
				{ challenge.uploaderUserId === userId &&
					<>
						<Tooltip message="Szerkesztés">
							<Button
								size="xs"
								color="neutral"
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
								color="neutral"
								onClick={(e) => {
									deleteChallenge();
									e.stopPropagation();
								}}
							>
								<Trash size={16} />
							</Button>
						</Tooltip>
					</>
				}
			</span>
			{/*<span>
				{challenge.uploader === userId && (
					<Tooltip message="Tesztesetek szerkesztése">
						<Button
							size="xs"
							color="neutral"
							onClick={(e) => {
								navigate("/edit/" + challenge.id + "/testcases");
								e.stopPropagation();
							}}
						>
							<NotePencil size={16} />
						</Button>
					</Tooltip>
				)}
			</span>*/}
		</Table.Row>
	);
}
