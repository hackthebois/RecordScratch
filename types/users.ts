import { z } from "zod";

export const UserDTOSchema = z.object({
	id: z.string(),
	firstName: z.string(),
	lastName: z.string(),
	imageUrl: z.string(),
});
export type UserDTO = z.infer<typeof UserDTOSchema>;

export const HandleSchema = z
	.string()
	.min(1, "Must be at least 1 character")
	.max(20, "Must be less than 20 characters")
	.regex(/^[a-zA-Z0-9_]+$/i, "Can only contain letters, numbers, and _");
