import {
    DataTableCell,
    DataTableRow,
    InputField,
} from '@dhis2/ui'
import { useState, useEffect } from 'react';


// Used in the Overview-table to display commodities
const DataTableRowWithInput = ({ dataValue, replenish, handleInput }) => {
    const [inputValue, setInputValue] = useState()
    const [totalConsumption, setTotalConsumption] = useState()
    const [newEndBalance, setNewEndBalance] = useState()

    const updateInput = (evt) => {
        setTotalConsumption(parseInt(dataValue.con) + parseInt(evt.value))
        setNewEndBalance(parseInt(dataValue.end) + parseInt(evt.value))
        setInputValue(evt.value)
    }

    useEffect(() => {
        handleInput(dataValue.id, {
            id: dataValue.id,
            name: dataValue.name,
            con: totalConsumption,
            end: newEndBalance,
            qua: dataValue.qua,
            value: inputValue,
        })
    }, [inputValue])

    return (
        <DataTableRow>
            <DataTableCell>{dataValue.name}</DataTableCell>
            <DataTableCell>{dataValue.con}</DataTableCell>
            <DataTableCell>{dataValue.end}</DataTableCell>
            <DataTableCell>{dataValue.qua}</DataTableCell>
            {replenish &&
                <DataTableCell>
                    <InputField required type="number" name={`value_${dataValue.id}`} value={inputValue} max={dataValue.end} onChange={updateInput} />
                </DataTableCell>
            }
        </DataTableRow>
    )
}

export default DataTableRowWithInput