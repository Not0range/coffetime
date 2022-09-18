import React from "react";
import { View, ViewStyle } from "react-native";
import { styleSheetCreate } from "../../common/utils";
import { ItemLayoutCache, ItemLayoutName } from "./ItemLayoutCache";
import { ItemLayoutCacheSetter } from "./ItemLayoutCacheSetter";

export const ItemLayoutCacheContainer: React.FC<IProps> = (props) => {
  return (
    <View style={styles.container}>
      <ItemLayoutCacheSetter item={ItemLayoutName.newsItem} itemLayoutCache={props.itemLayoutCache}>
        <View />
      </ItemLayoutCacheSetter>
    </View>
  );
}

interface IProps {
  itemLayoutCache: ItemLayoutCache;
}

const styles = styleSheetCreate({
  container: {
    opacity: 0,
  } as ViewStyle,
});