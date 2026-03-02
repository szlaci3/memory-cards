import "./css/App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import Navigation from "./components/Navigation";
import CardForm from "./pages/CardForm";
import Groups from "./pages/Groups";
import Home from "./pages/Home";
import Full from "./pages/Full";
import Inverse from "./pages/Inverse";
import List from "./pages/List";
import Direct from "./pages/Direct";
import Sentence from "./pages/Sentence";
import SentenceForm from "./pages/SentenceForm";
import SentenceList from "./pages/SentenceList";
import Zin from "./pages/Zin";

function App() {
	return (
		<BrowserRouter>
			<Navigation />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/full" element={<Full />} />
				<Route path="/inverse" element={<Inverse />} />
				<Route path="/list" element={<List />} />
				<Route path="/cardForm" element={<CardForm />} />
				<Route path="/cardForm/:id" element={<CardForm />} />
				<Route path="/groups" element={<Groups />} />
				<Route path="/direct" element={<Direct />} />
				<Route path="/sentence" element={<Sentence />} />
				<Route path="/sentenceForm" element={<SentenceForm />} />
				<Route path="/sentenceForm/:id" element={<SentenceForm />} />
				<Route path="/sentenceList" element={<SentenceList />} />
				<Route path="/zin" element={<Zin />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
