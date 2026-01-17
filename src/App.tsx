import "./css/App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import Navigation from "./components/Navigation";
import CardForm from "./pages/CardForm";
import Groups from "./pages/Groups";
import Home from "./pages/Home";
import Inverse from "./pages/Inverse";
import List from "./pages/List";
import Direct from "./pages/Direct";

function App() {
	return (
		<BrowserRouter>
			<Navigation />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/inverse" element={<Inverse />} />
				<Route path="/list" element={<List />} />
				<Route path="/cardForm" element={<CardForm />} />
				<Route path="/cardForm/:id" element={<CardForm />} />
				<Route path="/groups" element={<Groups />} />
				<Route path="/direct" element={<Direct />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
