export type CardCategory = "EN to NL" | "NL to EN" | "Question NL" | "Dev";

export interface CardType {
	id: string;
	sides: string[];
	dueAt?: number | null;
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
