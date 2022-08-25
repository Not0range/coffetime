import MapboxGL from "@rnmapbox/maps";
import React, { useEffect, useRef, useState } from "react"
import { ImageSourcePropType, View, Image, ImageStyle, ViewStyle } from "react-native";
import { styleSheetCreate } from "../utils";

interface IProps {
  id: string;
  source: ImageSourcePropType;
  coordinate: number[];
  onSelected?: () => void;
  onDeselected?: () => void;
  selected?: boolean;
}

export const PointAnnotation: React.FC<IProps> = (props) => {
  const [size, setSize] = useState(5);
  const { id, coordinate, source, selected } = props;
  const ref = useRef<MapboxGL.PointAnnotation>(null);

  const refresh = () => {
    setSize(20);
    setTimeout(() => setSize(25), 500);
  }

  const onSelected = () => {
    ref.current?.refresh();
    props.selected = true;
    if (props.onSelected)
      props.onSelected();
  }

  const onDeselected = () => {
    ref.current?.refresh();
    props.selected = false;
    if (props.onDeselected)
      props.onDeselected();
  }

  return (
    <MapboxGL.PointAnnotation
      id={id}
      coordinate={coordinate}
      onSelected={onSelected}
      onDeselected={onDeselected}
      selected={selected}
      ref={ref}
    >
      <View style={styles.mapMarker}>
        <Image source={source} style={{ width: size, height: size }} resizeMode={"contain"} onLoad={refresh} />
      </View>
    </MapboxGL.PointAnnotation>
  )
}

const styles = styleSheetCreate({
  mapMarker: {
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 50,
    padding: 8,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    width: 45
  } as ViewStyle,
})