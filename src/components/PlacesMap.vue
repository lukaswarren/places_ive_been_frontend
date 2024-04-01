<script setup>
import { ref, computed } from "vue";
import "leaflet/dist/leaflet.css"
import locationData from "../assets/custom.geo.json"
import { LMap, LTileLayer, LGeoJson, LMarker, LPopup} from "@vue-leaflet/vue-leaflet"

const zoom = ref(3)
const center = ref([35.61, -40.67])
const zoomLevel = ref(null)
const countries = ref({countries : [{country:"Mexico", visits: "3"},
                        {country: "United States of America", visits: "4"}, 
                        {country: "Spain", visits: "1"}]})
const geojson = locationData
const currentCountry = ref(null)
const markers = ref([
  { 
    country: 'Mexico', 
    city: 'Mexico City', 
    latLng: [19.43, -99.13], 
    visible: false,
    visits: [
      { date: '2024-03-01', visitNumber: 1 },
      { date: '2024-03-15', visitNumber: 2 }
    ]
  },
  { 
    country: 'United States of America', 
    city: 'Denver', 
    latLng: [39.74, -104.99], 
    visible: false,
    visits: [
      { date: '2024-04-01', visitNumber: 1 }
    ]
  },
  { 
    country: 'Spain', 
    city: 'Barcelona', 
    latLng: [41.39, 2.17], 
    visible: false,
    visits: [
      { date: '2024-04-15', visitNumber: 1 }
    ]
  },
  { 
    country: 'Mexico', 
    city: 'Veracruz',
    latLng: [19.19, -96.15], 
    visible: false,
    visits: [
      { visitNumber: 1, date: '2023-09-10' }
    ]
  }
]);

function getColor(v) {
  return v > 3 ? "#2171b5" :
         v > 2 ? "#6baed6" :
         v > 1 ? "#bdd7e7" :
                 "#eff3ff";
}
/*
improvement for service function
Here's the code without spaces between lines:

```javascript
const visitCache = {}
function preprocessVisitData() {
  countries.value.forEach(country => {
    visitCache[country.country] = parseInt(country.visits)
  })
}
preprocessVisitData()
const colorLookup = {
  3: "#2171b5",
  2: "#6baed6",
  1: "#bdd7e7",
  0: "#eff3ff"
}
function getColor(v) {
  return colorLookup[v] || "#eff3ff"
}
function getVisit(country) {
  return visitCache[country] || 0
}
```
*/
function getVisit (countryName) {
  const country = countries.value.countries.find(c => c.country === countryName);
  return country ? parseInt(country.visits) : 0;
  
}
function style(feature) {
    return {
        fillColor: getColor(getVisit(feature.properties.name)),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}
function highlightFeature() {
  const layer = this;
  layer.setStyle({
    weight: 5,
    color: "#666",
    dashArray: "",
    fillOpacity: 0.7
  });
  layer.bringToFront();
  
}
function resetHighlight(event) {
  var layer = this
  layer.setStyle({
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
  });
}

function markerVisibilityToggle(countryName) {
  currentCountry.value = null;
  markers.value.forEach(marker => {
    if (marker.country === countryName) {
      marker.visible = !marker.visible;
    }
  });
}

function zoomToFeature(event) {
  this._map.fitBounds(event.target.getBounds())
  const country = event.target.feature.properties.name
  markerVisibilityToggle(country)   
}


const options = computed(() =>{
  return {
    onEachFeature: function (feature, layer){
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
      });
    }
  };
})

</script>

<template>
  <main>
    <l-map ref="map" :zoom="zoom" :center="center" :useGlobalLeaflet="false" >
      <l-tile-layer url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
                    layer-type="base"
                    name="Stadia Maps Basemap"></l-tile-layer>
      <l-geo-json  :geojson="geojson" :options-style="style" :options="options"></l-geo-json>
      <l-marker v-for="(marker, index) in markers" :key="index" :lat-lng="marker.latLng" :visible="marker.visible" >
        <l-popup>
          <div class="marker-details">
              <h2>{{ marker.country }}</h2>
              <p>City: {{ marker.city }}</p>
              <ul>
                <li v-for="(visit, visitIndex) in marker.visits" :key="visitIndex">
                  <b>Visit Number:</b> {{ visit.visitNumber }}, <b>Date:</b> {{ visit.date }}
                </li>
              </ul>
            </div>
        </l-popup>
      </l-marker>
    </l-map>
  </main>
</template>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
}

main {
  width: 100%;
  height: 80vh;
  overflow: hidden;
}

.map {
  width: 100%;
  height: 100%;
}

/* header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
} */
</style>