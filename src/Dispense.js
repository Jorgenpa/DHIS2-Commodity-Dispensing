import { useDataQuery, useDataMutation } from "@dhis2/app-runtime"
import { CircularLoader } from "@dhis2/ui"
import React, { useState } from 'react';
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

import { fetchHospitalData } from "./DataQueries";
import { deposit } from "./DataQueries";
import { storeDeposit } from "./DataQueries";
import "./dispense.css"


// Retrieves data from the API to fill the select-option
export function Dispense(props) {
    const { loading, error, data } = useDataQuery(fetchHospitalData(), {
        variables: {
            orgUnit: props.fd.orgUnit,
            period: props.fd.period,
        }
    })


    const [mutate] = useDataMutation(deposit());
    const [mutate2] = useDataMutation(storeDeposit());
    const [values, setValues] = useState({})
    const [errorMessage, setErrorMessage] = useState("")
    const [categoryValues, setCategoryValues] = useState([])
    const [numOfComForSelected, setNumOfComForSelected] = useState()


    // Used for storing all the values of the different commodities
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

        let array = []
        let meme = {}

        const endBalances = data?.dataValueSets?.dataValues.filter(item => item.categoryOptionCombo == "rQLFnNXXIL0")

        data?.dataSets?.dataSets[0]?.dataSetElements?.map(dataValue => {
            array.push({
                "id": dataValue.dataElement.id,
                "name": dataValue.dataElement.name.split("-")[1].trim(),
                "numOfCom": endBalances.filter(item => item.dataElement == dataValue.dataElement.id)[0].value
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
        });

        const handleInput = (evt) => {
            const { name, value } = evt;
            let newValue = value
            if (numOfComForSelected && name == "amount" && parseInt(numOfComForSelected) < parseInt(value)) {
                newValue = numOfComForSelected
            }
            setValues(prevState => ({
                ...prevState,
                [name]: newValue
            }));
        }

        const handleSelect = (evt) => {
            setNumOfComForSelected(endBalances.filter(item => item.dataElement == evt.selected)[0].value)
            setValues(prevState => ({
                ...prevState,
                commodity: evt.selected
            }))
        }
        
        // Pushes the input values as an object onto the cart prop after the "ADD TO CART" button has been clicked
        const handleCart = () => {
            if (!values.commodity || !values.amount || !values.from || !values.to) {
                setErrorMessage("You are missing values")
                return
            }
            props.setTheCart([...props.theCart, {
                "id": values.commodity,
                "name": array.find(value=> value.id == values.commodity).name,
                "amount": values.amount,
                "from": values.from,
                "to": values.to,
            }])
            console.log(props.theCart)
        }

        // Gets the desired object, containing important values from the categoryValues array.
        function getValues(commodity, categoryOptionCombo) {
            return categoryValues.find(value => value.id == commodity && value.category == categoryOptionCombo)
        }

        // Makes sure that the local numbering is correctly added/subtracted after a POST
        function updateValues(commodity, categoryOptionCombo, newValue) {
            let index = categoryValues.findIndex(obj => obj.id == commodity && obj.category == categoryOptionCombo)
            categoryValues[index].value = String(parseInt(categoryValues[index].value) + parseInt(newValue))
        }

        // POSTs the cart to the dataValues and PUTs the dispensingData prop to the dataStore
        const handleSubmit = (evt) => {
            
            const date = new Date();

            // This logic allows us to make several dispenses afte one another without changing the page. At the first submit
            // the dispensingData prop will be filled with the current dataSorage elements. On subsequent submits it will not add to the prop.
            if (props.dispensingData < 1) {
                data?.dispensingHistory?.data?.map(val => {
                    props.dispensingData.push(val)
                })
            }

            // All items of the cart prop will be POSTed, local values will be updated and then the cart will be reset
            props.theCart.map(item => {

                let consumption = getValues(item.id, "J2Qf1jtZuj8")
                let endBalance = getValues(item.id, "rQLFnNXXIL0")
                
                // POST for changing the consumption value of a commodity
                mutate({
                    dataElement: consumption.id,
                    categoryOptionCombo: consumption.category,
                    value: String(parseInt(consumption.value) + parseInt(values.amount)),
                })
                // POST for changing the endBalance value of a commodity
                mutate({
                    dataElement: endBalance.id,
                    categoryOptionCombo: endBalance.category,
                    value: String(parseInt(endBalance.value) - parseInt(values.amount))
                })

                updateValues(item.id, "J2Qf1jtZuj8", values.amount)
                updateValues(item.id, "rQLFnNXXIL0", -values.amount)

                // Data for the dataStorage
                props.dispensingData.push({
                    date: date,
                    commodityId: item.id,
                    commodityName: item.name,
                    dispensedBy: item.from,
                    dispensedTo: item.to,
                    amount: item.amount,
                    org: props.fd.org
                })

            })

            // Sends a PUT request with the new dataStorage elements
            let superObject = { data: props.dispensingData }
            mutate2(superObject)

            // Resets the cart
            props.setTheCart([])
        }

        return (
            <>
                <div className="dispensing" >
                    {errorMessage &&
                        <AlertBar warning>
                            {errorMessage}
                        </AlertBar>
                    }

                    <SingleSelect selected={values?.commodity} placeholder="Commodity" className="select" onChange={handleSelect}>
                        {array?.sort((a, b) => a.name > b.name ? 1 : -1).map((commodity, index) =>
                            <SingleSelectOption key={index} name="commodity" label={`${commodity.name} (${commodity.numOfCom})`} value={commodity.id} />
                        )}
                    </SingleSelect>
                    <Input
                        name="amount"
                        type="number"
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
                    <Button name="AddToCart" onClick={handleCart}>
                        ADD TO CART
                    </Button>
                    {props.theCart.length > 0 &&
                        <>
                            <Button name="Submit" onClick={handleSubmit} value="submit">
                                SEND
                            </Button>
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
                                    {props.theCart.map((item, index) =>
                                        <DataTableRow key={index}>
                                            <DataTableCell>
                                                {item.name}
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
                        </>
                    }
                </div>
            </>
        )
    }
}