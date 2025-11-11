import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { CardProps, CardType } from "types/index";

function Card({ card, onRateCard }: CardProps) {
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
	}, [card]);

	const handleShowNextSide = () => {
		setRevealCount((prev) => prev + 1);
	};

	const handleRateCard = (rate: string) => {
		onRateCard(rate === "" ? 1 : parseInt(rate));
		setRevealCount(0);
	};

	const onEditCard = (card: CardType) => {
		navigate(`/cardForm/${card.id}`);
	};

	const option3 = card.rate === 0 ? 2 : card.rate || 2;
	const option4 = Math.max(3, Math.floor(option3 * 1.4));

	return (
		<div className="flashcard">
			<div>
				<div className="language-indicator">
					<span>EN → NL</span>
				</div>

				<div className="card-content">
					{card.sides
						.slice(0, revealCount + 1)
						.map((side: string, index: number) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: <Sides are static>
							<div key={index} className="side">
								<h2>{side}</h2>
							</div>
						))}
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
							<button type="button" onClick={() => handleRateCard("0")}>
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
							<button
								type="button"
								onClick={() => handleRateCard(option3.toString())}
							>
								<div>{option3}</div>
								<div>day{option3 === 1 ? "" : "s"}</div>
							</button>
							<button
								type="button"
								onClick={() => handleRateCard(option4.toString())}
							>
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

					<button type="button" onClick={() => onEditCard(card)}>
						Edit
					</button>
				</div>
			</div>
		</div>
	);
}

export default Card;
