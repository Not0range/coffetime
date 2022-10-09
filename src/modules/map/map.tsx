import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import React, { useEffect, useState } from "react";
import { Image, ImageStyle, Linking, Platform, Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";
import { IconsResources } from "../../common/ImageResources.g";
import { Colors, CommonStyles, Fonts } from "../../core/theme";
import { ShopsStackParamList } from "../../navigation/MapAndListNavigation";
import MapboxGL from "@rnmapbox/maps";
import Geolocation from '@react-native-community/geolocation';
import { styleSheetCreate } from "../../common/utils";
import { PointAnnotation } from "./components/PointAnnotation";
import * as turf from "@turf/helpers";
import calculateDistance from "@turf/distance";
import center from "@turf/center";
import { appSettingsProvider } from "../../core/settings";
import { localization } from "../../common/localization/localization";
import { useAppDispatch, useAppSelector } from "../../core/store/hooks";
import { Cafe } from "../../core/api/generated/dto/Cafe.g";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import _ from "lodash";
import { getAllCafeAsync } from "../cafes/cafeSlice";
import { setCurrentCafe } from "../currentCafe/currentCafeSlice";
import Toast from "react-native-simple-toast";

MapboxGL.setWellKnownTileServer("Mapbox")
MapboxGL.setAccessToken(appSettingsProvider.settings.mapboxApiKey);
MapboxGL.setConnected(true);

const zoomFactor = 5;

type Props = MaterialTopTabScreenProps<ShopsStackParamList, "Map">;

export const Map: React.FC<Props> = (props) => {
  const cafes = useAppSelector(state => state.entities.cafes);
  const sessionId = useAppSelector(state => state.system.authToken);
  const dispatch = useAppDispatch();

  const [userCoords, setUserCoords] = useState<number[]>([]);
  const [cameraCoords, setCameraCoords] = useState([0, 0]);
  const [zoom, setZoom] = useState(0);
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

  const setUserPosition = (pos: any) => {
    setUserCoords([pos.coords.longitude, pos.coords.latitude]);
  };

  const mapPress = () => {
    setSelected("");
  };

  const cafePress = () => {
    const cafe = cafes.find(t => t.id == selected);
    if (!cafe) return;
    dispatch(setCurrentCafe(cafe));
    props.navigation.getParent()?.navigate("CurrentCafe");
  };

  const distansePress = () => {
    const cafe = cafes.find(t => t.id == selected);
    if (!cafe) return;
    const coords = stringToCoordinates(cafe.coordinates);

    const scheme = Platform.select({ ios: 'maps:', android: 'geo:' });
    const url = `${scheme}${coords[1]},${coords[0]}`;
    Linking.openURL(url);
  }

  useEffect(() => {
    if (sessionId)
      dispatch(getAllCafeAsync(sessionId)).then(result => {
        if (result.meta.requestStatus != "fulfilled") return;

        const coords = (result.payload as Cafe[]).map(t => stringToCoordinates(t.coordinates));
        const { geometry } = center(turf.points(coords));        
        setCameraCoords(geometry.coordinates);

        const zoom = _.max(coords.map(t => calculateDistance(cameraCoords, t, { units: "degrees" }))) || 0;
        setZoom(zoom / zoomFactor);
      });
  }, []);

  useEffect(() => {
    let timerId: number | null = null;
    Geolocation.getCurrentPosition(pos => {
      setUserPosition(pos);
    }, error => {
      if (error.code == 1)
        Geolocation.requestAuthorization();
      else if (error.code == 2)
        Toast.show(localization.errors.geolocationError);

      timerId = setInterval(() => {
        Geolocation.getCurrentPosition(pos => {
          setUserPosition(pos);
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

  const animatedValue = useSharedValue(-90);

  useEffect(() => {
    animatedValue.value = withTiming(selected != "" ? 0 : position, {
      duration: 300
    });
  }, [selected]);

  const overlayStyle = useAnimatedStyle(() => ({
    position: "absolute",
    left: 40,
    right: 40,
    bottom: animatedValue.value
  }))

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

        {userCoords.length == 2 ? <MapboxGL.MarkerView id={"user_locating"} coordinate={userCoords}>
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
          <TouchableOpacity onPress={cafePress}>
            <Text style={styles.title}>{selectedCafe?.name}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={distansePress}>
            <Text style={styles.distance}>
              {userCoords.length == 2 ? `${distance} ${"м"} = ${time} ${"минут"}` : null}
            </Text>
          </TouchableOpacity>
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
    marginBottom: 14,
    color: Colors.gray47
  } as TextStyle,
  distance: {
    fontFamily: Fonts.light,
    fontSize: 16,
    color: Colors.grayAE
  } as TextStyle,
})