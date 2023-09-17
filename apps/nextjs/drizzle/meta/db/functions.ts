import { db } from "@/drizzle/db/config";
import {ratings} from "@/drizzle/db//schema"

// Basic Rating Insert function
export type NewRating = typeof ratings.$inferInsert;


export const insertUser = async (rating: NewRating) => {
  return db.insert(ratings).values(rating);
}