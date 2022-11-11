import { useDataQuery } from "@dhis2/app-runtime"
import { CircularLoader } from "@dhis2/ui"
import React, { useState } from 'react';
import {useRef, useEffect} from 'react';
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
    DropdownButton,
    FlyoutMenu,
    MenuItem,
    Button,
    Input,
} from '@dhis2/ui'
import { fetchHospitalData } from "./DataQueries";

export function Replenish(props) {
  const { loading, error, data } = useDataQuery(fetchHospitalData(), {
    variables: {
        orgUnit: props.fd.orgUnit,
        period: props.fd.period,
    }
  })

  const [values, setValues] = useState([])


  const handleInput = (evt) => {
    const value  = evt.value;
    setValues(prevState => ({
        ...prevState,
        [evt.name]: value
    }));
}

  let array = []

  data?.dataSets?.dataSets[0]?.dataSetElements?.map(dataValue => {
      array.push({
          "id": dataValue.dataElement.id,
          "name": dataValue.dataElement.name.split("-")[1].trim()
      })
  }
  );

  function handleArray () {
    for (let i = 0; i < array.length; i++) {
      let val = values[array[i].name]
      props.cart.push({
        "id":array[i].name,
        "amount":val,
        "from":"",
        "to":""
      })
    }
    console.log(props.cart)
  }

  if (error) {
    return <span>ERROR: {error.message}</span>
  }

  if (loading) {
      return <CircularLoader large />
  }

  if (data) {
    return (
      <form>
        <DataTable>
          <DataTableHead>
            <DataTableRow>
              <DataTableColumnHeader>Commodity</DataTableColumnHeader>
              <DataTableColumnHeader>Amount</DataTableColumnHeader>
            </DataTableRow>
          </DataTableHead>
          <DataTableBody>
          {array?.map((dataValue, index) =>
              <DataTableRow key={index}>
                  <DataTableCell>{dataValue.name}</DataTableCell>
                  <DataTableCell>
                    <Input 
                    id={dataValue.id}
                    name={dataValue.name}
                    placeholder="Amount"
                    onChange={handleInput}
                     >
                    </Input>
                  </DataTableCell>
              </DataTableRow>
          )}
          </DataTableBody>
        </DataTable>
        <Button onClick={handleArray}>
          Send
        </Button>
      </form>
    )
  }
}