import { observer } from "mobx-react-lite";
import React from "react";
import { useParams } from "react-router-dom";

import Map from "../Map";

import "./style.scss"

const ids = {
  wrapper: "BreweryPage-wrapper",
  notFound: "BreweryPage-notFound",
  leftSideDiv: "BreweryPage-leftSideDiv",
  rightSideDiv: "BreweryPage-rightSideDiv",
  breweryLogo: "BreweryPage-breweryLogo",
  name: "BreweryPage-name",
  favorite: "BreweryPage-favorite",
  star: "BreweryPage-star",
}

const BreweryPage = observer(({ breweries, toggleFavorite }) => {
  const params = useParams();

  if (!params["*"]) return null

  const brewery = breweries.find(brewery => brewery.id === params["*"])

  if (!brewery) return null

  // ================================================================== //
  // creating the location string based on available props for the brewery
  // (if I had more reusable functions throughout this project I would definitely create a helpers.js file
  // where I would store them all, and import them where I need them, but since it is just this one, I just
  // copied and pasted the code)
  let location = ""
  if (brewery.street) {
    location = location.concat(brewery.street)
    if (brewery.city) location = location.concat(", ", brewery.city)
  }
  if (brewery.state) {
    if (location) location = location.concat(", ")
    location = location.concat(brewery.state)
  }
  if (brewery.country) {
    if (location) location = location.concat(", ")
    location = location.concat(brewery.country)
  }
  if (brewery.postal_code) {
    if (location) location = location.concat(", ")
    location = location.concat(brewery.postal_code)
  }
  // ================================================================== //

  // *note - not all breweries have their coord (lat/lng) so they can't appear on the Map
  const hasCoords = !!(brewery.latitude && brewery.longitude)
  const center = { lat: brewery.latitude, lng: brewery.longitude - 0.01 }

  return !!brewery ? (
    <div id={ids.wrapper}>
      <Map center={center} markers={hasCoords ? [{ name: brewery.name, lat: brewery.latitude, lng: brewery.longitude }] : []} zoom={15 + Math.random()} />
      <div id={ids.leftSideDiv}>
        <button
          id={ids.favorite}
          type="button"
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            event.currentTarget.blur()
            toggleFavorite(brewery.id)
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault()
              event.stopPropagation()
              event.target.blur()
              toggleFavorite(brewery.id)
            }
          }}
        >
          <svg id={ids.star} className={brewery.favorite ? " favorite" : ""} version="1.1"
            xmlns="http://www.w3.org/2000/svg" viewBox="40 40 20 20" preserveAspectRatio="xMidYMid meet">
            <path d="M 50 42 L 52.35 46.76 L 57.61 47.53 L 53.8 51.24 L 54.7 56.47 L 50 54 L 45.3 56.47 L 46.2 51.24 L 42.39 47.53 L 47.65 46.76 Z" strokeWidth="1" />
          </svg>
        </button>
        <div id={ids.breweryLogo}>
          Placeholder Logo
        </div>
        <span id={ids.name}>
          {brewery.name}
        </span>
        <span>
          Brewery type: {brewery.brewery_type}
        </span>
        <span>
          Address: {location}
        </span>
        <span>
          Phone: {brewery.phone}
        </span>
        {brewery.website_url ? (<a href={brewery.website_url}>Web page</a>) : null}
      </div>
      {/* <div id={ids.rightSideDiv}>
        <span>About us...</span>
        <span>Lorem ipsum dolor sit amet consectetur, adipisicing elit. A tempore omnis odit similique ipsa nesciunt velit, reiciendis asperiores suscipit harum ut illum eum dolores quos aut error dicta eveniet repudiandae dolore, porro possimus? Amet, reprehenderit illo. Voluptatum sequi sunt hic dicta possimus, ab quisquam nulla at officiis unde velit atque non itaque voluptas exercitationem! Soluta tempore expedita ullam corrupti, qui possimus hic error vel reprehenderit dolores explicabo mollitia aspernatur. Minima?</span>
        <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Error earum, eius quasi sint tempore, similique ipsum omnis molestias maiores sunt vero nam? Harum, consequuntur delectus at minus, eum officiis recusandae iure eius ipsa dolorem sunt eaque, veritatis eos explicabo architecto deserunt laborum ea ab. Sapiente corrupti non provident inventore consequuntur?</span>
        <span>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Maiores esse ea assumenda, labore illum sapiente praesentium. Eveniet repudiandae quae, hic omnis obcaecati veniam nostrum ratione corrupti, iure iste consectetur nam vitae maxime doloribus unde sit ea consequuntur beatae ab voluptatem harum libero, distinctio recusandae. Ipsum architecto quidem aspernatur, culpa beatae quia asperiores fugiat debitis enim dolore nemo a iusto esse, magnam vitae soluta nesciunt dolorem qui temporibus? Quo, explicabo ex eius doloremque consectetur similique iure, odit corporis mollitia nisi beatae blanditiis, accusamus porro dolorum pariatur. Ex suscipit doloremque hic odio.</span>
      </div> */}
    </div>
  ) : (<div id={ids.notFound}>Brewery not found!</div>)
})

export default BreweryPage