import { React } from "react";
import { Link } from "react-router-dom";

const classes = {
  wrapper: "BreweryResult-wrapper",
  logoDiv: "BreweryResult-logoDiv",
  leftSideInfoDiv: "BreweryResult-leftSideInfoDiv",
  name: "BreweryResult-name",
  size: "BreweryResult-size",
  rightSideInfoDiv: "BreweryResult-rightSideInfoDiv",
  location: "BreweryResult-location",
  favoriteButton: "BreweryResult-favoriteButton",
  starIcon: "BreweryResult-starIcon",
}

const BreweryResult = ({ brewery, callback }) => {

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

  return (
    <Link to={`/${brewery.id}`} className={classes.wrapper}>
      <div className={classes.logoDiv}>LOGO</div>
      <div className={classes.leftSideInfoDiv}>
        <span className={classes.name}>{brewery.name}</span>
        <span className={classes.size}>{brewery.brewery_type}</span>
      </div>
      <div className={classes.rightSideInfoDiv}>
        <button
          className={classes.favoriteButton}
          type="button"
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            event.currentTarget.blur()
            callback(brewery.id)
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault()
              event.stopPropagation()
              event.currentTarget.blur()
              callback(brewery.id)
            }
          }}
        >
          <svg className={`${classes.starIcon}${brewery.favorite ? " favorite" : ""}`} version="1.1"
            xmlns="http://www.w3.org/2000/svg" viewBox="40 40 20 20" preserveAspectRatio="xMidYMid meet">
            <path d="M 50 42 L 52.35 46.76 L 57.61 47.53 L 53.8 51.24 L 54.7 56.47 L 50 54 L 45.3 56.47 L 46.2 51.24 L 42.39 47.53 L 47.65 46.76 Z" strokeWidth="1.25" />
          </svg>
        </button>
        <span className={classes.location}>{location}</span>
      </div>
    </Link>
  )
}

export default BreweryResult