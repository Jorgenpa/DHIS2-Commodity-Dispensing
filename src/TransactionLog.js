import { useDataQuery } from "@dhis2/app-runtime"
import { CircularLoader } from "@dhis2/ui"
import React from 'react';
import { useState } from 'react';
import {
  DataTable,
  DataTableCell,
  DataTableColumnHeader,
  DataTableHead,
  DataTableBody,
  DataTableRow,
  TabBar,
  Tab,
} from '@dhis2/ui'

import { fetchHospitalData } from "./DataQueries";


// Retrieves data from the dataStore API and displays logs of dispensing history and restocking history
export function TransactionLog(props) {
  const { loading, error, data } = useDataQuery(fetchHospitalData(), {
    variables: {
      orgUnit: props.fd.orgUnit,
      period: props.fd.period,
    }
  })
  const [selectedTab, setSelectedTab] = useState("dispensing")

  if (error) {
    return <span>ERROR: {error.message}</span>
  }

  if (loading) {
    return <CircularLoader large />
  }

  if (data) {

    let dispenseArray = []
    data?.dispensingHistory?.data?.map(val => {
      dispenseArray.push(val)
    })
    let initialRestockArray = []

    data?.restockHistory?.data?.map(val => {
      initialRestockArray.push(val)
    })

    let restockArray = [].concat.apply([], initialRestockArray);

    const handleClick = (tab) => {
      setSelectedTab(tab)
    }

    return (
      <>
        <div style={{ width: "fit-content" }}>
          <TabBar>
            <Tab id="dispensing" onClick={() => { handleClick("dispensing") }} selected={"dispensing" == selectedTab} >Dispensing</Tab>
            <Tab id="restock" onClick={() => { handleClick("restock") }} selected={"restock" == selectedTab} >Restock</Tab>
          </TabBar>
        </div>
        {selectedTab == "dispensing" ?
          <DataTable>
            <DataTableHead>
              <DataTableColumnHeader>Date</DataTableColumnHeader>
              <DataTableColumnHeader>ID</DataTableColumnHeader>
              <DataTableColumnHeader>Commodity</DataTableColumnHeader>
              <DataTableColumnHeader>From</DataTableColumnHeader>
              <DataTableColumnHeader>To</DataTableColumnHeader>
              <DataTableColumnHeader>Amount</DataTableColumnHeader>
            </DataTableHead>
            <DataTableBody>
              {dispenseArray.map((item, index) =>
                <DataTableRow key={index}>
                  <DataTableCell>
                    {item.date}
                  </DataTableCell>
                  <DataTableCell>
                    {item.commodityId}
                  </DataTableCell>
                  <DataTableCell>
                    {item.commodityName}
                  </DataTableCell>
                  <DataTableCell>
                    {item.dispensedBy}
                  </DataTableCell>
                  <DataTableCell>
                    {item.dispensedTo}
                  </DataTableCell>
                  <DataTableCell>
                    {item.amount}
                  </DataTableCell>
                </DataTableRow>
              )}
            </DataTableBody>
          </DataTable>
          :
          <DataTable>
            <DataTableHead>
            <DataTableColumnHeader>Date</DataTableColumnHeader>
              <DataTableColumnHeader>ID</DataTableColumnHeader>
              <DataTableColumnHeader>Commodity</DataTableColumnHeader>
              <DataTableColumnHeader>Amount</DataTableColumnHeader>
            </DataTableHead>
            <DataTableBody>
              {restockArray.map((item, index) =>
                <DataTableRow key={index}>
                  <DataTableCell>
                    {item.date}
                  </DataTableCell>
                  <DataTableCell>
                    {item.commodityId}
                  </DataTableCell>
                  <DataTableCell>
                    {item.commodityName}
                  </DataTableCell>
                  <DataTableCell>
                    {item.amount}
                  </DataTableCell>
                </DataTableRow>
              )}
            </DataTableBody>
          </DataTable>
        }
      </>
    )
  }
}