import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { CardCategory, CardType } from "types/index";
import { addToDefaultGroup } from "utils/db";

interface ReviewCardProps {
	card: CardType;
	onRate: (rate: number) => void;
	onMove: (step: number) => void;
	onSkip: () => void;
	allCards: CardType[];
	category: CardCategory;
}

function ReviewCard({
	card,
	onRate,
	onMove,
	onSkip,
}: ReviewCardProps) {
	const [revealCount, setRevealCount] = useState(0);
	const [inputValue, setInputValue] = useState<string>("1");
    const navigate = useNavigate();

    const onEditCard = (cardToEdit: CardType) => {
        navigate(`/cardForm/${cardToEdit.id}`);
    };

	useEffect(() => {
		// Reset state when card changes
		if (card.rate === parseInt(inputValue)) {
			setInputValue(card.rate === 1 ? "2" : "1");
		}
		if (card.rate === 0 && inputValue === "2") {
			setInputValue("1");
		}
		setRevealCount(0);
	}, [card]);

	const handleShowNextSide = () => {
		setRevealCount((prev) => prev + 1);
	};

	const handleRateCard = (rate: string | number) => {
		const numericRate =
			typeof rate === "string" ? (rate === "" ? 1 : parseInt(rate)) : rate;
		onRate(numericRate);
		setRevealCount(0);
	};

	const option3 = card.rate === 0 ? 2 : card.rate || 2;
	const option4 = Math.max(3, Math.floor(option3 * 1.4));

	const isDevCategory = card.category === "Dev";

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
					<span className="category-label">{card.category || "EN to NL"}</span>
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
						<div className="review-buttons">
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

							<div className="movement-buttons">
								<button
                                    type="button"
                                    className="winter"
                                    onClick={() => onMove(7)}
                                >
                                    #7
                                </button>
                                <button
                                    type="button"
                                    className="winter"
                                    onClick={() => onMove(30)}
                                >
                                    #30
                                </button>
                                <button
                                    type="button"
                                    className="winter"
                                    onClick={onSkip}
                                >
                                    Last
                                </button>
							</div>
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
						<button type="button" className="action-button primary" onClick={() => onEditCard(card)}>
							Edit
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ReviewCard;
