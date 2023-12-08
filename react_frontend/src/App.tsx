import { BrowserRouter, Route, Routes } from "react-router-dom";
import SolutionEditor from "./SolutionEditor/SolutionEditor";
import ChallengeList from "./ChallengeList/ChallengeList";
import Highscores from "./Highscores/Highscores";
import Upload from "./NewChallenge/Upload";
import Frame from "./components/Frame";
import EditTestCases from "./EditTestCases/EditTestCases";
import { FirebaseAppProvider } from "reactfire";
import { firebaseConfig } from "@lib/firebase";

export default function App() {
	return (
		<>
			<FirebaseAppProvider firebaseConfig={firebaseConfig}>
				<BrowserRouter>
					<Routes>
						<Route path="" element={<Frame />}>
							<Route path="/editor/:id" element={<SolutionEditor />} />
							<Route path="/highscores/:id" element={<Highscores />} />
							<Route path="/upload" element={<Upload />} />
							<Route path="/edit/:id/testcases" element={<EditTestCases />} />
							<Route path="/" element={<ChallengeList />} />
						</Route>
						<Route path="*" element="Oops, page not found" />
					</Routes>
				</BrowserRouter>
			</FirebaseAppProvider>
		</>
	);
}
