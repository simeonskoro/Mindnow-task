import { makeObservable, observable, action } from "mobx";

class BreweriesStore {
  rootStore;
  breweries = [];
  favorites = [];
  favorizedBreweries = [];

  favorizeBreweries = () => {
    console.log("Favorizing Breweries...");
    this.favorizedBreweries.clear();
    this.breweries.forEach((brewery) =>
      this.favorizedBreweries.push({
        ...brewery,
        latitude: brewery.latitude ? Number(brewery.latitude) : null,
        longitude: brewery.longitude ? Number(brewery.longitude) : null,
        favorite: this.favorites.indexOf(brewery.id) !== -1,
      })
    );
  };

  toggleFavorite = (id) => {
    console.log("Toggling", id);
    if (this.favorites.indexOf(id) === -1) this.favorites.push(id);
    else {
      const temp = [...this.favorites];
      this.favorites = [...temp.filter((e) => e !== id)];
    }
    this.favorizeBreweries();
  };

  // addFavorite = (id) => {
  //   if (this.favorites.indexOf(id) === -1) this.favorites.push(id);
  // };

  // removeFavorite = (id) => {
  //   const temp = [...this.favorites];
  //   this.favorites = [...temp.filter((e) => e !== id)];
  // };

  setBreweries = (breweries) => {
    console.log("Setting Breweries...");
    this.breweries = [...breweries];
    this.favorizeBreweries();
  };

  fetchBreweries() {
    console.log("Fetching Breweries...");
    fetch("https://api.openbrewerydb.org/breweries")
      .then((response) => response.json())
      .then((data) => {
        this.setBreweries(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  constructor(rootStore) {
    console.log("Constructing Breweries Store...");
    makeObservable(this, {
      rootStore: false,
      breweries: false,
      favorites: false,
      favorizedBreweries: observable,
      // addFavorite: action.bound,
      // removeFavorite: action.bound,
      favorizeBreweries: action.bound,
      toggleFavorite: action.bound,
      setBreweries: action.bound,
      fetchBreweries: action.bound,
    });
    this.rootStore = rootStore;
    this.fetchBreweries();
  }
}

export default BreweriesStore;
