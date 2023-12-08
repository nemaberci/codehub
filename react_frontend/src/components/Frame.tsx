import { Outlet } from "react-router-dom";
import { AuthProvider, useFirebaseApp } from "reactfire";
import { getAuth } from "firebase/auth";
import NavBar from "./NavBar";

export default function Frame() {
	const authSdk = getAuth(useFirebaseApp());
	return (
		<>
			<AuthProvider sdk={authSdk}>
				<NavBar />
				<div className="pt-16 h-screen">
					<Outlet />
				</div>
			</AuthProvider>
		</>
	);
}
