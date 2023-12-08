import { CircleNotch } from "@phosphor-icons/react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Button, Navbar, Tooltip } from "react-daisyui";
import { useNavigate } from "react-router-dom";
import { useAuth, useSigninCheck, useUser } from "reactfire";

const googleAuthProvider = new GoogleAuthProvider();

export default function NavBar() {
	const navigate = useNavigate();

	const auth = useAuth();

	const { data: user } = useUser();
	const { status: signInStatus, data: signInCheckResult } = useSigninCheck();

	let loginButton = <></>;

	if (signInStatus === "loading") {
		loginButton = <NavBarButtonsLoading />;
	} else if (signInStatus === "error") {
		loginButton = <Button color="error">Auth Error</Button>;
	} else if (signInStatus === "success") {
		if (signInCheckResult.signedIn) {
			loginButton = (
				<NavBarButtonsSignedIn displayName={user?.displayName ?? ""} logout={() => auth.signOut()} />
			);
		} else {
			loginButton = (
				<NavBarButtonsGuest
					action={() => {
						signInWithPopup(auth, googleAuthProvider);
					}}
				/>
			);
		}
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

function NavBarButtonsLoading() {
	return <CircleNotch className="spinning-slow" size={24} />;
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
