import type { CardType } from "types/index";

export const rand = (size: number, exclude: number | null = null) => {
	if (size === 1) {
		return 0;
	}
	let result: number;
	do {
		result = Math.floor(Math.random() * size);
	} while (result === exclude);
	return result;
};

/**
 * Selects the next card to review based on dueAt property.
 * Priority:
 * 1. Cards never reviewed (no dueAt)
 * 2. Cards that are due for review (dueAt <= now)
 * 3. Cards with the earliest due date
 */
export const selectNextCard = (
	cards: CardType[],
	excludeIndex: number | null = null,
): number => {
	if (cards.length === 0) {
		return -1;
	}
	if (cards.length === 1) {
		return 0;
	}

	const now = Date.now();

	// Calculate priority score for each card
	const cardScores = cards.map((card, index) => {
		if (excludeIndex !== null && index === excludeIndex) {
			return { index, score: -Infinity }; // Exclude this card
		}

		// Never reviewed - highest priority
		if (!card.dueAt) {
			return { index, score: Infinity };
		}

		const isDue = card.dueAt <= now;

		// Due cards get high priority (earlier due dates = higher priority)
		// Use negative due date so earlier dates have higher scores
		// Due cards are prioritized over future cards by adding a large offset
		return { 
			index, 
			score: isDue ? -card.dueAt : -card.dueAt - 1000000000000 
		};
	});

	// Sort by score (descending) and return the index of the highest scoring card
	cardScores.sort((a, b) => b.score - a.score);
	return cardScores[0].index;
};
