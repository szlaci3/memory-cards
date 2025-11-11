import axios from "axios";
import CardList from "components/CardList";
import { useEffect, useState } from "react";
import type { CardFromApi, CardType } from "types/index";

function RateCards() {
	const [cardList, setCardList] = useState<CardType[]>([]);

	useEffect(() => {
		axios
			.get("/cards")
			.then((response) => {
				setCardList(
					response.data.map((card: CardFromApi) => ({
						...card,
						rate: card.rate ? parseInt(card.rate) : card.rate,
						sides: JSON.parse(card.sides),
					})),
				);
			})
			.catch((error) => {
				console.error("Error fetching flashcards:", error);
			});
	}, []);

	const handleRateCard = (card: CardType, rate: number) => {
		const updatedCardList = cardList.map((cardItem) => {
			if (card.id === cardItem.id) {
				return { ...cardItem, rate, reviewedAt: Date.now() };
			}
			return cardItem;
		});

		axios
			.put(`/cards/${card.id}`, {
				...card,
				sides: JSON.stringify(card.sides),
				rate,
				reviewedAt: Date.now(),
			})
			.then(() => {
				setCardList(updatedCardList);
			})
			.catch((error) => {
				console.error("Error updating flashcard:", error);
			});
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
