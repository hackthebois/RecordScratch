import { zodResolver } from "@hookform/resolvers/zod";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, ScrollView, TextInput, View } from "react-native";
import { z } from "zod";
import { Comment } from "~/components/Comment";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { api } from "~/lib/api";

const CommentModal = () => {
	const router = useRouter();
	const { id } = useLocalSearchParams<{
		id: string;
	}>();

	const [comment] = api.comments.get.useSuspenseQuery({
		id,
	});

	if (!comment) return null;

	const utils = api.useUtils();
	const form = useForm<{ content: string }>({
		resolver: zodResolver(z.object({ content: z.string() })),
		defaultValues: {
			content: "",
		},
	});

	const { mutate, isPending } = api.comments.create.useMutation({
		onSuccess: async () => {
			form.reset();
			router.back();
			router.navigate({
				pathname: "comments/[id]",
				params: { id },
			});
		},
		onSettled: () => {
			utils.comments.get.invalidate({
				id,
			});
		},
	});

	const onSubmit = async ({ content }: { content: string }) => {
		mutate({
			content,
			resourceId: comment.resourceId,
			authorId: comment.authorId,
			rootId: comment.id,
		});
	};

	return (
		<ScrollView className="h-full flex-1">
			<Stack.Screen
				options={{
					title: `Reply`,
					headerRight: () => (
						<Button
							onPress={form.handleSubmit(onSubmit)}
							disabled={isPending}
							variant="secondary"
							size="sm"
						>
							<Text>Post</Text>
						</Button>
					),
				}}
			/>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : undefined}
				keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
			>
				<Comment comment={comment} hideActions />
				<View className="h-1 bg-muted" />
				<Controller
					control={form.control}
					name="content"
					render={({ field }) => (
						<View className="p-4 flex-1">
							<TextInput
								placeholder="Create a new comment..."
								autoFocus
								multiline
								className="text-lg"
								scrollEnabled={false}
								onChangeText={field.onChange}
								{...field}
							/>
						</View>
					)}
				/>
			</KeyboardAvoidingView>
		</ScrollView>
	);
};

export default CommentModal;
