import { Review } from "@/components/review/Review";
import { ErrorComponent } from "@/components/router/ErrorComponent";
import { PendingComponent } from "@/components/router/Pending";
import { NotFound } from "@/components/ui/NotFound";
import { api, apiUtils } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateCommentSchema } from "@recordscratch/types";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/Form";
import { UserAvatar } from "@/components/user/UserAvatar";
import { Profile } from "@recordscratch/types";
import { getImageUrl, timeAgo } from "@recordscratch/lib";
import { Loader2, Send } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import { z } from "zod";

export const Route = createFileRoute("/_app/$handle/ratings/$resourceId/")({
	component: Rating,
	pendingComponent: PendingComponent,
	errorComponent: ErrorComponent,
	loader: async ({ params: { handle, resourceId } }) => {
		const profile = await apiUtils.profiles.get.ensureData(handle);
		if (!profile) return <NotFound />;
		apiUtils.ratings.user.get.ensureData({
			userId: profile.userId,
			resourceId,
		});
		apiUtils.comments.list.ensureData({
			authorId: profile.userId,
			resourceId,
		});
		apiUtils.profiles.me.ensureData();
	},
});

const CreateCommentFormSchema = CreateCommentSchema.pick({ content: true });
type CreateCommentForm = z.infer<typeof CreateCommentFormSchema>;

const CommentForm = ({
	profile,
	authorId,
}: {
	profile: Profile;
	authorId: string;
}) => {
	const { resourceId } = Route.useParams();
	const utils = api.useUtils();
	const form = useForm<CreateCommentForm>({
		resolver: zodResolver(CreateCommentFormSchema),
		defaultValues: {
			content: "",
		},
	});

	const { mutate, isPending } = api.comments.create.useMutation({
		onSuccess: () => {
			form.reset();
			utils.comments.list.invalidate({
				authorId,
				resourceId,
			});
			utils.comments.getComments.invalidate({
				authorId,
				resourceId,
			});
		},
	});

	const onSubmit = async ({ content }: CreateCommentForm) => {
		mutate({
			content,
			userId: profile.userId,
			resourceId,
			authorId,
		});
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="relative flex flex-col gap-3 rounded border p-3"
			>
				<div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
					<UserAvatar
						imageUrl={getImageUrl(profile)}
						className="h-8 w-8"
					/>
					<p>{profile.name}</p>
					<p className="text-left text-sm text-muted-foreground">
						@{profile.handle}
					</p>
				</div>
				<FormField
					control={form.control}
					name="content"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<TextareaAutosize
									placeholder="Create a new comment..."
									className="w-full resize-none border-none bg-background text-sm outline-none"
									autoFocus
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex">
					<Button
						type="submit"
						className="gap-2"
						variant="outline"
						size="sm"
						disabled={
							form.formState.isSubmitting ||
							!form.formState.isValid
						}
					>
						{isPending ? (
							<Loader2 size={18} className="animate-spin" />
						) : (
							<Send size={18} />
						)}
						Send
					</Button>
				</div>
			</form>
		</Form>
	);
};

function Rating() {
	const { handle, resourceId } = Route.useParams();
	const [profile] = api.profiles.get.useSuspenseQuery(handle);
	const [myProfile] = api.profiles.me.useSuspenseQuery();
	const [rating] = api.ratings.user.get.useSuspenseQuery({
		userId: profile!.userId,
		resourceId,
	});
	const [comments] = api.comments.list.useSuspenseQuery({
		resourceId,
		authorId: profile!.userId,
	});

	if (!profile || !rating) return null;

	return (
		<div className="flex flex-col gap-4">
			<Review {...rating} profile={profile} />
			{myProfile && (
				<CommentForm profile={myProfile} authorId={profile.userId} />
			)}
			{comments.map((comment) => (
				<div className="relative flex flex-col gap-3 rounded border p-3">
					<Link
						to="/$handle"
						params={{
							handle: comment.profile.handle,
						}}
						className="flex min-w-0 flex-1 flex-wrap items-center gap-2"
					>
						<UserAvatar
							imageUrl={getImageUrl(comment.profile)}
							className="h-8 w-8"
						/>
						<p>{comment.profile.name}</p>
						<p className="text-left text-sm text-muted-foreground">
							@{comment.profile.handle} •{" "}
							{timeAgo(comment.updatedAt)}
						</p>
					</Link>
					<p className="text-sm">{comment.content}</p>
				</div>
			))}
		</div>
	);
}
