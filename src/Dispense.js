import { useDataQuery, useDataMutation } from "@dhis2/app-runtime"
import { CircularLoader } from "@dhis2/ui"
import React, { useState, useEffect } from 'react';
import {
    SingleSelect,
    SingleSelectOption,
    Button,
    Input
} from '@dhis2/ui'
import {
    DataTable,
    DataTableCell,
    DataTableColumnHeader,
    DataTableRow,
    TableHead,
    TableBody,
    AlertBar
} from '@dhis2/ui'

import { fetchDataStoreMutation, fetchHospitalData } from "./DataQueries";
import { deposit } from "./DataQueries";

// Retrieves data from the API to fill the select-option
export function Dispense(props) {
    const { loading, error, data } = useDataQuery(fetchHospitalData(), {
        variables: {
            orgUnit: props.fd.orgUnit,
            period: props.fd.period,
        }
    })

    const [mutate] = useDataMutation(deposit());
    const [values, setValues] = useState({})
    const [errorMessage, setErrorMessage] = useState("")
    const [cartVisible, setCartVisible] = useState(false)
    const [categoryValues, setCategoryValues] = useState([])

    data?.dataValueSets?.dataValues?.map(dataValue => {
        categoryValues.push({
            "id": dataValue.dataElement,
            "category": dataValue.categoryOptionCombo,
            "value": dataValue.value
        })
    })

    if (error) {
        return <span>ERROR: {error.message}</span>
    }

    if (loading) {
        return <CircularLoader large />
    }

    if (data) {
        //console.log(data);
        let array = []
        let meme = {}

        data?.dataSets?.dataSets[0]?.dataSetElements?.map(dataValue => {
            array.push({
                "id": dataValue.dataElement.id,
                "name": dataValue.dataElement.name.split("-")[1].trim()
            })
            meme = {
                ...meme,
                [dataValue.dataElement.id]: {
                    id: dataValue.dataElement.id,
                    name: dataValue.dataElement.name.split("-")[1].trim(),
                    value: 0,
                    from: "",
                    to: "",
                }
            }
        }
        );

        const handleInput = (evt) => {
            const { name, value } = evt;
            setValues(prevState => ({
                ...prevState,
                [name]: value
            }));
        }

        const handleSelect = (evt) => {
            console.log(evt);
            setValues(prevState => ({
                ...prevState,
                commodity: evt.selected
            }))
        }

        const handleCart = () => {
            if (!values.commodity || !values.amount || !values.from || !values.to) {
                setErrorMessage("You are missing values")
                return
            }

            props.cart.push({
                "id": values.commodity,
                "amount": values.amount,
                "from": values.from,
                "to": values.to
            })
            console.log(props.cart)
        }

        const showCart = () => {
            setCartVisible(!cartVisible)
        }

        function getValues(commodity, categoryOptionCombo) {
            return categoryValues.find(value => value.id == commodity && value.category == categoryOptionCombo)
        }

        function updateValues(commodity, categoryOptionCombo, newValue) {
            let index = categoryValues.findIndex(obj => obj.id == commodity && obj.category == categoryOptionCombo)
            categoryValues[index].value = String(parseInt(categoryValues[index].value) + parseInt(newValue))
        }

        const handleSubmit = (evt) => {
            const date = new Date();
            console.log("inne i handleSubmit", evt)

            props.cart.map(item => {
                let consumption = getValues(item.id, "J2Qf1jtZuj8")
                let endBalance = getValues(item.id, "rQLFnNXXIL0")
                mutate({
                    dataElement: consumption.id,
                    categoryOptionCombo: consumption.category,
                    value: String(parseInt(consumption.value) + parseInt(values.amount)),
                },
                {
                    dataElement: endBalance.id,
                    categoryOptionCombo: endBalance.category,
                    value: String(parseInt(endBalance.value) - parseInt(values.amount))
                }
                )

                updateValues(item.id, "J2Qf1jtZuj8", values.amount)
                updateValues(item.id, "rQLFnNXXIL0", -values.amount)

            })
            props.cart.length = 0;
        }

        return (
            <>
                {errorMessage &&
                    <AlertBar warning>
                        {errorMessage}
                    </AlertBar>
                }
                <SingleSelect selected={values?.commodity} placeholder="Commodity" className="select" onChange={handleSelect}>
                    {array?.sort((a,b) => a.name > b.name ? 1 : -1).map((commodity, index) =>
                        <SingleSelectOption key={index} name="commodity" label={commodity.name} value={commodity.id} />
                    )}
                </SingleSelect>
                <Input
                    name="amount"
                    placeholder="Amount"
                    onChange={handleInput}
                    value={values?.amount}
                />
                <Input
                    name="from"
                    placeholder="From"
                    onChange={handleInput}
                    value={values?.from}
                />
                <Input
                    name="to"
                    placeholder="To"
                    onChange={handleInput}
                    value={values?.to}
                />
                <Button name="Submit" onClick={handleSubmit} value="submit">
                    SEND
                </Button>
                <Button name="AddToCart" onClick={handleCart}>
                    ADD TO CART
                </Button>
                <Button name="Cart" onClick={showCart}>
                    {(cartVisible ? "HIDE" : "VIEW")} CART
                </Button>
                {cartVisible &&
                    <DataTable>
                        <TableHead>
                            <DataTableRow>
                                <DataTableColumnHeader>
                                    Commodity
                                </DataTableColumnHeader>
                                <DataTableColumnHeader>
                                    Amount
                                </DataTableColumnHeader>
                                <DataTableColumnHeader>
                                    From
                                </DataTableColumnHeader>
                                <DataTableColumnHeader>
                                    To
                                </DataTableColumnHeader>
                            </DataTableRow>
                        </TableHead>
                        <TableBody>
                            {props.cart.map((item, index) =>
                                <DataTableRow key={index}>
                                    <DataTableCell>
                                        {item.id}
                                    </DataTableCell>
                                    <DataTableCell>
                                        {item.amount}
                                    </DataTableCell>
                                    <DataTableCell>
                                        {item.from}
                                    </DataTableCell>
                                    <DataTableCell>
                                        {item.to}
                                    </DataTableCell>
                                </DataTableRow>
                            )}
                        </TableBody>
                    </DataTable>
                }
            </>
        )
    }
}