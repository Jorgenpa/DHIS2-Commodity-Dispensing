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
    Button
} from '@dhis2/ui'

import { fetchHospitalData, addDataStore } from "./DataQueries";
import DataTableRowWithInput from "./components/dataTableRowWithInput";
import axios from 'axios'


// Retrieves data from the API and creates a table with it
export function Overview(props) {
    const { loading, error, data } = useDataQuery(fetchHospitalData(), {
        variables: {
            orgUnit: props.fd.orgUnit,
            period: props.fd.period,
        }
    })
    const [replenish, setReplenish] = useState(false)
    const [dataValues, setDataValues] = useState([])
    const [replenishValues, setReplenishValues] = useState(new Map())

    useEffect(() => {
        setDataValues(getTheValues())
    }, [data])

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
        const sendValues = async () => {
            let oneIsEmpty = false
            replenishValues.forEach(item => {
                if (!item.value) {
                    oneIsEmpty = true
                    alert(`${item.name} is empty`)
                    return
                }
            })
            if (oneIsEmpty) {
                setReplenishValues(new Map(replenishValues.set("dateTime", new Date().toString())))
                /* TODO: add to dataStore */

                // For å sette nye verdier
                setReplenishValues(replenishValues.delete('dateTime'))
                setDataValues(Array.from(replenishValues.values()))
                setReplenishValues(new Map())
                setReplenish(false)
            }
        }
        const handleInput = (id, value) => {
            setReplenishValues(new Map(replenishValues.set(id, value)))
        }

        return (
            <>
                <DataTableToolbar>
                    <Field label={props.fd.displayName}></Field>
                    <Field>
                        <Button name="Basic button" onClick={handleClick} value="default">
                            {replenish ? "Close" : "Replenish"}
                        </Button>
                        {replenish &&
                            <Button name="Basic button" onClick={sendValues} value="default">
                                Send
                            </Button>
                        }
                    </Field>
                </DataTableToolbar>
                <DataTable>
                    <DataTableHead>
                        <TableRowHead>
                            <DataTableColumnHeader>Commodity</DataTableColumnHeader>
                            <DataTableColumnHeader>Consumption</DataTableColumnHeader>
                            <DataTableColumnHeader>End balance</DataTableColumnHeader>
                            <DataTableColumnHeader>Quantity to be ordered</DataTableColumnHeader>
                            {replenish &&
                                <DataTableColumnHeader>Quantity</DataTableColumnHeader>
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
