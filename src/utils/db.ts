import Dexie, { type Table } from "dexie";
import { coldStartCards } from "src/pages/Home/coldStartCards";
import type { CardType } from "types/index";

export class CardDatabase extends Dexie {
	cards!: Table<CardType, string>;

	constructor() {
		super("CardDatabase");
		this.version(1).stores({
			cards: "id, reviewedAt, rate",
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
