import { buttonVariants } from "@/components/ui/Button";
import Link from "next/link";

const NotFound = () => {
	return (
		<main className="m-auto flex flex-col items-center gap-8">
			<h1>Page Not Found</h1>
			<p className="text-muted-foreground">
				Could not find the requested resource
			</p>
			<Link href="/" className={buttonVariants()}>
				Return Home
			</Link>
		</main>
	);
};

export default NotFound;
