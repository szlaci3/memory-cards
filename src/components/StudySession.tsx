import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import type { CardCategory, CardType, StudySessionProps } from "src/types";
import { selectNextCard } from "utils/utils";
import Card from "./Card";

function StudySession({ cards, onRateCard }: StudySessionProps) {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const initialCardId = searchParams.get("cardId") || undefined;
	const [selectedCategory, setSelectedCategory] =
		useState<CardCategory>("EN to NL");
	const [filteredCards, setFilteredCards] = useState<CardType[]>([]);
	const [currentCardIndex, setCurrentCardIndex] = useState<number>(-1);

	// Filter cards by category
	useEffect(() => {
		let filtered: CardType[];

		if (selectedCategory === "NL to EN") {
			// For "NL to EN", show "EN to NL" cards with inverted sides
			const enToNlCards = cards.filter(
				(card) => (card.category || "EN to NL") === "EN to NL",
			);
			// Create inverted versions: swap sides[0] and sides[1], keep rest the same
			filtered = enToNlCards.map((card) => ({
				...card,
				sides:
					card.sides.length >= 2
						? [card.sides[1], card.sides[0], ...card.sides.slice(2)]
						: card.sides,
			}));
		} else {
			filtered = cards.filter(
				(card) => (card.category || "EN to NL") === selectedCategory,
			);
		}

		setFilteredCards(filtered);

		// If selected category has no cards, switch to first available category
		if (filtered.length === 0 && cards.length > 0) {
			const categoriesWithCards: Set<CardCategory> = new Set();
			for (const card of cards) {
				categoriesWithCards.add(card.category || "EN to NL");
			}
			// If there are "EN to NL" cards, "NL to EN" should be available
			if (categoriesWithCards.has("EN to NL")) {
				categoriesWithCards.add("NL to EN");
			}
			const allCategories: CardCategory[] = [
				"EN to NL",
				"NL to EN",
				"Question NL",
				"Dev",
			];
			const firstAvailable = allCategories.find((cat) =>
				categoriesWithCards.has(cat),
			);
			if (firstAvailable) {
				setSelectedCategory(firstAvailable);
			}
		}
	}, [cards, selectedCategory]);

	// Handle initial card ID from query parameter
	useEffect(() => {
		if (initialCardId && cards.length > 0) {
			const card = cards.find((c) => c.id === initialCardId);
			if (card) {
				// Set the category to match the card's category
				// If card is "EN to NL", we could show it in "NL to EN" mode, but for now
				// we'll show it in its original category
				setSelectedCategory(card.category || "EN to NL");
			}
		}
	}, [initialCardId, cards]);

	// Update card selection when filtered cards change
	useEffect(() => {
		if (filteredCards.length > 0) {
			// If we have an initialCardId, try to find and select that card
			if (initialCardId) {
				const cardIndex = filteredCards.findIndex(
					(c) => c.id === initialCardId,
				);
				if (cardIndex >= 0) {
					setCurrentCardIndex(cardIndex);
					return;
				}
			}
			// Otherwise, use the normal selection algorithm
			setCurrentCardIndex(selectNextCard(filteredCards));
		} else {
			setCurrentCardIndex(-1);
		}
	}, [filteredCards, initialCardId]);

	const handleCategoryChange = (category: CardCategory) => {
		setSelectedCategory(category);
	};

	const handleRateCard = (rating: number) => {
		if (currentCardIndex >= 0 && currentCardIndex < filteredCards.length) {
			const displayedCard = filteredCards[currentCardIndex];
			// If we're in "NL to EN" mode, find the original card to rate
			// (the displayed card has inverted sides, but we need to rate the original)
			const cardToRate =
				selectedCategory === "NL to EN"
					? cards.find((c) => c.id === displayedCard.id) || displayedCard
					: displayedCard;
			onRateCard(cardToRate, rating);
			setCurrentCardIndex((prev) => selectNextCard(filteredCards, prev));

			// Remove initialCardId from URL after rating if it exists
			if (initialCardId) {
				navigate("/", { replace: true });
			}
		}
	};

	const currentCard =
		currentCardIndex >= 0 && currentCardIndex < filteredCards.length
			? filteredCards[currentCardIndex]
			: null;

	return (
		<div className="card-list">
			{currentCard && (
				<Card
					card={currentCard}
					onRateCard={handleRateCard}
					allCards={cards}
					selectedCategory={selectedCategory}
					onCategoryChange={handleCategoryChange}
				/>
			)}
		</div>
	);
}

export default StudySession;
