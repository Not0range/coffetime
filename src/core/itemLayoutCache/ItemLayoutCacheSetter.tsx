import React, { useReducer } from "react";
import { LayoutChangeEvent, View } from "react-native";
import { ItemLayoutCache, ItemLayoutName } from "./ItemLayoutCache";

export const ItemLayoutCacheSetter: React.FC<IProps> = (props) => {
  const { item, itemLayoutCache } = props;
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const onLayout = (event: LayoutChangeEvent) => {
    props.itemLayoutCache.set(props.item, { ...event.nativeEvent.layout });
    forceUpdate();
  }

  if (itemLayoutCache.get(item) != null) {
    return null;
  } else {
    return (
      <View onLayout={onLayout}>
        {props.children}
      </View>
    );
  }
}

interface IProps {
  item: ItemLayoutName;
  itemLayoutCache: ItemLayoutCache;
  children: React.ReactNode;
}