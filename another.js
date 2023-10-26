import { kiambu_suitability } from "./kiambu_suit.js";

var coord = [-1.183, 37.117];
var map = L.map("map").setView(coord, 9);
var tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

const southwest = [-0.7492605935410523, 36.42414663046995];
const northeast = [-1.3641416388587118, 37.475949540026704];

const rectangle = L.rectangle([[southwest, northeast]], {
  color: "blue",
  weight: 2,
  fillOpacity: 0.0,
}).addTo(map);
const bounds = rectangle.getBounds();
// Fit the map to the bounds of the bounding box
map.fitBounds(bounds);

function getColor(d) {
  if (d > 10) {
    return "#FC4E2A";
  } else if (d > 5) {
    return "#FD8D3C";
  } else if (d > 2) {
    return "#FEB24C";
  } else if (d > 1) {
    return "#FED976";
  } else {
    return "#FFEDA0";
  }
}

// function getColor(d) {
//   if (d > 10) {
//     return "#006d2c";
//   } else if (d > 5) {
//     return "#31a354";
//   } else if (d > 2) {
//     return "#74c476";
//   } else if (d > 1) {
//     return "#bae4b3";
//   } else {
//     return "#edf8e9";
//   }
// }

function style(feature) {
  const minPropertyValue = feature.properties.MIN;

  const fillColor = getColor(minPropertyValue);

  return {
    fillColor: fillColor,
    weight: 2,
    opacity: 1,
    color: "white",
    dashArray: "3",
    fillOpacity: 0.7,
  };
}

function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
    weight: 5,
    color: "#666",
    dashArray: "",
    fillOpacity: 0.7,
  });

  layer.bringToFront();
  info.update(layer.feature.properties);
}

function resetHighlight(e) {
  geojson.resetStyle(e.target);
  info.update();
}

function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: zoomToFeature,
  });
}

var geojson;

geojson = L.geoJson(kiambu_suitability, {
  style: style,
  onEachFeature: onEachFeature,
}).addTo(map);

var info = L.control();

info.onAdd = function (map) {
  this._div = L.DomUtil.create("div", "info"); // create a div with a class "info"
  this.update();
  return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
  this._div.innerHTML =
    "<h4>Kiambu Basil suitability</h4>" +
    (props
      ? "<b>" + props.NAME_5 + "</b><br />" + props.MIN
      : // " people / mi<sup>2</sup>"
        "Hover over sublocation");
};

info.addTo(map);

var legend = L.control({ position: "bottomright" });

legend.onAdd = function (map) {
  var div = L.DomUtil.create("div", "info legend"),
    grades = [0, 1, 2, 5],
    labels = [];

  // loop through our values of suitability and generate a label with a colored square for each interval
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i style="background:' +
      getColor(grades[i] + 1) +
      '"></i> ' +
      grades[i] +
      (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
  }

  return div;
};

legend.addTo(map);

// var box = [
//   -2.362060546875, 51.96245837645124, 7.62162297964096, 52.96245837645124,
// ];

// // define rectangle geographical bounds
// var bounds = [
//   [box[1], box[0]],
//   [box[3], box[2]],
// ];

// // create an orange rectangle
// L.rectangle(bounds, { color: "#ff7800", weight: 1 }).addTo(map);
// map.fitBounds(bounds);

// {
//     "type": "FeatureCollection",
//     "features": [
//       {
//         "type": "Feature",
//         "properties": {},
//         "geometry": {
//           "coordinates": [
//             [
//               [
//                 36.4183990735867,
//                 -1.3698875599250329
//               ],
//               [
//                 37.475949540026704,
//                 -1.3698875599250329
//               ],
//               [
//                 37.475949540026704,
//                 -0.7435135243348441
//               ],
//               [
//                 36.4183990735867,
//                 -0.7435135243348441
//               ],
//               [
//                 36.4183990735867,
//                 -1.3698875599250329
//               ]
//             ]
//           ],
//           "type": "Polygon"
//         }
//       }
//     ]
//   }

//   36.42414663046995,
//   -0.7492605935410523

//   37.47020198314351,
//   -0.7492605935410523

//   37.475949540026704,
//   -1.3641416388587118

//   36.412651516704756,
//   -1.3641416388587118

// const boundingBox = L.rectangle([southwest, northeast], {
//   color: "blue", // Border color
//   weight: 2, // Border weight
//   fillOpacity: 0.0, // Fill opacity (0 to make it transparent)
// }).addTo(map);
