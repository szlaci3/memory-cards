import "./css/App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import Navigation from "./components/Navigation";
import CardForm from "./pages/CardForm";
import Groups from "./pages/Groups";
import Home from "./pages/Home";
import List from "./pages/List";

function App() {
	return (
		<BrowserRouter>
			<Navigation />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/list" element={<List />} />
				<Route path="/cardForm" element={<CardForm />} />
				<Route path="/cardForm/:id" element={<CardForm />} />
				<Route path="/groups" element={<Groups />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
