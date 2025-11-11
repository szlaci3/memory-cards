import { type ChangeEvent, useEffect, useState } from "react";
import type { CardCategory, CardType } from "types/index";
import "css/form.css";
import { useNavigate, useParams } from "react-router";
import { db, initializeDatabase } from "utils/db";

const CardForm = () => {
	const [sides, setSides] = useState<string[]>(["", ""]);
	const [category, setCategory] = useState<CardCategory>("EN to NL");
	const [card, setCard] = useState<CardType | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const { id } = useParams(); // Get the card ID from the URL
	const navigate = useNavigate();

	useEffect(() => {
		if (id) {
			// Fetch existing card data
			fetchCard(id);
		} else {
			setLoading(false);
		}
		return () => {
			setCard(null);
			setSides(["", ""]);
			setCategory("EN to NL");
			setError(null);
			setLoading(true);
		};
	}, [id]);

	const fetchCard = async (cardId: string) => {
		try {
			await initializeDatabase();
			const card = await db.cards.get(cardId);
			if (card) {
				setCard(card);
				setSides(card.sides);
				setCategory(card.category || "EN to NL");
			} else {
				setError("Card not found");
			}
		} catch {
			setError("Error fetching card data");
		} finally {
			setLoading(false);
		}
	};

	if (loading) return <div>Loading...</div>;
	if (error) return <div>{error}</div>;

	const handleAddSide = () => {
		if (sides.length < 10) {
			setSides([...sides, ""]);
		}
	};

	const handleSideChange = (index: number, value: string): void => {
		const updatedSides = [...sides];
		updatedSides[index] = value;
		setSides(updatedSides);
	};

	const handleSubmit = async (): Promise<void> => {
		try {
			await initializeDatabase();
			const updatedSides = sides.filter((item) => !!item);
			if (!card) {
				// Create new card
				const newCard: CardType = {
					id: crypto.randomUUID(),
					sides: updatedSides,
					rate: null,
					reviewedAt: null,
					category,
				};

				await db.cards.add(newCard);
			} else {
				// Update existing card
				await db.cards.update(card.id, {
					sides: updatedSides,
					category,
				});
			}
		} catch (error) {
			console.error("Error creating/updating card:", error);
			// Handle error
		} finally {
			navigate("/");
		}
	};

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
					<h1>{card ? "Edit Card" : "Create a New Card"}</h1>
				</div>

				<div className="card-form" key={id} id={id}>
					{/* Card ID field */}
					{card && <h4 className="card-id">Card ID: {card.id}</h4>}

					<div className="category-selector">
						<label className="side-label" htmlFor="category">
							Category
						</label>
						<select
							id="category"
							className="category-select"
							value={category}
							onChange={(e) => setCategory(e.target.value as CardCategory)}
						>
							<option value="EN to NL">EN to NL</option>
							<option value="NL to EN">NL to EN</option>
							<option value="Dev">Dev</option>
						</select>
					</div>

					<div className="sides-container">
						{sides.map((side, index) => {
							let label: string;
							switch (index) {
								case 0:
									label = "Front Side";
									break;
								case 1:
									label = "Back Side";
									break;
								default:
									label = `Side ${index + 1}:`;
							}

							return (
								// biome-ignore lint/suspicious/noArrayIndexKey: <Order is static>
								<div key={index} className="card-list">
									<div className="input-group flashcard">
										<label className="side-label" htmlFor={`_${index}`}>
											{label}
										</label>
										<textarea
											id={`_${index}`}
											className="side-input"
											value={side}
											onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
												handleSideChange(index, e.target.value)
											}
										/>
									</div>
								</div>
							);
						})}
					</div>

					<div className="button-group">
						<button
							className="action-button"
							type="button"
							onClick={handleAddSide}
						>
							Add Side
						</button>
						<button
							className="action-button primary"
							type="button"
							onClick={handleSubmit}
						>
							Submit
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CardForm;
