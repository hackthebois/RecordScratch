export const NotFound = () => {
	return (
		<div className="flex flex-col items-center">
			<h1 className="text-[80px] font-extrabold">404</h1>
			<p className="mb-6 text-2xl font-medium">Page Not Found</p>
			<a
				href="/"
				className="rounded-md bg-gray-100 px-4 py-2 font-medium text-black transition-all duration-200 ease-in-out hover:bg-indigo-600"
			>
				Go Home
			</a>
		</div>
	);
};
