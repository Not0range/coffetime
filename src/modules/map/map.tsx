import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Image, ImageStyle, Text, TextStyle, View, ViewStyle } from "react-native";
import { IconsResources, ImageResources } from "../../common/ImageResources.g";
import { CommonStyles, Fonts } from "../../core/theme";
import { ShopsStackParamList } from "../../navigation/MapAndShopsNavigation";
import MapboxGL, { MapState } from "@rnmapbox/maps";
import Geolocation from '@react-native-community/geolocation';
import { styleSheetCreate } from "../../common/utils";
import { PointAnnotation } from "../../common/components/PointAnnotation";
import { CoffeeShopTestData, ICoffeeShop } from "../../types/CoffeeShop";
import { ButtonWithIcon } from "../../common/components/ButtonWithIcon";
import calculateDistance from "@turf/distance"

MapboxGL.setWellKnownTileServer("Mapbox")
MapboxGL.setAccessToken('pk.eyJ1Ijoibm90b3JhbmdlIiwiYSI6ImNsNzJnYTl5ODB5MHkzeHM5NWVsY2tzemkifQ.EDUqnBFh-nORRa2LiBFKiw');
MapboxGL.setConnected(true);

type Props = MaterialTopTabScreenProps<ShopsStackParamList, "Map">;

export const Map: React.FC<Props> = (props: Props) => {
  const [userCoords, setUserCoords] = useState([0, 0]);
  const [cameraCoords, setCameraCoords] = useState([0, 0]);
  const [zoom, setZoom] = useState(0);
  const [locatingVisible, setLocatingVisible] = useState(false);
  const [selected, setSelected] = useState(-1);

  const renderPoints: React.FC<{ shop: ICoffeeShop }> = ({ shop }) => {
    const id = `cs${shop.id}`;
    const onSelected = () => {
      setSelected(shop.id);
    }
    return (
      <PointAnnotation
        id={id}
        key={id}
        coordinate={[shop.longtitude, shop.latitude]}
        source={IconsResources.icon_coffe}
        onSelected={onSelected}
        selected={shop.id == selected}
      />
    )
  }

  const setCenter = (pos: any) => {
    setUserCoords([pos.coords.longitude, pos.coords.latitude]);
    setCameraCoords([pos.coords.longitude, pos.coords.latitude]);
    setZoom(15);
    setLocatingVisible(true);
  };

  const mapPress = () => {
    setSelected(-1);
  };

  useEffect(() => {
    Geolocation.getCurrentPosition(pos => {
      setCenter(pos);
    }, error => {
      console.log(error.message);
      if (error.code == 1)
        Geolocation.requestAuthorization();
      else if (error.code == 2)
        Alert.alert("Error", "Geolocation service unavaible");

      const timerId = setInterval(() => {
        Geolocation.getCurrentPosition(pos => {
          setCenter(pos);
          clearInterval(timerId);
        }, error => {
          if (error.code == 1)
            clearInterval(timerId);
          console.log(error.message);
        });
      }, 3000)
    });
  }, []);

  const selectedShop = CoffeeShopTestData.find(t => t.id == selected);

  const distance = selectedShop ?
    Math.ceil(calculateDistance(userCoords, [selectedShop.longtitude, selectedShop.latitude], { units: "meters" })) :
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

        {CoffeeShopTestData.map(t => renderPoints({ shop: t }))}
      </MapboxGL.MapView>

      {selected != -1 ?
        <View style={styles.overlay}>
          <View style={styles.topContainer}>
            <ButtonWithIcon icon={IconsResources.icon_sent} style={styles.button} iconPosition={"center"} />
            <View style={CommonStyles.flex1} />
            <ButtonWithIcon icon={IconsResources.icon_search} style={styles.button} iconPosition={"center"} />
          </View>
          <View style={styles.bottomContainer}>
            <Text style={styles.title}>{selectedShop?.title}</Text>
            <Text>{`${distance} ${"м"} = ${time} ${"минут"}`}</Text>
          </View>
        </View>
        : null}
    </View>
  )
}

const styles = styleSheetCreate({
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 40,
    right: 40,
    height: 150
  } as ViewStyle,
  topContainer: {
    flex: 1,
    flexDirection: "row"
  } as ViewStyle,
  button: {
    backgroundColor: "white",
    justifyContent: "center",
    alignContent: "center",
    width: 45,
    height: 45,
    borderRadius: 50
  } as ViewStyle,
  bottomContainer: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
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