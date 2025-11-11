import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { CardType } from "types/index";
import { db, initializeDatabase } from "utils/db";
import "css/App.css";

function List() {
	const [cards, setCards] = useState<CardType[]>([]);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [filteredCards, setFilteredCards] = useState<CardType[]>([]);
	const navigate = useNavigate();

	useEffect(() => {
		async function loadCards() {
			try {
				await initializeDatabase();
				const allCards = await db.cards.toArray();
				setCards(allCards);
			} catch (error) {
				console.error("Error fetching cards:", error);
			}
		}
		loadCards();
	}, []);

	useEffect(() => {
		if (searchQuery.trim() === "") {
			setFilteredCards(cards);
		} else {
			const query = searchQuery.toLowerCase();
			const filtered = cards.filter((card) =>
				card.sides.some((side) => side.toLowerCase().includes(query)),
			);
			setFilteredCards(filtered);
		}
	}, [searchQuery, cards]);

	const formatRate = (rate: number | null | undefined): string => {
		if (rate === null || rate === undefined) {
			return "Not reviewed";
		}
		if (rate === 0) {
			return "10 min";
		}
		if (rate === 1) {
			return "1 day";
		}
		return `${rate} days`;
	};

	const handleDeleteAll = async () => {
		if (
			confirm(
				"Are you sure you want to delete ALL cards? This action cannot be undone.",
			)
		) {
			try {
				await db.cards.clear();
				setCards([]);
			} catch (error) {
				console.error("Error deleting all cards:", error);
			}
		}
	};

	const handleEdit = (cardId: string, e: React.MouseEvent) => {
		e.stopPropagation();
		navigate(`/cardForm/${cardId}`);
	};

	const handleDelete = async (cardId: string, e: React.MouseEvent) => {
		e.stopPropagation();
		if (confirm("Are you sure you want to delete this card?")) {
			try {
				await db.cards.delete(cardId);
				setCards((prevCards) => prevCards.filter((card) => card.id !== cardId));
			} catch (error) {
				console.error("Error deleting card:", error);
			}
		}
	};

	const handleCardClick = (cardId: string) => {
		navigate(`/?cardId=${cardId}`);
	};

	return (
		<div className="app-container">
			<div className="background">
				<div className="background-base" />
				<div className="background-middle">
					<div className="diagonal-section-middle" />
				</div>
				<div className="background-top">
					<div className="diagonal-section-top" />
				</div>
			</div>

			<div className="content">
				<div className="header">
					<h1>Card List</h1>
					<div className="list-controls">
						<input
							type="text"
							placeholder="Search cards..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="search-input"
						/>
						<button
							type="button"
							onClick={handleDeleteAll}
							className="delete-all-button"
						>
							Delete All Cards
						</button>
					</div>
					<div className="card-count">
						Showing {filteredCards.length} of {cards.length} cards
					</div>
				</div>

				<div className="cards-list-container">
					{filteredCards.length === 0 ? (
						<div className="no-cards-message">
							{searchQuery.trim() === ""
								? "No cards found. Create your first card!"
								: "No cards match your search."}
						</div>
					) : (
						filteredCards.map((card) => (
							<div
								key={card.id}
								className="card-list-item"
								onClick={() => handleCardClick(card.id)}
								role="button"
								tabIndex={0}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault();
										handleCardClick(card.id);
									}
								}}
							>
								<div className="card-list-content">
									<div className="card-list-side">
										{card.sides[0] || "Empty card"}
									</div>
									<div className="card-list-rate">{formatRate(card.rate)}</div>
								</div>
								<div className="card-list-actions">
									<button
										type="button"
										onClick={(e) => handleEdit(card.id, e)}
										className="edit-button"
									>
										Edit
									</button>
									<button
										type="button"
										onClick={(e) => handleDelete(card.id, e)}
										className="delete-button"
									>
										Delete
									</button>
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
}

export default List;

