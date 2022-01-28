import { makeAutoObservable } from "mobx";

import BreweriesStore from "./breweries";

class RootStore {
  constructor() {
    console.log("Constructing Root Store...");
    makeAutoObservable(this);
    this.breweriesStore = new BreweriesStore(this);
  }
}

export default RootStore;
