import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { CardCategory, CardProps, CardType } from "types/index";
import { addToDefaultGroup } from "utils/db";

function Card({
	card,
	onRateCard,
	allCards,
	selectedCategory,
	onCategoryChange,
}: CardProps) {
	const [revealCount, setRevealCount] = useState(0);
	const [inputValue, setInputValue] = useState<string>("1");
	const navigate = useNavigate();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <I need the stale value of inputValue>
	useEffect(() => {
		// Inp remains from prev card. If btn_2 == btn_3, change btn_2.
		if (card.rate === parseInt(inputValue)) {
			setInputValue(card.rate === 1 ? "2" : "1");
		}
		// rate 0 also makes btn_3 '2', so change btn_2 to '1'.
		if (card.rate === 0 && inputValue === "2") {
			setInputValue("1");
		}
		setRevealCount(0); // Matters when switching groups

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [card]);

	const handleShowNextSide = () => {
		setRevealCount((prev) => prev + 1);
	};

	const handleRateCard = (rate: string | number) => {
		const numericRate =
			typeof rate === "string" ? (rate === "" ? 1 : parseInt(rate)) : rate;
		onRateCard(numericRate);
		setRevealCount(0);
	};

	const onEditCard = (cardToEdit: CardType) => {
		navigate(`/cardForm/${cardToEdit.id}`);
	};

	const option3 = card.rate === 0 ? 2 : card.rate || 2;
	const option4 = Math.max(3, Math.floor(option3 * 1.4));

	const category = card.category || "EN to NL";
	const isDevCategory = category === "Dev";

	// Check which categories have cards
	// For "NL to EN", check if there are any "EN to NL" cards
	const categoriesWithCards: Set<CardCategory> = new Set();
	for (const c of allCards) {
		categoriesWithCards.add(c.category || "EN to NL");
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

	const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newCategory = e.target.value as CardCategory;
		setRevealCount(0);
		onCategoryChange(newCategory);
	};

	const renderSide = (side: string, index: number) => (
		// biome-ignore lint/suspicious/noArrayIndexKey: <Sides are static>
		<div key={index} className={`side ${index % 2 === 0 ? "" : "side-yellow"}`}>
			<h2>{side}</h2>
		</div>
	);

	return (
		<div className="flashcard">
			<div>
				<div className="language-indicator">
					<select
						className="category-button"
						value={selectedCategory}
						onChange={handleCategoryChange}
						aria-label="Select card category"
					>
						{allCategories.map((cat) => (
							<option
								key={cat}
								value={cat}
								disabled={!categoriesWithCards.has(cat)}
							>
								{cat}
							</option>
						))}
					</select>
				</div>

				<div className={`card-content ${isDevCategory ? "dev-content" : ""}`}>
					{card.sides.slice(0, revealCount + 1).map(renderSide)}
				</div>

				<div className="controls">
					{card.sides.length - 1 > revealCount && (
						<button
							type="button"
							className="show-button"
							onClick={handleShowNextSide}
						>
							{revealCount ? "Show Next Side" : "Show Answer"}
						</button>
					)}

					{revealCount > 0 && (
						<div className="rating-buttons">
							<button type="button" onClick={() => handleRateCard(0)}>
								<div>10</div>
								<div>min</div>
							</button>
							<div className="interactive">
								<input
									type="number"
									value={inputValue}
									onChange={(ev) => {
										const num =
											ev.target.value === ""
												? ""
												: Math.max(
														1,
														Math.min(999, +ev.target.value),
													).toString();
										setInputValue(num);
									}}
									onFocus={() => setInputValue("")}
									min={1}
									max={999}
								/>
								<button
									type="button"
									onClick={() => handleRateCard(inputValue)}
									className="interactive-button"
								>
									<div>{inputValue || "0"}</div>
									<div>
										day{inputValue === "" || inputValue === "1" ? "" : "s"}
									</div>
								</button>
							</div>
							<button type="button" onClick={() => handleRateCard(option3)}>
								<div>{option3}</div>
								<div>day{option3 === 1 ? "" : "s"}</div>
							</button>
							<button type="button" onClick={() => handleRateCard(option4)}>
								<div>{option4}</div>
								<div>days</div>
							</button>
						</div>
					)}

					<div className="difficulty-dots">
						{[1, 2, 3].map((dot) => (
							<div key={dot} className="dot" />
						))}
					</div>

					<div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "10px" }}>
						<button
							type="button"
							onClick={async () => {
								const result = await addToDefaultGroup(card.id);
								alert(result.message);
							}}
							className="add-to-default-btn winter"
							style={{ padding: "8px 16px", color: "white" }}
						>
							Add to Default
						</button>
						<button type="button" onClick={() => onEditCard(card)}>
							Edit
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Card;
