import { useState, useEffect } from "react";
import type { CardType } from "types/index";
import ReviewCard from "./ReviewCard";
import { formatDueAt } from "utils/utils";

interface ReviewProps {
	cards: CardType[];
	setCards: React.Dispatch<React.SetStateAction<CardType[]>>;
	onRateCard: (card: CardType, rate: number) => Promise<void>;
    onClearUrl: () => void;
}

function Review({ cards, setCards, onRateCard, onClearUrl }: ReviewProps) {
	const [currentCardIndex, setCurrentCardIndex] = useState(0);


	useEffect(() => {
		// Ensure index is valid when cards change
		if (cards.length === 0) {
			setCurrentCardIndex(0);
		} else if (currentCardIndex >= cards.length) {
			setCurrentCardIndex(0); // Wrap around or reset
		}
	}, [cards, currentCardIndex]);

	if (cards.length === 0) {
		return <div className="no-cards-message">No due cards in this category!</div>;
	}

	const currentCard = cards[currentCardIndex];

    const handleNextCard = () => {
        onClearUrl();
        setCurrentCardIndex((prev) => {
            const nextIndex = prev + 1;
            return nextIndex >= cards.length ? 0 : nextIndex;
        });
    }

	const handleRate = async (rate: number) => {
		if (!currentCard) return;

		// Call parent to update DB
		await onRateCard(currentCard, rate);

        onClearUrl();

		// Remove from batch
		setCards((prev) => {
            const newCards = prev.filter((c) => c.id !== currentCard.id);
            return newCards;
        });
        // If we remove the current card, the next card slides into the current index.
        // If we were at the last index, wrap around to 0.
        setCurrentCardIndex(prev => {
            if (prev >= cards.length - 1) return 0;
            return prev;
        })
	};

	const handleMove = (step: number) => {
        if (!currentCard) return;

        onClearUrl();
        setCards((prev) => {
            const batch = [...prev];
            const cardToMove = batch[currentCardIndex];
            
            // Remove from current position
            const newBatchWithoutCard = batch.filter((_, i) => i !== currentCardIndex);
            
            // Calculate new position relative to (current position + step)
            // Since the card is removed first, we calculate based on the new length + 1 (original length)
            const newLength = newBatchWithoutCard.length;
            const finalLength = newLength + 1;
            const insertIndex = (currentCardIndex + step) % finalLength;
            
            const newBatch = [...newBatchWithoutCard];
            newBatch.splice(insertIndex, 0, cardToMove);
            return newBatch;
        });

        // Iteration not needed. It proceeds to next card bc current was removed (if insertIndex > current index)
	};


	return (
		<div className="review-container">
			<ReviewCard
				card={currentCard}
				onRate={handleRate}
				onMove={handleMove}
				onSkip={handleNextCard} // Last button
                allCards={cards}
                category={currentCard.category || "EN to NL"}
			/>
            <div className="debug-info" style={{marginTop: 20, fontSize: '0.8em', color: '#666'}}>
                <div>Index: {currentCardIndex}</div>
                <div>Rate: {currentCard.rate}</div>
                <div>{formatDueAt(currentCard.dueAt)}</div>
            </div>
		</div>
	);
}

export default Review;
