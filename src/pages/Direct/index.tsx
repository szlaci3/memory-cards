import StudySession from "components/StudySession";
import { useEffect, useMemo, useState } from "react";
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
			const now = Date.now();
			const dayInMs = 24 * 60 * 60 * 1000;
			const minuteInMs = 60 * 1000;

			// Calculate dueAt: rate 0 = 10 minutes, rate > 0 = n days
			const dueAt =
				rate === 0
					? now + 10 * minuteInMs // 10 minutes
					: now + rate * dayInMs; // n days

			await db.cards.update(card.id, { rate, dueAt });
			setCardList((prevList) =>
				prevList.map((cardItem) =>
					card.id === cardItem.id ? { ...card, rate, dueAt } : cardItem,
				),
			);
		} catch (error) {
			console.error("Error updating flashcard:", error);
		}
	};

	const dueCount = useMemo(() => {
		const now = Date.now();
		return cardList.filter(
			(card) => typeof card.dueAt === "number" && card.dueAt <= now,
		).length;
	}, [cardList]);

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
					<div className="streak">
						<span>Due cards: {dueCount}</span>
						<span>🔥🔥🔥</span>
					</div>
					<div className="progress-bar">
						<div className="progress-fill" />
					</div>
				</div>
				<StudySession cards={cardList} onRateCard={handleRateCard} />
			</div>
		</div>
	);
}

export default RateCards;
