import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { SentenceType } from "types/index";
import { db } from "utils/db";
import "css/App.css";

interface SentencePracticeProps {
	direction: "forward" | "reverse";
}

function SentencePractice({ direction }: SentencePracticeProps) {
	const [batch, setBatch] = useState<SentenceType[]>([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [completedWordsIndex, setCompletedWordsIndex] = useState(0);
	const [inputValue, setInputValue] = useState<string>("1");
	const navigate = useNavigate();

	const pageTitle = direction === "forward" ? "Sentence Practice" : "Zin Practice";

	// Load due sentences
	useEffect(() => {
		async function loadSentences() {
			try {
				const allSentences = await db.sentences.toArray();
				const now = Date.now();
				const dueList = allSentences.filter((s) => {
					return typeof s.dueAt === "number" && s.dueAt <= now;
				});
				setBatch(dueList);
			} catch (error) {
				console.error("Error fetching sentences:", error);
			}
		}
		loadSentences();
	}, []);

	const currentSentence = batch[currentIndex];
	
	const promptText = currentSentence 
		? (direction === "forward" ? currentSentence.original : currentSentence.translation) 
		: "";
	const targetText = currentSentence 
		? (direction === "forward" ? currentSentence.translation : currentSentence.original) 
		: "";
		
	const words = targetText.trim() ? targetText.trim().split(/\s+/) : [];

	useEffect(() => {
		setCompletedWordsIndex(0);
		if (currentSentence) {
			setInputValue(currentSentence.rate === 1 ? "2" : "1");
			if (currentSentence.rate === 0) setInputValue("1");
		}
	}, [currentSentence]);

	// Auto-advance if a word has no alphanumeric characters
	useEffect(() => {
		if (!currentSentence) return;
		if (completedWordsIndex < words.length) {
			const currentWord = words[completedWordsIndex];
			const match = currentWord.match(/[a-z0-9]/i);
			if (!match) {
				setCompletedWordsIndex((prev) => prev + 1);
			}
		}
	}, [completedWordsIndex, words, currentSentence]);

	// Handle keypresses for typing the first letter
	useEffect(() => {
		if (!currentSentence) return;
		if (completedWordsIndex >= words.length) return; // Fully revealed

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.ctrlKey || e.altKey || e.metaKey) return;
			if (e.key.length !== 1) return;

			const currentWord = words[completedWordsIndex];
			const match = currentWord.match(/[a-z0-9]/i);
			const expectedChar = match ? match[0].toLowerCase() : null;

			if (expectedChar && e.key.toLowerCase() === expectedChar) {
				setCompletedWordsIndex((prev) => prev + 1);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [currentSentence, completedWordsIndex, words]);

	const handleRateSentence = async (rate: string | number) => {
		if (!currentSentence) return;

		const numericRate =
			typeof rate === "string" ? (rate === "" ? 1 : parseInt(rate)) : rate;

		try {
			const now = Date.now();
			const dayInMs = 24 * 60 * 60 * 1000;
			const minuteInMs = 60 * 1000;

			const dueAt =
				numericRate === 0
					? now + 10 * minuteInMs
					: now + numericRate * dayInMs;

			await db.sentences.update(currentSentence.id, { rate: numericRate, dueAt });

			// Move to next sentence
			setCurrentIndex((prev) => prev + 1);
		} catch (error) {
			console.error("Error updating sentence:", error);
		}
	};

	const handleMove = (step: number) => {
		if (!currentSentence) return;
		setBatch((prev) => {
			const newBatch = [...prev];
			const cardToMove = newBatch.splice(currentIndex, 1)[0];
			const insertIndex = (currentIndex + step) % (newBatch.length + 1);
			newBatch.splice(insertIndex, 0, cardToMove);
			return newBatch;
		});
		setCompletedWordsIndex(0); // Reset for the next sentence
	};

	const handleSkip = () => {
		if (!currentSentence) return;
		setBatch((prev) => {
			const newBatch = [...prev];
			const cardToMove = newBatch.splice(currentIndex, 1)[0];
			newBatch.push(cardToMove);
			return newBatch;
		});
		setCompletedWordsIndex(0);
	};

	if (batch.length === 0) {
		return (
			<div className="app-container">
				<div className="background">
					<div className="background-base" />
				</div>
				<div className="content" style={{ textAlign: "center", marginTop: "50px" }}>
					<h2>No sentences due!</h2>
					<button
						type="button"
						className="action-button primary"
						onClick={() => navigate("/")}
					>
						Go Home
					</button>
				</div>
			</div>
		);
	}

	if (currentIndex >= batch.length) {
		return (
			<div className="app-container">
				<div className="background">
					<div className="background-base" />
				</div>
				<div className="content" style={{ textAlign: "center", marginTop: "50px" }}>
					<h2>All due sentences completed!</h2>
					<button
						type="button"
						className="action-button primary"
						onClick={() => navigate("/")}
					>
						Go Home
					</button>
				</div>
			</div>
		);
	}

	const isFullyRevealed = completedWordsIndex >= words.length;

	const option3 = currentSentence.rate === 0 ? 2 : currentSentence.rate || 2;
	const option4 = Math.max(3, Math.floor(option3 * 1.4));

	return (
		<div className="app-container">
			<div className="background">
				<div className="background-base" />
				<div className="background-middle">
					<div className="diagonal-section-middle" />
				</div>
				<div className="background-top">
					<div className="diagonal-section-top" />
				</div>
			</div>

			<div className="content">
				<div className="header">
					<div className="streak">
						<span>Sentences left: {batch.length - currentIndex}</span>
					</div>
				</div>

				<div className="flashcard">
					<div className="language-indicator">
						<span className="category-label">{pageTitle}</span>
					</div>

					<div className="card-content">
						<div className="side">
							<h2>{promptText}</h2>
						</div>

						<div className="side side-yellow" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px", minHeight: "60px" }}>
							{words.map((word, i) => {
								const isCompleted = i < completedWordsIndex;
								return (
									<span
										key={i}
										style={{
											fontSize: "1.5rem",
											fontWeight: isCompleted ? "bold" : "normal",
											color: isCompleted ? "inherit" : "#888",
										}}
									>
										{isCompleted ? word : word.replace(/[a-z0-9]/gi, "_")}
									</span>
								);
							})}
						</div>
					</div>

					<div className="controls">
						{!isFullyRevealed && (
							<button
								type="button"
								className="show-button"
								onClick={() => setCompletedWordsIndex(words.length)}
							>
								Show Answer
							</button>
						)}

						{isFullyRevealed && (
							<div className="review-buttons" style={{ marginTop: "20px" }}>
								<div className="rating-buttons">
									<button type="button" onClick={() => handleRateSentence(0)}>
										<div>10</div>
										<div>min</div>
									</button>
									<div className="interactive">
										<input
											autoFocus
											type="number"
											value={inputValue}
											onChange={(ev) => {
												const num =
													ev.target.value === ""
														? ""
														: Math.max(1, Math.min(999, +ev.target.value)).toString();
												setInputValue(num);
											}}
											onFocus={() => setInputValue("")}
											min={1}
											max={999}
										/>
										<button
											type="button"
											onClick={() => handleRateSentence(inputValue)}
											className="interactive-button"
										>
											<div>{inputValue || "0"}</div>
											<div>day{inputValue === "" || inputValue === "1" ? "" : "s"}</div>
										</button>
									</div>
									<button type="button" onClick={() => handleRateSentence(option3)}>
										<div>{option3}</div>
										<div>day{option3 === 1 ? "" : "s"}</div>
									</button>
									<button type="button" onClick={() => handleRateSentence(option4)}>
										<div>{option4}</div>
										<div>days</div>
									</button>
								</div>

								<div className="movement-buttons">
									<button
										type="button"
										className="winter"
										onClick={() => handleMove(7)}
									>
										#7
									</button>
									<button
										type="button"
										className="winter"
										onClick={() => handleMove(30)}
									>
										#30
									</button>
									<button
										type="button"
										className="winter"
										onClick={handleSkip}
									>
										Last
									</button>
								</div>
							</div>
						)}
						
						{isFullyRevealed && (
							<div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "10px" }}>
								<button
									type="button"
									className="action-button primary"
									onClick={() => navigate(`/sentenceForm/${currentSentence.id}`)}
								>
									Edit
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default SentencePractice;
