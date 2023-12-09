import { CircleNotch } from "@phosphor-icons/react";
import { Button, Navbar, Tooltip } from "react-daisyui";
import { useNavigate } from "react-router-dom";

export default function NavBar() {
	const navigate = useNavigate();

	const loginButton = <></>;

	/*if (signInStatus === "loading") {
		loginButton = <NavBarButtonsLoading />;
	} else if (signInStatus === "error") {
		loginButton = <Button color="error">Auth Error</Button>;
	} else if (signInStatus === "success") {
		if (signInCheckResult.signedIn) {
			loginButton = (
				<NavBarButtonsSignedIn displayName={user?.displayName ?? ""} logout={() => alert("Sign out")} />
			);
		} else {
			loginButton = (
				<NavBarButtonsGuest
					action={() => {
						navigate("/login");
					}}
				/>
			);
		}
	}*/

	return (
		<>
			<Navbar className="fixed z-20 bg-base-100">
				{/*<div className="flex-none">
					<Button shape="square" color="ghost">
						<List size={24} />
					</Button>
        </div>*/}
				<div className="flex-1">
					<Button tag="a" color="ghost" className="normal-case text-xl" onClick={() => navigate("/")}>
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

//@ts-expect-error not-yet-used
function NavBarButtonsLoading() {
	return <CircleNotch className="spinning-slow" size={24} />;
}

//@ts-expect-error not-yet-used
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

//@ts-expect-error not-yet-used
function NavBarButtonsGuest({ action }: { action: () => void }) {
	return (
		<Button color="primary" onClick={action}>
			BEJELENTKEZÉS
		</Button>
	);
}
