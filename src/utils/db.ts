import Dexie, { type Table } from "dexie";
import { coldStartCards } from "src/pages/Home/coldStartCards";
import type { CardType, GroupType } from "types/index";

export class CardDatabase extends Dexie {
	cards!: Table<CardType, string>;
	groups!: Table<GroupType, string>;

	constructor() {
		super("CardDatabase");

		// Old schema
		this.version(3).stores({
			cards: "id, reviewedAt, rate",
		});

		// New schema
		this.version(4)
			.stores({
				cards: "id, dueAt, rate",
			})
			.upgrade((tx) => {
				// Safely remove reviewedAt from every card
				return tx
					.table("cards")
					.toCollection()
					.modify((card: CardType & { reviewedAt?: number }) => {
						// biome-ignore lint/performance/noDelete: <explanation>
						delete card.reviewedAt;
					});
			});

		// Schema with groups
		this.version(5).stores({
			cards: "id, dueAt, rate",
			groups: "id, name",
		});
	}
}

export const db = new CardDatabase();

// Initialize database with cold start cards if empty
export async function initializeDatabase() {
	const count = await db.cards.count();
	if (count === 0) {
		await db.cards.bulkAdd(coldStartCards);
	}
}
