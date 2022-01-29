import { makeAutoObservable } from "mobx";

import BreweriesStore from "./breweries";

// Created a root store only because in a real project I would do it this way, because of actual need for multiple stores, and not just breweries.

class RootStore {
  constructor() {
    console.log("Constructing Root Store...");
    makeAutoObservable(this);
    this.breweriesStore = new BreweriesStore(this);
  }
}

export default RootStore;
