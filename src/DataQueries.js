
// The data query to GET dataValueSets and dataSets for our hospital
export function fetchHospitalData() {
    return {
        dataValueSets: {
            resource: "/dataValueSets",
            params: ({ orgUnit, period }) => ({
                orgUnit: orgUnit,
                period: period,
                dataSet: "ULowA8V3ucd"
            })
        },
        dataSets: {
            resource: "/dataSets",
            params: {
                dataSetId: "ULowA8V3ucd",
                fields: "name,id,dataSetElements[dataElement[name,id,created,categoryCombo[name,id]]]",
                filter: "name:eq:Life-Saving Commodities"
            }
        }
    }
}


// The data query to find the health facilities nearby 
export function fetchNeighbors() {
    return {
        orgUnits: {
            resource: "/organisationUnits/aWQTfvgPA5v",
            params: {
              fields: "children[displayName,id]"
            }
          }
    }
}

// The data query to deposit a transaction
export function deposit() {
    return {
        resource:"dataValueSets",
        dataSet: "ULowA8V3ucd",
        type: "create",
        data: ({dataElement, value, categoryOptionCombo}) => ( {
            orgUnit: "MnfykVk3zin",
            period: "202110",
            dataValues: [
                {
                dataElement: dataElement,
                categoryOptionCombo: categoryOptionCombo,
                value: value,
                },
            ],
        }),
    }
 }

export function getStore() {
    return {
        dataStore: {
            resource:"/dataStore/IN5320-G19/transactions",
            params: {
                fields: "dataValues[date, commodityId, commodityName, dispensedBy, dispensedTo, amount]",
            }
        }
    }
}

 export function storeDeposit() {
    return {
        resource:"dataStore/IN5320-G19/transactions",
        type: "update",
        data: (transactions) => transactions
    }
 
}

export function getRestock() {
    return {
        dataStore: {
            resource:"/dataStore/IN5320-G19/restockHistory",
            params: {
                fields: "dataValues[date, commodityId, commodityName, dispensedBy, dispensedTo, amount]",
            }
        }
    }
}

 export function storeRestock() {
    return {
        resource:"dataStore/IN5320-G19/restockHistory",
        type: "update",
        data: (transactions) => transactions
    }
 }