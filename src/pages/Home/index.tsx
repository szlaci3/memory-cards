import CardList from "components/CardList";
import { useEffect, useState } from "react";
import type { CardType } from "types/index";
import { db, initializeDatabase } from "utils/db";

function RateCards() {
	const [cardList, setCardList] = useState<CardType[]>([]);

	useEffect(() => {
		async function loadCards() {
			try {
				await initializeDatabase();
				const cards = await db.cards.toArray();
				setCardList(cards);
			} catch (error) {
				console.error("Error fetching flashcards:", error);
			}
		}
		loadCards();
	}, []);

	const handleRateCard = async (card: CardType, rate: number) => {
		try {
			const updatedCard = { ...card, rate, reviewedAt: Date.now() };
			await db.cards.update(card.id, updatedCard);
			setCardList((prevList) =>
				prevList.map((cardItem) =>
					card.id === cardItem.id ? updatedCard : cardItem,
				),
			);
		} catch (error) {
			console.error("Error updating flashcard:", error);
		}
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
					<h1>SmartAnki Pro</h1>
					<div className="streak">
						<span>Daily Streak: 42</span>
						<span>🔥🔥🔥</span>
					</div>
					<div className="progress-bar">
						<div className="progress-fill" />
					</div>
				</div>
				<CardList cards={cardList} onRateCard={handleRateCard} />
			</div>
		</div>
	);
}

export default RateCards;
