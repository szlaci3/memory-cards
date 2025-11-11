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
 * Selects the next card to review based on reviewedAt and rate properties.
 * Priority:
 * 1. Cards never reviewed (no reviewedAt or rate)
 * 2. Cards that are due for review (reviewedAt + rate days <= now)
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
	const dayInMs = 24 * 60 * 60 * 1000;

	// Calculate priority score for each card
	const cardScores = cards.map((card, index) => {
		if (excludeIndex !== null && index === excludeIndex) {
			return { index, score: -Infinity }; // Exclude this card
		}

		// Never reviewed - highest priority
		if (!card.reviewedAt || card.rate === null || card.rate === undefined) {
			return { index, score: Infinity };
		}

		// Calculate due date: reviewedAt + (rate * days in ms)
		const dueDate = card.reviewedAt + card.rate * dayInMs;
		const isDue = dueDate <= now;

		// Due cards get high priority (earlier due dates = higher priority)
		if (isDue) {
			// Use negative due date so earlier dates have higher scores
			return { index, score: -dueDate };
		}

		// Not due yet - lower priority (earlier due dates still prioritized)
		return { index, score: -dueDate };
	});

	// Sort by score (descending) and return the index of the highest scoring card
	cardScores.sort((a, b) => b.score - a.score);
	return cardScores[0].index;
};
