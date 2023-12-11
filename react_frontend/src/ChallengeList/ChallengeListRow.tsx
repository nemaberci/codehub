import { Button, Table, Tooltip } from "react-daisyui";
import { useNavigate } from "react-router-dom";
import { Challenge } from "./ChallengeList";
import { jwtDecode } from "jwt-decode";
import { NotePencil } from "@phosphor-icons/react";

export default function ChallengeListRow({ challenge, index }: { challenge: Challenge; index: number }) {
	const navigate = useNavigate();

	const userId: string = jwtDecode(localStorage.getItem("token")!).userId;

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
