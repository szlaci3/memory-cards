import axios from "axios";
import { type ChangeEvent, useEffect, useState } from "react";
import type { CardFromApi, CardType } from "types/index";
import { v4 as uuidv4 } from "uuid";
import "css/form.css";
import { useNavigate, useParams } from "react-router";

const CardForm = () => {
	const [sides, setSides] = useState<string[]>(["", ""]);
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
			setError(null);
			setLoading(true);
		};
	}, [id]);

	const fetchCard = async (cardId: string) => {
		try {
			const response = await axios.get(`/cards/${cardId}`);
			setCard(response.data);
			setSides(JSON.parse(response.data.sides));
		} catch (err) {
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
			const updatedSides = sides.filter((item) => !!item);
			if (!card) {
				// Create new card
				const newCard: CardFromApi = {
					id: uuidv4(),
					sides: JSON.stringify(updatedSides),
					rate: null,
					reviewedAt: null,
				};

				await axios.post("/cards", newCard);
			} else {
				// Update existing card
				const updatedCard: CardFromApi = {
					...card!,
					rate: card.rate != null ? card.rate.toString() : card.rate,
					sides: JSON.stringify(updatedSides),
				};
				await axios.put(`/cards/${card.id}`, updatedCard);
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
