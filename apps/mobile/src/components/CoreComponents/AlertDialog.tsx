import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";

type AlertDialogProps = {
	trigger: React.ReactNode;
	visible?: boolean;
	onClose?: () => void;
	onConfirm: (_: any) => void;
	title: string;
	description: string;
	confirmText?: string;
	cancelText?: string;
};

const AlertDialog: React.FC<AlertDialogProps> = ({
	visible = true,
	onClose,
	onConfirm,
	title,
	description,
	confirmText = "Confirm",
	cancelText = "Cancel",
}) => {
	return (
		<Modal transparent={true} visible={visible} animationType="slide" onRequestClose={onClose}>
			<View className="flex-1 justify-center items-center bg-gray-900 bg-opacity-50">
				<View className="w-4/5 bg-white p-6 rounded-lg">
					<Text className="text-xl font-bold mb-4">{title}</Text>
					<Text className="text-base text-center mb-4">{description}</Text>
					<View className="flex-row justify-between">
						<TouchableOpacity
							onPress={onClose}
							className="flex-1 bg-gray-200 p-3 rounded-lg mr-2"
						>
							<Text className="text-center text-gray-800">{cancelText}</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={onConfirm}
							className="flex-1 bg-blue-600 p-3 rounded-lg"
						>
							<Text className="text-center text-white">{confirmText}</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
};

export default AlertDialog;
