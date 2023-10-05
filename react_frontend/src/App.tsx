import { BrowserRouter, Route, Routes } from "react-router-dom";
import SolutionEditor from "./SolutionEditor";
import ChallengeList from "./ChallengeList";
import Highscores from "./Highscores";
import Upload from "./Upload";
import Frame from "./components/Frame";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="" element={<Frame />}>
            <Route path="/editor/:id" element={<SolutionEditor />} />
            <Route path="/highscores/:id" element={<Highscores />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/" element={<ChallengeList />} />
          </Route>
          <Route path="*" element="Oops, page not found" />
        </Routes>
      </BrowserRouter>
    </>
  );
}
