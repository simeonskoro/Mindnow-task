import { Map, Marker, GoogleApiWrapper } from "google-maps-react"

import "./style.scss"

const ids = {
  mapOverlay: "Map-mapOverlay",
}

const MapContainer = (props) => {
  const { center, zoom = 3, markers = [] } = props

  return <>
    <Map
      google={props.google}
      zoom={zoom}
      disableDefaultUI={true}
      center={center}
      className="Map-container"
    >
      {markers.map(marker => (
        <Marker key={`${marker.name}: ${marker.lng}/${marker.lat}`} title={marker.name} position={{ lat: marker.lat, lng: marker.lng }}></Marker>
      ))}
    </Map>
    <div id={ids.mapOverlay} />
  </>
}

const GoogleMap = GoogleApiWrapper((props) => ({
  // apiKey: "",  I have no key (so there's the "For development prposes only" text in the map)
}))(MapContainer)

export default GoogleMap