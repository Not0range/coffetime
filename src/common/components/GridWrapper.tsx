import _ from "lodash";
import React, { useEffect, useState } from "react";
import { FlatList, FlatListProps, View, ViewStyle } from "react-native";
import { itemLayoutCache, ItemLayoutName } from "../../core/itemLayoutCache";
import { Colors, CommonStyles } from "../../core/theme";
import { LoadState } from "../loadState";
import { styleSheetCreate } from "../utils";
import { LoadingView } from "./LoadingView";
import { TryAgain } from "./TryAgain";

interface IProps extends FlatListProps<any> {
  loadState: LoadState;
  itemLayoutName?: ItemLayoutName;
  tryAgain: () => void;
  loadMore?: () => void;
  errorText?: string | null;
  EmptyComponent: () => JSX.Element | null;
  PreloadingComponent?: React.ComponentClass<any>;
  itemInRow?: number;
}

export const GridWrapper: React.FC<IProps> = (props: IProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  let timerId: number | null;

  const onRefresh =() => {
    setIsRefreshing(true);
    props.onRefresh!();
    timerId = _.delay((): void => setIsRefreshing(false), 500);
  }

  useEffect(() => {
    return () => {
      if (timerId != null)
        clearInterval(timerId);
    }
  })

  let content: JSX.Element | null;

  const { loadState, itemLayoutName, data, loadMore, errorText, PreloadingComponent } = props;
  if (_.isEmpty(data)) {
    if (loadState == LoadState.firstLoad || loadState == LoadState.needLoad) {
      content = PreloadingComponent != null ? (<PreloadingComponent />) : null;
    } else if (loadState == LoadState.error) {
      content = <TryAgain onPress={props.tryAgain} errorText={errorText} />;
    } else {
      content = props.EmptyComponent();
    }
  } else {
    const getItemLayout = itemLayoutName != null
      ? itemLayoutCache.get(itemLayoutName)
      : props.getItemLayout;
    const newProps: Partial<IProps> = { ...props };
    delete newProps.itemLayoutName;
    delete newProps.loadState;
    delete props.loadMore;
    if (props.onRefresh != null) {
      props.refreshing = loadState == LoadState.pullToRefresh || isRefreshing;
      props.onRefresh = onRefresh;
    }
    if (loadMore != null && loadState == LoadState.idle) {
      props.onEndReachedThreshold = 1;
      props.onEndReached = loadMore;
    }
    let empty: number = 0;
    if (props.data?.length && props.itemInRow)
      empty = props.itemInRow - props.data.length % props.itemInRow;

    const data = _.chunk(props.data, props.itemInRow);
    if (props.itemInRow && empty < props.itemInRow)
      for (let i = 0; i < empty; i++)
        data[data.length - 1].push(null);
    
    content = (
      <FlatList
        style={styles.list}
        {...props}
        data={data}
        getItemLayout={getItemLayout}
      />
    );
  }

  return (
    <View style={CommonStyles.flexWhiteBackground}>
      <LoadingView isLoading={loadState == LoadState.firstLoad} transparent={false} />
      {content}
    </View>
  );
}

const styles = styleSheetCreate({
  list: {
    backgroundColor: Colors.white,
  } as ViewStyle,
});