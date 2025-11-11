import { useEffect, useState } from "react";
import type { CardListProps } from "src/types";
import { selectNextCard } from "utils/utils";
import Card from "./Card";

function CardList({ cards, onRateCard }: CardListProps) {
	const [currentCardIndex, setCurrentCardIndex] = useState(() =>
		selectNextCard(cards),
	);

	// Update card selection when cards array changes
	useEffect(() => {
		if (cards.length > 0) {
			setCurrentCardIndex(selectNextCard(cards));
		}
	}, [cards]);

	const handleRateCard = (rating: number) => {
		onRateCard(cards[currentCardIndex], rating);
		setCurrentCardIndex((prev) => selectNextCard(cards, prev));
	};

	const currentCard = cards[currentCardIndex];

	return (
		<div className="card-list">
			{currentCard && <Card card={currentCard} onRateCard={handleRateCard} />}
		</div>
	);
}

export default CardList;
