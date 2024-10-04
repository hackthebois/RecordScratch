import { zodResolver } from "@hookform/resolvers/zod";
import { CreateCommentSchema, Profile } from "@recordscratch/types";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { TextInput, View } from "react-native";
import { z } from "zod";
import { UserAvatar } from "~/components/UserAvatar";
import { api } from "~/lib/api";
import { AtSign } from "~/lib/icons/AtSign";
import { Loader2 } from "~/lib/icons/Loader2";
import { Send } from "~/lib/icons/Send";
import { getImageUrl } from "~/lib/image";
import { Button } from "../ui/button";
import { Text } from "../ui/text";

const CreateCommentFormSchema = CreateCommentSchema.pick({ content: true });
type CreateCommentForm = z.infer<typeof CreateCommentFormSchema>;

export const CommentForm = ({
	profile,
	authorId,
	parentId,
	rootId,
	onSubmitForm,
	replyHandle,
	replyUserId,
}: {
	profile: Profile;
	authorId: string;
	parentId?: string;
	rootId?: string;
	onSubmitForm?: () => void;
	replyHandle?: string;
	replyUserId?: string;
}) => {
	const { id } = useLocalSearchParams<{ id: string }>();
	const resourceId = id!;
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
			if (!rootId && !parentId)
				utils.comments.list.invalidate({
					authorId,
					resourceId,
				});
			else {
				utils.comments.getReplies.invalidate({
					authorId,
					resourceId,
					rootId,
				});
				utils.comments.getReplyCount.invalidate({
					authorId,
					resourceId,
					rootId,
				});
			}
			utils.comments.getComments.invalidate({
				authorId,
				resourceId,
			});
			if (onSubmitForm) onSubmitForm();
		},
	});

	const onSubmit = async ({ content }: CreateCommentForm) => {
		mutate({
			content,
			userId: profile.userId,
			resourceId,
			authorId,
			rootId,
			parentId,
			replyUserId,
		});
	};

	return (
		<View className="relative flex flex-col gap-3 rounded border border-gray-300 p-4">
			<View className="flex flex-row items-center gap-2">
				<UserAvatar size={35} imageUrl={getImageUrl(profile)} />
				<Text>{profile.name}</Text>
				<Text className="text-left text-sm text-muted-foreground">@{profile.handle}</Text>
			</View>
			<Controller
				control={form.control}
				name="content"
				render={({ field }) => (
					<View className="flex flex-row items-center">
						{!!replyHandle && (
							<View className="mr-2 flex flex-row items-center rounded">
								<AtSign size={15} color="black" />
								<Text className="max-w-10 truncate">{replyHandle}</Text>
							</View>
						)}
						<TextInput
							placeholder="Create a new comment..."
							className="mt-1 w-full resize-none border-none bg-background text-sm outline-none"
							autoFocus
							maxLength={250}
							multiline
							onChangeText={field.onChange}
							{...field}
						/>
					</View>
				)}
			/>
			<View className="flex flex-row justify-end">
				<Button
					className="gap-2 flex flex-row w-1/4"
					variant="outline"
					size="sm"
					disabled={form.formState.isSubmitting || !form.formState.isValid}
					onPress={form.handleSubmit(onSubmit)}
				>
					{isPending ? (
						<Loader2 size={18} className="animate-spin" color="black" />
					) : (
						<Send size={18} color="black" />
					)}
					<Text>Send</Text>
				</Button>
			</View>
		</View>
	);
};
