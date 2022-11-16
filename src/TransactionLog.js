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

import { getStore } from "./DataQueries";
import { getRestock } from "./DataQueries";

export function TransactionLog(props) {
  const { data, error, loading} = useDataQuery(getStore());
  const { data:data2, error: error2, loading:loading2} = useDataQuery(getRestock())
  
  if (error) {
    return <span>ERROR: {error.message}</span>
  }

  if (loading || loading2) {
    return <CircularLoader large />
  }

  if (data) {

    let array = []
    data?.dataStore?.data?.map(val => {
      array.push(val)
    })
    let array2 = []

    data2?.dataStore?.data?.map(val => {
      array2.push(val)
    })
    
    if (props.tabIsSelected) { 
    return (
      <>
    <TabBar>
      <Tab id="dispensing" onClick={() => {props.handleClick(event)}}>Dispensing</Tab>

      <Tab id="restock" onClick={() => {props.handleClick(event)}}>Restock</Tab>
    </TabBar>
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
    </>
    )}
    else { 
      return (
        <>
          <TabBar>
          <Tab id="dispensing" onClick={() => {props.handleClick(event)}}>Dispensing</Tab>
    
          <Tab id="restock" onClick={() => {props.handleClick(event)}}>Restock</Tab>
        </TabBar>
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
        </>
        )
    }
    
    }


  /*
  useEffect(() => {
    refetch({
      key: tabIsSelected
    })
  }, [tabIsSelected])
  */
    /*
  if (tabIsSelected == "dispensing") {
    return(
    <>
    <TabBar id="dsfsf">
      <Tab key="dispensing" onClick={() => {handleClick()}}>Dispensing</Tab>

      <Tab key="restock" onClick={() => {handleClick()}}>Restock</Tab>
    </TabBar>
    <Button>Hello</Button>
    </>
    )
  } 
  else {
    return(
      <TabBar>
      <Tab id="dispensing" onClick={() => {handleClick()}}>Dispensing</Tab>

      <Tab id="restock" onClick={() => {handleClick()}}>Restock</Tab>
      </TabBar>
    )
  }
  */
}