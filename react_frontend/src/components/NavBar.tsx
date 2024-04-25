import { jwtDecode } from "jwt-decode";
import { Button, Navbar, Tooltip } from "react-daisyui";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {useState} from "react";

export default function NavBar() {
	const navigate = useNavigate();

	let loginButton = <></>;
	const [displayName, setDisplayName] = useState("");

	if (localStorage.getItem("token")?.trim().length) {
		axios.get(`/api/user/by_id/${(jwtDecode(localStorage.getItem("token")!) as any).userId}`).then(
			(response) => {
				setDisplayName(response.data.username);
			}
		)
		loginButton = (
			<NavBarButtonsSignedIn
				displayName={displayName + ""}
				logout={() => {
					localStorage.clear();
					navigate("/");
				}}
			/>
		);
	} else {
		loginButton = (
			<NavBarButtonsGuest
				action={() => {
					navigate("/");
				}}
			/>
		);
	}

	return (
		<>
			<Navbar className="fixed z-20 bg-base-100">
				{/*<div className="flex-none">
					<Button shape="square" color="ghost">
						<List size={24} />
					</Button>
        </div>*/}
				<div className="flex-1">
					<Button
						tag="a"
						color="ghost"
						className="normal-case text-xl"
						onClick={() => navigate("/challenges")}
					>
						codeHUB
					</Button>
				</div>
				<div className="flex-none gap-2">
					{loginButton}
					{/*
					<Button shape="square" color="ghost">
						<DotsThree size={24} />
					</Button>*/}
				</div>
			</Navbar>
		</>
	);
}

function NavBarButtonsSignedIn({ displayName, logout }: { displayName: string; logout: () => void }) {
	const navigate = useNavigate();

	return (
		<>
			<Button color="primary" onClick={() => navigate("/upload")}>
				Új feladat feltöltése
			</Button>
			<Tooltip message="Kijelentkezés" position="bottom">
				<Button color="info" onClick={logout}>
					{displayName}
				</Button>
			</Tooltip>
		</>
	);
}

function NavBarButtonsGuest({ action }: { action: () => void }) {
	return (
		<Button color="primary" onClick={action}>
			BEJELENTKEZÉS
		</Button>
	);
}
