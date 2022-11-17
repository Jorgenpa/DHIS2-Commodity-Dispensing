import React from "react";
import classes from "./App.module.css";
import { useState } from "react";
import { useDataQuery } from "@dhis2/app-runtime"
import { CircularLoader } from "@dhis2/ui"

import { fetchNeighbors } from "./DataQueries";
import { Dispense } from "./Dispense";
import { Navigation } from "./Navigation";
import { DataElements } from "./DataElements";
import { Overview } from "./Overview";
import { NeighborOverview } from "./Neighbors";
import { Replenish } from "./Replenish";
import { TransactionLog} from "./TransactionLog";

function MyApp() {

  // Retrieves data from the API on the neighboring hospitals
  const { loading, error, data } = useDataQuery(fetchNeighbors())

  // Let commodity overview be the start page
  const [activePage, setActivePage] = useState("Overview");
  let cart = []
  let storeData = []
  let restockData = []

  const [tabIsSelected, setTabIsSelected] = useState(true)
  function handleClick () {
    setTabIsSelected(!tabIsSelected)

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
          {activePage === "Overview" && <Overview fd={facilityData} />}
          {activePage === "Neighbors" && <NeighborOverview fd={facilityData} neighbors={facilities} />}
          {activePage === "Dispense" && <Dispense 
            fd={facilityData} 
            cart={cart} 
            storeData={storeData}/>}
          {activePage === "Replenish" && <Replenish fd={facilityData} cart={cart} restockData={restockData} />}
          {activePage === "DataElements" && <DataElements fd={facilityData} />}
          {activePage === "TransactionLog" && <TransactionLog 
          setTabIsSelected={setTabIsSelected}
          tabIsSelected={tabIsSelected}
          handleClick={handleClick}/>}
        </div>
      </div>
    );
  } 
}

export default MyApp;