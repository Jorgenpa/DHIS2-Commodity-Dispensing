import { useDataQuery } from "@dhis2/app-runtime"
import { CircularLoader } from "@dhis2/ui"
import React, { useState, useEffect } from 'react';
import {
    SingleSelect,
    SingleSelectOption,
    Button,
    Input
} from '@dhis2/ui'

import { fetchHospitalData } from "./DataQueries";


// Retrieves data from the API and creates a table with it
export function Dispense(props) {
    const { loading, error, data } = useDataQuery(fetchHospitalData(), {
        variables: {
            orgUnit: "MnfykVk3zin",
            period: "202110",
        }
    })
    const [values, setValues] = useState({})
    const [errorMessage, setErrorMessage] = useState("")

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

        const handleSubmit = (evt) => {
            const date = new Date();
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
            </>
        )
    }
}