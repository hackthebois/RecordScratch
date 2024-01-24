import { ClerkProvider } from "@clerk/nextjs";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	return (
		<ClerkProvider
			appearance={{
				variables: {
					colorPrimary: "hsl(0 0% 9%)",
					colorDanger: "hsl(0 84.2% 60.2%)",
					borderRadius: "0.5rem",
				},
			}}
		>
			{children}
		</ClerkProvider>
	);
};

export default AuthProvider;
