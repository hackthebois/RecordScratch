import { Star } from "lucide-react";
import { useState } from "react";

export const RatingInput = ({
	value: rating,
	onChange,
}: {
	value: number | null;
	onChange: (rating: number | null) => void;
}) => {
	const [hoverRating, setHoverRating] = useState<number | null>(null);

	return (
		<div className="flex justify-between">
			{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((index) => (
				<div
					key={index}
					onClick={() => onChange(index)}
					onMouseOver={() => setHoverRating(index)}
					onMouseLeave={() => setHoverRating(null)}
					className="flex flex-1 justify-center py-2 hover:cursor-pointer"
				>
					<Star
						color="orange"
						fill={
							hoverRating
								? index <= hoverRating
									? "orange"
									: "none"
								: rating
									? index <= rating
										? "orange"
										: "none"
									: "none"
						}
					/>
				</div>
			))}
		</div>
	);
};
