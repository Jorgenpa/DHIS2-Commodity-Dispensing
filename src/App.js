import React from "react";
import classes from "./App.module.css";
import { useState } from "react";
import { useDataQuery } from "@dhis2/app-runtime"
import { CircularLoader } from "@dhis2/ui"

import { fetchNeighbors } from "./DataQueries";
import { Browse } from "./Browse";
import { Insert } from "./Insert";
import { Dispense } from "./Dispense";
import { Navigation } from "./Navigation";
import { DataElements } from "./DataElements";
import { Overview } from "./Overview";
import { NeighborOverview } from "./Neighbors";
import { Replenish } from "./Replenish";

function MyApp() {

  // Retrieves data from the API on the neighboring hospitals
  const { loading, error, data } = useDataQuery(fetchNeighbors())

  // Let commodity overview be the start page
  const [activePage, setActivePage] = useState("Dispense");
  let cart = []

  const [itemIsSelected, setItemIsSelected] = useState(false)
  const [itemData, setItemData] = useState([{}])

  function handleClick (e) {
    setItemIsSelected(!itemIsSelected)
    setItemData(e)
}

  function activePageHandler(page) {
    setActivePage(page);
  }

  if (error) {
    return <span>ERROR: {error.message}</span>
  }

  if (loading) {
    return <CircularLoader large />
  }

  if (data) {
    // Store data about the neighboring hospitals for reuse later
    const facilities = []

    data?.orgUnits?.children?.map((facility) => {
      if (facility.id !== "MnfykVk3zin") 
        facilities.push({name: facility.displayName, id: facility.id})
    })
            
    // Variables about our hospital for reuse later 
    let facilityData = {}
    facilityData.displayName = "Senjehun MCHP"
    facilityData.period = "202110"
    facilityData.orgUnit = "MnfykVk3zin"

    return (
      <div className={classes.container}>
        <div className={classes.left}>
          <Navigation
            activePage={activePage}
            activePageHandler={activePageHandler}
          />
        </div>
        <div className={classes.right}>
          {activePage === "Browse" && <Browse />}
          {activePage === "Insert" && <Insert />}
          {activePage === "Overview" && <Overview fd={facilityData} />}
          {activePage === "Neighbors" && <NeighborOverview fd={facilityData} neighbors={facilities} />}
          {activePage === "Dispense" && <Dispense 
            fd={facilityData} 
            cart={cart} 
            setItemIsSelected={setItemIsSelected}
            setItemData={setItemData}
            itemData={itemData}
            itemIsSelected={itemIsSelected}
            handleClick={handleClick}/>}
          {activePage === "Replenish" && <Replenish fd={facilityData} cart={cart} />}
          {activePage === "DataElements" && <DataElements fd={facilityData} />}
        </div>
      </div>
    );
  } 
}

export default MyApp;