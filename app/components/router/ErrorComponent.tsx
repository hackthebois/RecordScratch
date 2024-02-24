import { Button } from "../ui/Button";

export const ErrorComponent = ({ error }: { error: unknown }) => {
	if (error instanceof Error) {
		const e = error as Error;
		return (
			<div className="mt-[15vh] flex h-full flex-col items-center justify-center gap-4">
				<h1>Error Found</h1>
				<p>{e.message}</p>
				<Button
					onClick={() => {
						window.location.reload();
					}}
				>
					Retry
				</Button>
			</div>
		);
	}
	return null;
};

export default Error;
