import React from "react";
import { observer } from "mobx-react-lite";
import { useQuery } from "../../hooks"

import Map from "../Map";
import BreweryResult from "./BreweryResult";
import arrow from './arrow.svg'

import "./style.scss"
import { Link, useParams } from "react-router-dom";

const ids = {
  wrapper: "Results-wrapper",
  content: "Results-content",
  query: "Results-query",
  entries: "Results-entries",
  pagination: "Results-pagination",
  pageNumber: "Results-pageNumber",
}

const classes = {
  paginationButton: "Results-paginationButton",
  arrowImg: "Results-arrowImg",
}

const Results = observer(({ breweries, toggleFavorite }) => {
  const params = useParams();
  const query = useQuery()
  const page = Number(query.get("page"))
  const search = query.get("search")

  let filteredBreweries = []
  let pages = 0
  let link = ""

  if (params["*"] === "results") {
    link = `/results?search=${search}&`
    filteredBreweries = (search && breweries.filter(brewery => brewery.name.toUpperCase().match(new RegExp(`${search.toUpperCase()}`, "g")))) || []
    pages = Math.ceil(filteredBreweries.length / 6) || 1
  } else if (params["*"] === "favorites") {
    link = `/favorites?`
    filteredBreweries = breweries.filter(brewery => brewery.favorite) || []
    pages = Math.ceil(filteredBreweries.length / 6) || 1
  }

  const pageWithinBounds = (page > 0) && (page <= pages)

  const markers = filteredBreweries.slice((page - 1) * 6, page * 6).map(brewery => (brewery.latitude && brewery.longitude) ? { name: brewery.name, lat: brewery.latitude, lng: brewery.longitude } : null).filter(e => e)

  // const markers = [{ name: "-0.05,-0.05", lat: -0.05, lng: -0.05 }, { name: "0.05,0.05", lat: 0.05, lng: 0.05 }]
  // const markers = [{ name: "50,20", lat: 50, lng: 20 }]

  // markers.push({ name: 'MIN', lat: markersSpan.min.lat, lng: markersSpan.min.lng })
  // markers.push({ name: 'MAX', lat: markersSpan.max.lat, lng: markersSpan.max.lng })

  const markersSpan = markers.reduce((acc, cur) => {
    const res = { ...acc }
    res.min.lat = Math.min(res.min.lat, cur.lat)
    res.min.lng = Math.min(res.min.lng, cur.lng)
    res.max.lat = Math.max(res.max.lat, cur.lat)
    res.max.lng = Math.max(res.max.lng, cur.lng)
    return res
  }, { min: { lat: Infinity, lng: Infinity }, max: { lat: -Infinity, lng: -Infinity } })

  const markerLatRange = Math.max(markersSpan.max.lat - markersSpan.min.lat, 10)
  const markerLngRange = Math.max(markersSpan.max.lng - markersSpan.min.lng, 10)

  const maxDist = Math.max((Math.max(markerLatRange, markerLngRange)), 5)

  const widthPonder = window.innerWidth / 1800
  const zoom = Math.max((14.75 - 11.75 * ((maxDist + 5) / 100) ** 0.14) * widthPonder, 2)
  const offset = (markers.length > 1) ? ((10 ** 6 / ((zoom ** 5.2) * markerLngRange)) * widthPonder ** 3) : zoom
  const center = { lat: (markersSpan.min.lat + markersSpan.max.lat) / 2, lng: ((markersSpan.min.lng + markersSpan.max.lng) / 2) - offset }

  return (
    <div id={ids.wrapper}>
      <Map center={center} markers={markers} zoom={zoom} />
      <div id={ids.content}>
        {params["*"] === "results" ? (
          <span id={ids.query}>{filteredBreweries.length ? `Showing results for "${search}"` : "No results match your query."}
          </span>
        ) : null}
        <div id={ids.entries}>
          {pageWithinBounds ? filteredBreweries.slice((page - 1) * 6, page * 6).map(brewery => (<BreweryResult key={brewery.id} brewery={brewery} callback={(id) => toggleFavorite(id)} />)) : ""}
        </div>
        <div id={ids.pagination}>
          <Link
            className={classes.paginationButton + ((page === 1) ? " disabled" : "")}
            to={`${link}page=${page - 1}`}
            tabIndex={(page === 1) ? -1 : 0}
            onClick={(event) => {
              if (page === 1) event.preventDefault()
              event.currentTarget.blur()
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault()
                event.stopPropagation()
                event.currentTarget.blur()
              }
            }}
          >
            <img className={classes.arrowImg} src={arrow} alt="Previous page" />
          </Link>
          <span id={ids.pageNumber}>{page}</span>
          <Link
            className={classes.paginationButton + ((page > (pages - 1)) ? " disabled" : "")}
            to={`${link}page=${page + 1}`}
            tabIndex={(page > (pages - 1)) ? -1 : 0}
            onClick={(event) => {
              if (page > (pages - 1)) event.preventDefault()
              event.currentTarget.blur()
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault()
                event.stopPropagation()
                event.currentTarget.blur()
              }
            }}
          >
            <img className={classes.arrowImg} src={arrow} alt="Next page" />
          </Link>
        </div>
      </div>
    </div>
  )
})

export default Results