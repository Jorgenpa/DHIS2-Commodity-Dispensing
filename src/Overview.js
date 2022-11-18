import { useDataQuery, useDataMutation } from "@dhis2/app-runtime"
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
    InputField,
    Button,
    ButtonStrip
} from '@dhis2/ui'

import { fetchHospitalData, addDataStore, deposit, storeRestock } from "./DataQueries";
import DataTableRowWithInput from "./components/dataTableRowWithInput";


// Retrieves data from the life saving commodities API and creates a table with it. Restocking also happens here
export function Overview(props) {
    const [period, setPeriod] = useState(props?.fd?.period.slice(0,4) + "-" + props?.fd?.period.slice(4))
    const { loading, error, data, refetch } = useDataQuery(fetchHospitalData(), {
        variables: {
            orgUnit: props.fd.orgUnit,
            period: props.fd.period,
        }
    })

    const [mutate] = useDataMutation(deposit());
    const [mutate2] = useDataMutation(storeRestock());
    const [replenish, setReplenish] = useState(false)
    const [dataValues, setDataValues] = useState([])
    const [replenishValues, setReplenishValues] = useState(new Map())
    

    useEffect(() => {
        setDataValues(getTheValues())
    }, [data])

    useEffect(() => {
        console.log(props?.fd?.period.slice(0,4) + "-" + props?.fd?.period.slice(4));
    }, [props.fd.period])

    const getTheValues = () => {
        let array = []

        data?.dataSets?.dataSets[0]?.dataSetElements?.map(dataValue =>
            array.push({
                "id": dataValue.dataElement.id,
                "name": dataValue.dataElement.name.split("-")[1].trim()
            })
        );
        data?.dataValueSets?.dataValues?.map(dataValue => {
            array.map(arrValue => {
                if (arrValue.id == dataValue.dataElement) {
                    if (dataValue.categoryOptionCombo == "J2Qf1jtZuj8")
                        arrValue.con = dataValue.value
                    else if (dataValue.categoryOptionCombo == "rQLFnNXXIL0")
                        arrValue.end = dataValue.value
                    else if (dataValue.categoryOptionCombo == "KPP63zJPkOu")
                        arrValue.qua = dataValue.value
                }
            })
        })
        return array
    }

    if (error) {
        return <span>ERROR: {error.message}</span>
    }

    if (loading) {
        return <CircularLoader large />
    }

    if (data) {
        const handleClick = () => {
            setReplenish(!replenish)
        }

        function getValues(commodity) {
            let array = getTheValues()
            console.log(array)
            return array.find(value => value.id == commodity)
          }

        const sendValues = async () => {
            const date = new Date();
            let oneIsEmpty = false
            data?.restockHistory?.data?.map(val => {
                props.restockData.push(val)
              })

            replenishValues.forEach(item => {
                let endBalance = getValues(item.id)
                if (!item.value) {
                    oneIsEmpty = true
                    return
                }
                if (item.value != undefined) {
                    props.restockData.push([{
                        date: date,
                        commodityId: item.id,
                        commodityName: getTheValues().find(value=> value.id == item.id).name,
                        amount:item.value
                   }])
                   mutate({
                    dataElement: item.id,
                    categoryOptionCombo: "rQLFnNXXIL0",
                    value: String(parseInt(item.value) + parseInt(endBalance.end))
                })
                }
            })
            if (!oneIsEmpty) {

                setReplenishValues(new Map(replenishValues.set("dateTime", new Date().toString())))
                /* TODO: add to dataStore */

                // For å sette nye verdier
                setReplenishValues(replenishValues.delete('dateTime'))
                setDataValues(Array.from(replenishValues.values()))
                setReplenishValues(new Map())
                setReplenish(false)
                let superObject = {data: props.restockData}
                mutate2(superObject)
            }
        }

        const handleInput = (id, value) => {
            setReplenishValues(new Map(replenishValues.set(id, value)))
        }

        const handlePeriod = (evt) => {
            if (evt.value) {
                setPeriod(evt.value)
                refetch({
                    period: evt.value.split("-")[0]+evt.value.split("-")[1]
                })
            }
        }

        return (
            <>
                <DataTableToolbar>
                    <Field label={props.fd.displayName}></Field>
                    <Field>
                        <div style={{width: "fit-content"}} >
                            <InputField id="periodInputField" type="month" name={`monthToDisplay`} value={period} onChange={handlePeriod} />
                        </div>
                    </Field>
                    <Field>
                        <ButtonStrip middle>
                            {/* There is no data for 2022 available, so 2021-10 is a placeholder for 'current period' */}
                            {`2021-10` == period &&
                                <Button name="Basic button" onClick={handleClick} value="default">
                                    {replenish ? "Close" : "Replenish"}
                                </Button>
                            }
                            {replenish &&
                                <Button name="Basic button" onClick={sendValues} value="default">
                                    Send
                                </Button>
                            }
                        </ButtonStrip>
                    </Field>
                </DataTableToolbar>
                <DataTable>
                    <DataTableHead>
                        <TableRowHead>
                            <DataTableColumnHeader>Commodity</DataTableColumnHeader>
                            <DataTableColumnHeader>Consumption</DataTableColumnHeader>
                            <DataTableColumnHeader>End Balance</DataTableColumnHeader>
                            <DataTableColumnHeader>Quantity To Be Ordered</DataTableColumnHeader>
                            {replenish &&
                                <DataTableColumnHeader>Quantity To Add</DataTableColumnHeader>
                            }
                        </TableRowHead>
                    </DataTableHead>
                    <DataTableBody>
                        {dataValues.sort((a, b) => a.name > b.name ? 1 : -1)?.map((dataValue, index) =>
                            <DataTableRowWithInput key={index} dataValue={dataValue} replenish={replenish} handleInput={handleInput} />
                        )}
                    </DataTableBody>
                </DataTable>
            </>
        )
    }
}
