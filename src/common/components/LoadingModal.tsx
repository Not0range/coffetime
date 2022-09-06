import { LoadingView } from "./LoadingView";
import React from "react";
import { Modal, ModalProps } from "react-native";

interface IProps extends ModalProps {
  isLoading?: boolean;
  onPress?: () => void;
}

export const LoadingModal: React.FC<IProps> = (props) => {
  const onRequestClose = (): void => { };
  return (
    <Modal
      {...props}
      animationType={"none"}
      visible={props.isLoading}
      onRequestClose={props.onRequestClose || onRequestClose}
      transparent={true}
    >
      <LoadingView isLoading={true} transparent={false} onPress={props.onPress} />
    </Modal>
  );
}