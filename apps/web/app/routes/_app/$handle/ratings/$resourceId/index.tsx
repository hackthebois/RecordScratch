import { Review } from "@/components/review/Review";
import { ErrorComponent } from "@/components/router/ErrorComponent";
import { PendingComponent } from "@/components/router/Pending";
import { NotFound } from "@/components/ui/NotFound";
import { api, apiUtils } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Comment as CommentType,
	CreateCommentSchema,
} from "@recordscratch/types";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";

import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/Button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/Form";
import { Label } from "@/components/ui/Label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/Popover";
import { UserAvatar } from "@/components/user/UserAvatar";
import { getImageUrl } from "@/lib/image";
import { timeAgo } from "@recordscratch/lib";
import { Profile } from "@recordscratch/types";
import {
	AtSign,
	Loader2,
	MessageCircle,
	MoreHorizontal,
	Reply,
	Send,
	Trash2,
} from "lucide-react";
import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { z } from "zod";

export const Route = createFileRoute("/_app/$handle/ratings/$resourceId/")({
	component: Rating,
	pendingComponent: PendingComponent,
	errorComponent: ErrorComponent,
	validateSearch: (search) => {
		return z
			.object({
				reply: z.boolean().optional(),
			})
			.parse(search);
	},
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
	parentId,
	rootId,
	onSubmitForm,
	replyHandle,
}: {
	profile: Profile;
	authorId: string;
	parentId: string | null;
	rootId: string | null;
	onSubmitForm?: () => void;
	replyHandle?: string;
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
		onSuccess: async () => {
			form.reset();
			if (!parentId)
				utils.comments.list.invalidate({
					authorId,
					resourceId,
				});
			else {
				utils.comments.get.invalidate({
					id: parentId,
				});
			}
			utils.comments.count.rating.invalidate({
				authorId,
				resourceId,
			});
			if (onSubmitForm) onSubmitForm();
		},
	});

	const onSubmit = async ({ content }: CreateCommentForm) => {
		mutate({
			content,
			resourceId,
			authorId,
			rootId,
			parentId,
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
								<div className="flex flex-row items-start">
									{!!replyHandle && (
										<Label className="mr-2 flex flex-row items-center rounded">
											<AtSign size={15} />
											<p className="max-w-10 truncate">
												{replyHandle}
											</p>
										</Label>
									)}
									<TextareaAutosize
										placeholder="Create a new comment..."
										className="mt-1 w-full resize-none border-none bg-background text-sm outline-none"
										autoFocus
										maxLength={250}
										{...field}
									/>
								</div>
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

const CommentMenu = ({ onClick }: { onClick: () => void }) => {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button size="icon" variant="outline">
					<MoreHorizontal size={22} />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				align="start"
				side="left"
				className="w-52 items-center justify-center"
			>
				<Button
					className="mr-1 flex w-44 flex-row items-center justify-evenly border-none py-5"
					onClick={onClick}
					variant={"outline"}
					size="icon"
				>
					<p>Delete Comment</p>
					<div className="flex items-center justify-center rounded-md border border-zinc-800 p-1.5">
						<Trash2 size={18} />
					</div>
				</Button>
			</PopoverContent>
		</Popover>
	);
};

const Comment = ({
	id,
	rootId,
	parentId,
	resourceId,
	authorId,
	content,
	replyCount,
	updatedAt,
	profile,
	myProfile,
	parentProfile,
	commentView,
	openCommentFormId,
	toggleCommentForm,
}: {
	id: string;
	rootId: string | null;
	parentId: string | null;
	authorId: string;
	resourceId: string;
	content: string;
	replyCount?: number;
	updatedAt: Date;
	profile: Profile;
	myProfile: Profile | null;
	parentProfile?: Profile;
	commentView?: () => void;
	openCommentFormId: string | null;
	// eslint-disable-next-line no-unused-vars
	toggleCommentForm: (commentId: string | null) => void;
}) => {
	const utils = api.useUtils();
	const { mutate: deleteComment } = api.comments.delete.useMutation({
		onSettled: () => {
			if (!rootId)
				utils.comments.list.invalidate({
					authorId,
					resourceId,
				});
			else {
				utils.comments.get.invalidate({
					id,
				});
			}
			utils.comments.count.rating.invalidate({
				authorId,
				resourceId,
			});
		},
	});

	return (
		<>
			<div className="relative flex flex-col gap-3 rounded border p-3">
				<div className="flex flex-row justify-between">
					<Link
						to="/$handle"
						params={{
							handle: profile.handle,
						}}
						className="flex min-w-0 max-w-60 flex-1 flex-wrap items-center gap-2"
					>
						<UserAvatar
							imageUrl={getImageUrl(profile)}
							className="h-8 w-8"
						/>
						<p>{profile.name}</p>
						<p className="text-left text-sm text-muted-foreground">
							@{profile.handle} • {timeAgo(updatedAt)}
						</p>
					</Link>
					{myProfile?.userId == profile.userId && (
						<CommentMenu onClick={() => deleteComment({ id })} />
					)}
				</div>
				<div className="flex flex-row items-center">
					{!!parentProfile && (
						<Label className=" mr-2 flex flex-row items-center rounded">
							<AtSign size={15} />
							<p className=" max-w-20 truncate">
								{parentProfile.handle}
							</p>
						</Label>
					)}
					<p className="text-sm">{content}</p>
				</div>
				<div className="flex flex-row gap-2">
					{!!replyCount && (
						<Button
							variant="outline"
							size="sm"
							className=" w-16 gap-2 text-muted-foreground"
							onClick={commentView}
						>
							<MessageCircle size={20} />
							<p>{replyCount}</p>
						</Button>
					)}
					<Button
						variant="outline"
						size="sm"
						className=" w-12 gap-2 text-muted-foreground"
						onClick={() => {
							toggleCommentForm(id);
						}}
					>
						<Reply size={20} />
					</Button>
				</div>
			</div>
			{openCommentFormId === id && myProfile && (
				<div className={!rootId ? "ml-10 mt-2" : ""}>
					<CommentForm
						replyHandle={profile.handle}
						profile={myProfile}
						authorId={authorId}
						rootId={rootId ?? id} // If no rootId, then it is a reply to comment
						parentId={id}
						onSubmitForm={() => {
							toggleCommentForm(null);
						}}
					/>
				</div>
			)}
		</>
	);
};

const CommentLayout = ({
	comment,
	myProfile,
	openCommentFormId,
	toggleCommentForm,
}: {
	comment: CommentType & {
		profile: Profile;
	};
	myProfile: Profile | null;
	openCommentFormId: string | null;
	// eslint-disable-next-line no-unused-vars
	toggleCommentForm: (commentId: string | null) => void;
}) => {
	const [isOpen, setIsOpen] = useState(false);

	const { data: fullComment } = api.comments.get.useQuery({
		id: comment.id,
	});

	const toggleOpen = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div>
			<Comment
				{...comment}
				replyCount={fullComment?.replies?.length}
				myProfile={myProfile}
				commentView={toggleOpen}
				openCommentFormId={openCommentFormId}
				toggleCommentForm={toggleCommentForm}
			/>
			<div>
				{isOpen &&
					fullComment?.replies?.map((reply) => {
						return (
							<div className=" ml-10 mt-2" key={reply.id}>
								<Comment
									{...reply}
									myProfile={myProfile}
									parentProfile={
										reply.parent?.profile ?? undefined
									}
									openCommentFormId={openCommentFormId}
									toggleCommentForm={toggleCommentForm}
								/>
							</div>
						);
					})}
			</div>
		</div>
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

	const { reply = false } = Route.useSearch();
	const [openReply, setOpenReply] = useState(reply);
	const toggleOpenReply = () => {
		setOpenReply((open) => {
			if (!open) toggleCommentForm(null);
			return !open;
		});
	};

	const [openCommentFormId, setOpenCommentFormId] = useState<string | null>(
		null
	);
	const toggleCommentForm = (commentId: string | null) => {
		if (commentId === openCommentFormId) setOpenCommentFormId(null);
		else setOpenCommentFormId(commentId);

		if (commentId) setOpenReply(false);
	};

	if (!profile || !rating) return null;

	return (
		<div className="flex flex-col gap-2">
			<Seo
				title={`Rating by ${profile.name}`}
				description={`${rating.rating}/10 stars${rating.content && `, Content: ${rating.content}`}`}
				imageUrl={getImageUrl(profile)}
				path={`/${profile.handle}/ratings/${resourceId}`}
				keywords={[
					profile.name,
					profile.handle,
					rating.rating + "/10",
				].join(", ")}
			/>
			<Review {...rating} profile={profile} onReply={toggleOpenReply} />
			{openReply && myProfile && (
				<CommentForm
					profile={myProfile}
					authorId={profile.userId}
					onSubmitForm={toggleOpenReply}
					parentId={null} // Since it is a reply to the rating
					rootId={null} // Since it is a reply to the rating
				/>
			)}
			{comments.map((comment: CommentType & { profile: Profile }) => (
				<CommentLayout
					comment={comment}
					myProfile={myProfile}
					key={comment.id}
					openCommentFormId={openCommentFormId}
					toggleCommentForm={toggleCommentForm}
				/>
			))}
		</div>
	);
}
