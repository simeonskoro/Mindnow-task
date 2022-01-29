import { React, useRef, useState } from "react";
import { observer } from "mobx-react-lite";

import clear from "./clear.svg"
import icon from "./icon.svg"

import "./style.scss"
import { Link } from "react-router-dom";

const ids = {
  wrapper: "SearchBar-wrapper",
  logo: "SearchBar-logo",
  favorites: "SearchBar-favorites",
  inputWrapper: "SearchBar-inputWrapper",
  input: "SearchBar-input",
  icon: "SearchBar-icon",
  clearButton: "SearchBar-clearButton",
  clearIcon: "SearchBar-clearIcon",
  dropDown: "SearchBar-dropDown",
  scrollerDiv: "SearchBar-scrollerDiv",
  showAllButton: "SearchBar-showAllButton",
}
const classes = {
  entryWrapper: "SearchBar-DropDownEntry-wrapper",
  highlight: "SearchBar-DropDownEntry-highlight",
  favorite: "SearchBar-DropDownEntry-favorite",
  starIcon: "SearchBar-DropDownEntry-starIcon",
}

const DropDownEntry = (props) => {
  const { id, name, favorite, string, callback, favoriteCallback } = props

  const spans = []

  // ================================================= //
  // This part of the code recreates the name string with actual capitalization so that it doesnt get lost when checking the regex that
  // that has be toUpperCase()-ed along with the name string, so that the results would include non-case-sensitive results, but still display their actual casing.
  let tempName = name
  let i = null
  let cumulative = 0
  while (i !== -1) {
    i = tempName.toUpperCase().search(new RegExp(`${string.toUpperCase()}`, "g"))
    if (i !== -1) {
      const leading = tempName.substring(0, i)
      const trailing = tempName.substring(i + string.length, tempName.length)
      if (leading) spans.push(<span key={`${id}-leading-${cumulative + i}`} >{leading}</span>)
      spans.push(<span key={`${id}-${string}-${cumulative + i}`} className={classes.highlight}>{tempName.substring(i, i + string.length)}</span>)
      tempName = trailing
      cumulative += i + 1
    }
  }
  if (tempName) spans.push(<span key={`${id}-trailing-${cumulative + i}`} >{tempName}</span>)
  // ================================================= //

  return (<Link
    className={classes.entryWrapper}
    to={`/${id}`}
    onClick={(event) => {
      event.stopPropagation()
      event.currentTarget.blur()
      callback(id)
    }}
    onKeyDown={(event) => {
      if (event.key === "Enter") {
        event.stopPropagation()
        event.target.blur()
        callback(id)
      }
    }}
  >
    <div>
      {spans}
    </div>
    <button
      className={classes.favorite}
      type="button"
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        favoriteCallback(id)
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault()
          event.stopPropagation()
          favoriteCallback(id)
        }
      }}
    >
      {/* A star SVG path for the favorite icon */}
      <svg className={`${classes.starIcon}${favorite ? " favorite" : ""}`} version="1.1"
        xmlns="http://www.w3.org/2000/svg" viewBox="40 40 20 20" preserveAspectRatio="xMidYMid meet">
        <path d="M 50 42 L 52.35 46.76 L 57.61 47.53 L 53.8 51.24 L 54.7 56.47 L 50 54 L 45.3 56.47 L 46.2 51.24 L 42.39 47.53 L 47.65 46.76 Z" strokeWidth="1.25" />
      </svg>
    </button>
  </Link>)
}

const SearchBar = observer(({ className, breweries, toggleFavorite }) => {
  // inputValue for the controlled input component
  const [inputValue, setInputValue] = useState("")
  const inputRef = useRef()
  const showAllRef = useRef()
  // breweries filtered based on user input in the search bar
  const filteredBreweries = (inputValue && breweries.filter(brewery => brewery.name.toUpperCase().match(new RegExp(`${inputValue.toUpperCase()}`, "g")))) || []

  return (
    <div id={ids.wrapper} className={className}>
      <Link
        id={ids.logo}
        tabIndex={-1}
        to={"/"}
        onClick={() => setInputValue("")}
      >
        <img
          src="//logo.clearbit.com/hopsandbarley.nl"
          alt="Hops&amp;Barley Logo"
        />
      </Link>
      <div id={ids.inputWrapper} data-found={!!filteredBreweries.length}>
        <div id={ids.dropDown}>
          <div id={ids.scrollerDiv}>
            {filteredBreweries.map((brewery) => (
              <DropDownEntry
                key={brewery.id}
                id={brewery.id}
                name={brewery.name}
                favorite={!!brewery.favorite}
                string={inputValue}
                callback={(id) => setInputValue(breweries.find((brewery) => brewery.id === id)?.name || "")
                }
                favoriteCallback={(id) => {
                  inputRef.current.focus()
                  toggleFavorite(id)
                }}
              />)
            )}
          </div>
          <Link
            ref={showAllRef}
            id={ids.showAllButton}
            to={`/results?search=${inputValue}&page=1`}
            onClick={(event) => {
              event.stopPropagation()
              event.target.blur()
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.stopPropagation()
                event.target.click()
                event.target.blur()
              }
            }}
          >
            Show All Results
          </Link>
        </div>
        <input
          ref={inputRef}
          id={ids.input}
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault()
              event.stopPropagation()
              if (inputValue.replaceAll(" ", "")) {
                showAllRef.current.click()
                event.target.blur()
              }
            }
            if (event.key === "Escape")
              event.target.blur()
          }}
          autoComplete="off"
          spellCheck="false"
        />
        <img id={ids.icon} src={icon} alt="Search" />
        <button
          id={ids.clearButton}
          data-active={!!inputValue}
          type="button"
          onClick={() => setInputValue("")}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault()
              event.stopPropagation()
              setInputValue("")
            }
          }}>
          <img id={ids.clearIcon} src={clear} alt="Clear search" />
        </button>
      </div>
      <Link id={ids.favorites} to={"/favorites?page=1"}>
        {/* A star SVG path for the favorite icon */}
        <svg version="1.1"
          xmlns="http://www.w3.org/2000/svg" viewBox="40 40 20 20" preserveAspectRatio="xMidYMid meet">
          <path d="M 50 42 L 52.35 46.76 L 57.61 47.53 L 53.8 51.24 L 54.7 56.47 L 50 54 L 45.3 56.47 L 46.2 51.24 L 42.39 47.53 L 47.65 46.76 Z" strokeWidth="1.25" />
        </svg></Link>
    </div>
  )
}
)

export default SearchBar