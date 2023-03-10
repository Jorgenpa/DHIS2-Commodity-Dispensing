import { useDataQuery, useDataMutation } from "@dhis2/app-runtime"
import { CircularLoader } from "@dhis2/ui"
import React from 'react';
import { useState, useEffect } from 'react';
import {
    DataTable,
    DataTableColumnHeader,
    DataTableHead,
    DataTableBody,
    TableRowHead,
    DataTableToolbar,
    Field,
    InputField,
    Button,
    ButtonStrip
} from '@dhis2/ui'

import { fetchHospitalData, deposit, storeRestock } from "./DataQueries";
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
        dataValues.map(item => {
            replenishValues.set(item.id, item)
        })
    }, [dataValues])

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
            return array.find(value => value.id == commodity)
          }

        const sendValues = async () => {
            const date = new Date();

            // This logic allows us to make several restock after one another without changing the page. At the first submit
            // the restockData prop will be filled with the current dataSorage elements. On subsequent submits it will not add to the prop.
            if (props.restockData < 1) {
                data?.restockHistory?.data?.map(val => {
                    props.restockData.push(val)
                })
            }

            replenishValues.forEach(item => {
                let endBalance = getValues(item.id)
                if (item.value && item.value > 0) {

                    // Data for the dataStorage
                    props.restockData.push([{
                        date: date,
                        commodityId: item.id,
                        commodityName: getTheValues().find(value=> value.id == item.id).name,
                        amount:item.value
                    }])

                    // POST for changing the endBalance value of a commodity
                    mutate({
                    dataElement: item.id,
                    categoryOptionCombo: "rQLFnNXXIL0",
                    value: String(parseInt(item.value) + parseInt(endBalance.end))
                    })
                }
            })

            setDataValues(Array.from(replenishValues.values()))
            setReplenishValues(new Map())
            dataValues.map(item => {
                replenishValues.set(item.id, item)
            })
            setReplenish(false)

            // Sends a PUT request with the new dataStorage elements
            let superObject = {data: props.restockData}
            mutate2(superObject)

        }

        const handleInput = (id, value) => {
            setReplenishValues(replenishValues.set(id, value))
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
