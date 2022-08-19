import { LoadingView } from "./LoadingView";
import React from "react";
import { Modal } from "react-native";

interface IProps {
  isLoading?: boolean;
}

export const LoadingModal: React.FC<IProps> = (props: IProps) => {
  const onRequestClose = (): void => { };

  return (
    <Modal
      animationType={"none"}
      visible={props.isLoading}
      onRequestClose={onRequestClose}
      transparent={true}
    >
      <LoadingView isLoading={true} transparent={false} />
    </Modal>
  );
}