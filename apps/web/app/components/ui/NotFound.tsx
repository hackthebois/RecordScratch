import { Link } from "@tanstack/react-router";
import { buttonVariants } from "./Button";

export const NotFound = () => {
	return (
		<div className="flex flex-col items-center">
			<h1 className="text-[80px] font-extrabold">404</h1>
			<p className="mb-6 text-2xl font-medium">Page Not Found</p>
			<Link to="/" className={buttonVariants()}>
				Go Home
			</Link>
		</div>
	);
};
