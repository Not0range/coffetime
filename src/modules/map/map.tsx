import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Animated, Image, ImageStyle, Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";
import { IconsResources } from "../../common/ImageResources.g";
import { Colors, CommonStyles, Fonts } from "../../core/theme";
import { ShopsStackParamList } from "../../navigation/MapAndListNavigation";
import MapboxGL from "@rnmapbox/maps";
import Geolocation from '@react-native-community/geolocation';
import { styleSheetCreate } from "../../common/utils";
import { PointAnnotation } from "./components/PointAnnotation";
import calculateDistance from "@turf/distance"
import { appSettingsProvider } from "../../core/settings";
import { localization } from "../../common/localization/localization";
import { useAppSelector } from "../../core/store/hooks";
import { Cafe } from "../../core/api/generated/dto/Cafe.g";
import { MainButton } from "../../common/components/MainButton";
import { ButtonType } from "../../common/enums/buttonType";

MapboxGL.setWellKnownTileServer("Mapbox")
MapboxGL.setAccessToken(appSettingsProvider.settings.mapboxApiKey);
MapboxGL.setConnected(true);

type Props = MaterialTopTabScreenProps<ShopsStackParamList, "Map">;

export const Map: React.FC<Props> = (props) => {
  const cafes = useAppSelector(state => state.entities.cafes);

  const [userCoords, setUserCoords] = useState([0, 0]);
  const [cameraCoords, setCameraCoords] = useState([0, 0]);
  const [zoom, setZoom] = useState(0);
  const [locatingVisible, setLocatingVisible] = useState(false);
  const [selected, setSelected] = useState("");
  const [position, setPosition] = useState(-90);

  const renderPoints: React.FC<{ cafe: Cafe }> = ({ cafe }) => {
    const id = `${cafe.id}`;
    const onSelected = () => {
      setSelected(cafe.id);
    }
    return (
      <PointAnnotation
        id={id}
        key={id}
        coordinate={stringToCoordinates(cafe.coordinates)}
        source={IconsResources.icon_cafe}
        onSelected={onSelected}
        onDeselected={onSelected}
        selected={cafe.id == selected}
      />
    )
  };

  const setCenter = (pos: any) => {
    setUserCoords([pos.coords.longitude, pos.coords.latitude]);
    setCameraCoords([pos.coords.longitude, pos.coords.latitude]);
    setZoom(15);
    setLocatingVisible(true);
  };

  const mapPress = () => {
    setSelected("");
  };

  useEffect(() => {
    let timerId: number | null = null;
    Geolocation.getCurrentPosition(pos => {
      setCenter(pos);
    }, error => {
      if (error.code == 1)
        Geolocation.requestAuthorization();
      else if (error.code == 2)
        Alert.alert(localization.errors.error, localization.errors.geolocationError);

      timerId = setInterval(() => {
        Geolocation.getCurrentPosition(pos => {
          setCenter(pos);
          if (timerId)
            clearInterval(timerId);
        }, error => {
          if (error.code == 1 && timerId)
            clearInterval(timerId);
        });
      }, 3000)
    });
    return () => { if (timerId) clearInterval(timerId) }
  }, []);

  const layoutHandler = ({ nativeEvent }: any) => {
    setPosition(-nativeEvent.layout.height);
  };

  const animatedValue = useRef(new Animated.Value(-90)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: selected != "" ? 0 : position,
      duration: 300,
      useNativeDriver: false
    }).start();
  }, [selected]);

  const overlayStyle: ViewStyle = {
    position: "absolute",
    left: 40,
    right: 40,
    bottom: animatedValue as any
  }

  const selectedCafe = cafes?.find(t => t.id == selected);

  const distance = selectedCafe ?
    Math.ceil(calculateDistance(userCoords, stringToCoordinates(selectedCafe.coordinates), { units: "meters" })) :
    0;
  const time = Math.ceil(distance / 60);

  return (
    <View style={CommonStyles.flex1}>
      <MapboxGL.MapView
        style={CommonStyles.flex1}
        logoEnabled={false}
        rotateEnabled={false}
        onPress={mapPress}
      >
        <MapboxGL.Camera centerCoordinate={cameraCoords} zoomLevel={zoom} />

        {locatingVisible ? <MapboxGL.MarkerView id={"user_locating"} coordinate={userCoords}>
          <Image source={IconsResources.icon_locating} />
        </MapboxGL.MarkerView> : null}

        {cafes?.map(t => renderPoints({ cafe: t }))}
      </MapboxGL.MapView>

      <Animated.View style={overlayStyle}>
        <View style={styles.topContainer}>
          <TouchableOpacity style={styles.button}>
            <Image source={IconsResources.icon_sent} style={styles.buttonIcon} />
          </TouchableOpacity>
          <View style={CommonStyles.flex1} />
          <TouchableOpacity style={styles.button}>
            <Image source={IconsResources.icon_search} style={styles.buttonIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.bottomContainer} onLayout={layoutHandler}>
          <Text style={styles.title}>{selectedCafe?.name}</Text>
          <Text>{locatingVisible ? `${distance} ${"м"} = ${time} ${"минут"}` : null}</Text>
        </View>
      </Animated.View>
    </View>
  )
};

function stringToCoordinates(str: string): number[] {
  const [lat, long] = str.split(", ");
  return [+long, +lat];
}

const styles = styleSheetCreate({
  topContainer: {
    flex: 1,
    flexDirection: "row",
    marginVertical: 10
  } as ViewStyle,
  button: {
    backgroundColor: "white",
    justifyContent: "center",
    alignContent: "center",
    width: 45,
    height: 45,
    borderRadius: 50,
    paddingVertical: 0,
    paddingHorizontal: 0,
  } as ViewStyle,
  buttonIcon: {
    alignSelf: "center",
  } as ImageStyle,
  bottomContainer: {
    backgroundColor: "white",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  } as ViewStyle,
  title: {
    fontFamily: Fonts.lobster,
    fontSize: 22,
    marginBottom: 14
  } as TextStyle,
  distance: {
    fontFamily: Fonts.light,
    fontSize: 16,
    color: "#AEAEAE"
  } as TextStyle,
})