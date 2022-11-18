import { useDataQuery, useDataMutation } from "@dhis2/app-runtime"
import { CircularLoader } from "@dhis2/ui"
import React, { useState } from 'react';
import {useRef, useEffect} from 'react';

import {
    ReactFinalForm,
    InputFieldFF,
    SingleSelectFieldFF,
    SwitchFieldFF,
    composeValidators,
    createEqualTo,
    email,
    hasValue,
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
import { deposit } from "./DataQueries";
import { storeRestock } from "./DataQueries";

export function Replenish(props) {
  const { loading, error, data } = useDataQuery(fetchHospitalData(), {
    variables: {
        orgUnit: props.fd.orgUnit,
        period: props.fd.period,
    }
  })
  const [mutate] = useDataMutation(deposit());
  const [mutate2] = useDataMutation(storeRestock());
  const [values, setValues] = useState([])
  const [categoryValues, setCategoryValues] = useState([])

  data?.dataValueSets?.dataValues?.map(dataValue => {
      categoryValues.push({
          "id": dataValue.dataElement,
          "category": dataValue.categoryOptionCombo,
          "value": dataValue.value
      })
  })


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

  function getValues(commodity, categoryOptionCombo) {
    return categoryValues.find(value => value.id == commodity && value.category == categoryOptionCombo)
  }

  function updateValues(commodity, categoryOptionCombo, newValue) {
    let index = categoryValues.findIndex(obj => obj.id == commodity && obj.category == categoryOptionCombo)
    categoryValues[index].value = String(parseInt(categoryValues[index].value) + parseInt(newValue))
  }

  function handleSend () {
    const date = new Date();


    for (let i = 0; i < array.length; i++) {
      let val = values[array[i].name]
      if (val != undefined) {
        let endBalance = getValues(array[i].id, "rQLFnNXXIL0")
        console.log(val)
        console.log(values.amount)
      
        mutate({
          dataElement: array[i].id,
          categoryOptionCombo: "rQLFnNXXIL0",
          value: String(parseInt(val) + parseInt(endBalance.value))
        })

        props.restockData.push([{
          date: date,
          commodityId: array[i].id,
          commodityName: array[i].name,
          amount:val
     }])

        updateValues(array[i].id, "rQLFnNXXIL0", val)
      }
    }
    let superObject = {data: props.restockData}
    mutate2(superObject)

    props.restockData.length = 0;

  }

  if (error) {
    return <span>ERROR: {error.message}</span>
  }

  if (loading) {
      return <CircularLoader large />
  }

  if (data) {
    return (
      <div>
        <DataTable>
          <DataTableHead>
            <DataTableRow>
              <DataTableColumnHeader>Commodity</DataTableColumnHeader>
              <DataTableColumnHeader>Amount</DataTableColumnHeader>
            </DataTableRow>
          </DataTableHead>
          <DataTableBody>
          {array?.sort((a,b) => a.name > b.name ? 1 : -1).map((dataValue, index) =>
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
      <Button onClick={handleSend}>
          Send
      </Button>
      </div>
    )
  }
}