import { useDataQuery } from "@dhis2/app-runtime"
import { CircularLoader } from "@dhis2/ui"
import React from 'react';
import { useState, useEffect } from 'react';
import {
  DataTable,
  DataTableCell,
  DataTableColumnHeader,
  DataTableHead,
  DataTableBody,
  DataTableRow,
  TableRowHead,
  DataTableToolbar,
  Field,
  Button,
  TabBar,
  Tab,
} from '@dhis2/ui'

import { fetchHospitalData } from "./DataQueries";


export function TransactionLog(props) {
  const { loading, error, data } = useDataQuery(fetchHospitalData(), {
    variables: {
      orgUnit: props.fd.orgUnit,
      period: props.fd.period,
    }
  })

  if (error) {
    return <span>ERROR: {error.message}</span>
  }

  if (loading) {
    return <CircularLoader large />
  }

  if (data) {

    let array = []
    data?.dispensingHistory?.data?.map(val => {
      array.push(val)
    })
    let array2 = []

    data?.restockHistory?.data?.map(val => {
      array2.push(val)
    })

    return (
      <>
        <div style={{ width: "fit-content" }}>
          <TabBar>
            <Tab id="dispensing" onClick={() => { props.handleClick("dispensing") }} >Dispensing</Tab>
            <Tab id="restock" onClick={() => { props.handleClick("restock") }}>Restock</Tab>
          </TabBar>
        </div>
        {props.tabIsSelected == "dispensing" ?
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
              {array.map((item, index) =>
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
              <DataTableColumnHeader>ID</DataTableColumnHeader>
              <DataTableColumnHeader>Amount</DataTableColumnHeader>
            </DataTableHead>
            <DataTableBody>
              {array.map((item, index) =>
                <DataTableRow key={index}>
                  <DataTableCell>
                    {item.commodityId}
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