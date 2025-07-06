import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const defaultOptions: L.IconOptions = {
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
};

// LeafletのデフォルトアイコンのパスをViteビルド後も正しく参照できるように設定
export const DefaultIcon = L.icon(defaultOptions);

export const RedIcon = L.icon({
  ...defaultOptions,
  className: "icon-red", // アイコンの色を赤にするためのクラス
});

export const GreenIcon = L.icon({
  ...defaultOptions,
  className: "icon-green", // アイコンの色を赤にするためのクラス
});
