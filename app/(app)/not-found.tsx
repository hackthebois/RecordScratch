import { buttonVariants } from "@/app/_components/ui/Button";
import Link from "next/link";

const NotFound = () => {
	return (
		<main className="mt-[20vh] flex flex-col items-center justify-center gap-8">
			<h1 className="text-center">Page Not Found</h1>
			<p className="text-center text-muted-foreground">
				Could not find the requested resource
			</p>
			<Link href="/" className={buttonVariants()}>
				Return Home
			</Link>
		</main>
	);
};

export default NotFound;
