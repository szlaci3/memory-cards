export type CardCategory = "EN to NL" | "NL to EN" | "Question NL" | "Dev";

interface BaseCard {
	id: string;
	reviewedAt?: number | null;
}

export interface CardFromApi extends BaseCard {
	sides: string; // JSON string from API
	rate?: string | null;
	category?: CardCategory;
}

export interface CardType extends BaseCard {
	sides: string[]; // Parsed array
	rate?: number | null;
	category?: CardCategory;
}

export interface CardProps {
	card: CardType;
	onRateCard: (rate: number) => void;
	allCards: CardType[];
	selectedCategory: CardCategory;
	onCategoryChange: (category: CardCategory) => void;
}

export interface CardListProps {
	cards: CardType[];
	onRateCard: (card: CardType, rate: number) => void;
}
