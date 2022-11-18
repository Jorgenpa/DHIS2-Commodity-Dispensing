
// The data queries to GET dataValueSets and dataSets for our hospital, 
// and the queries to retrieve the transaction log and the restock history stored in dataStore
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
        },
        restockHistory: {
            resource: "/dataStore/IN5320-G19/restockHistory"
        },
        dispensingHistory: {
            resource:"/dataStore/IN5320-G19/transactions"            
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

// The data query to update the transaction log stored in dataStore
 export function storeDeposit() {
    return {
        
        resource:"dataStore/IN5320-G19/transactions",
        type: "update",
        data: (transactions) => transactions
    }
 
}

// The data query to update the restock history stored in dataStore
 export function storeRestock() {
    return {
        resource:"dataStore/IN5320-G19/restockHistory",
        type: "update",
        data: (transactions) => transactions
    }
 }