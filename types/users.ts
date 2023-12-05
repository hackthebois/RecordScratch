import { z } from "zod";

export const UserDTOSchema = z.object({
	id: z.string(),
	firstName: z.string(),
	lastName: z.string(),
	imageUrl: z.string(),
});
export type UserDTO = z.infer<typeof UserDTOSchema>;
