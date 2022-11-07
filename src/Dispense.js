import { useDataQuery, useDataMutation } from "@dhis2/app-runtime"
import { CircularLoader } from "@dhis2/ui"
import React, { useState, useEffect } from 'react';
import {
    SingleSelect,
    SingleSelectOption,
    Button,
    Input
} from '@dhis2/ui'

import { fetchHospitalData } from "./DataQueries";
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
    let categoryValues = []
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
            props.cart.push({
                "id":values.commodity,
                "amount":values.amount,
                "from":values.from,
                "to":values.to
            })
            console.log(props.cart)
        }

        function getValues(commodity, categoryOptionCombo) {
            for (let i = 0; i < categoryValues.length; i++) {
                if (categoryValues[i].id == commodity) {
                    if (categoryValues[i].category == categoryOptionCombo)
                        return categoryValues[i];
                }
            }
            return null;
        }

        const handleSubmit = (evt) => {
            const date = new Date();
            console.log(values.commodity)
            //let toBeOrdered = getValues(values.commodity, "KPP63zJPkOu")
            for (let i = 0; i < props.cart.length; i++) {
                let consumption = getValues(props.cart[i].id, "J2Qf1jtZuj8")
                let endBalance = getValues(props.cart[i].id, "rQLFnNXXIL0")
                mutate ({
                    dataElement:consumption.id,
                    categoryOptionCombo:consumption.category,
                    value:String(parseInt(consumption.value)+parseInt(values.amount))
                })
    
                mutate ({
                    dataElement:endBalance.id,
                    categoryOptionCombo:endBalance.category,
                    value:String(parseInt(endBalance.value)-parseInt(values.amount))
                })
            }
            props.cart.length = 0;

            if (!values.commodity || !values.amount || !values.from || !values.to) {
                setErrorMessage("You are missing values")
                return
            }
            setErrorMessage("")
            console.log(values, date.toString());
        }
        return (
            <>
                {errorMessage && <p>{error}</p>}
                <SingleSelect selected={values?.commodity} className="select" filterable onChange={handleSelect}>
                    {array?.map((commodity, index) =>
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
                    placeholder="from"
                    onChange={handleInput}
                    value={values?.from}
                />
                <Input
                    name="to"
                    placeholder="to"
                    onChange={handleInput}
                    value={values?.to}
                />
                <Button name="Submit" onClick={handleSubmit} value="sumbit">
                    SEND
                </Button>
                <Button name="AddToCart" onClick={handleCart}>
                    ADD TO CART
                </Button>
                <Button name="Cart">
                    VIEW CART
                </Button>
            </>
        )
    }
}