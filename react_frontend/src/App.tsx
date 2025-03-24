import { RouterProvider, createBrowserRouter, redirect } from "react-router-dom";
import SolutionEditor from "./SolutionEditor/SolutionEditor";
import ChallengeList from "./ChallengeList/ChallengeList";
import Highscores from "./Highscores/Highscores";
import Upload from "./NewChallenge/Upload";
import Frame from "./components/Frame";
import EditTestCases from "./EditTestCases/EditTestCases";
import Login from "./Login/Login";
import axios from "axios";
import AuthSuccess from "./Login/AuthSuccess.tsx";
import { isTokenValid, clearAuth } from "./utils/auth";

axios.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token?.trim().length) {
			config.headers.Authorization = "Bearer " + localStorage.getItem("token");
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

axios.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		console.log(error);
		if (error.response.status === 401 || error.response.status === 403) {
			clearAuth();
		}
		return Promise.reject(error);
	}
);

async function authLoader() {
	if (!isTokenValid()) {
		clearAuth();
		return redirect("/");
	}
	return null;
}

const router = createBrowserRouter([
	{
		path: "",
		element: <Frame />,
		children: [
			{
				path: "/editor/:id",
				element: <SolutionEditor reference={false} />,
				loader: authLoader,
			},
			{
				path: "/highscores/:id",
				element: <Highscores />,
				loader: authLoader,
			},
			{
				path: "/upload",
				element: <Upload />,
				loader: authLoader,
			},
			{
				path: "/",
				element: <Login />,
				//loader:authLoader
			},
			{
				path: "/edit/:id/testcases",
				element: <EditTestCases />,
				loader: authLoader,
			},
			{
				path: "/challenges",
				element: <ChallengeList />,
				loader: authLoader,
			},
			{
				path: "/edit/:id/solution",
				element: <SolutionEditor reference={true} />,
				loader: authLoader,
			},
		],
	},
	{
		path: "/auth/success",
		element: <AuthSuccess />,
	},
	{
		path: "*",
		element: "Oops, page not found",
		//loader:authLoader
	},
]);

export default function App() {
	return <RouterProvider router={router} />;
}
