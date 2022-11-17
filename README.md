# Commodity Dispensing - Senjehun MCHP

## **Group Members**
  * Aleksander Ranum (aleksran)
  * Andreas Christensen (andrchri)
  * Jørgen Paulsrud Andersen (jorgenpa)


## **Prerequsites**
- _nods.js installed_
- _yarn installed_
- _DHIS2 CLI (Command Line Interface) installed_
- _DHIS2 Portal installed_


## **Setup**
For the first time setup, use yarn install command in the project directory to import all the dependencies:

```bash
$ yarn install
```

Run the DHIS2 portal proxy in a terminal with:

```bash
npx dhis-portal --target=https://data.research.dhis2.org/in5320/

```

Then run the yarn start command in the project directory:

```bash
$ yarn start
```

Your browser (Chrome is recommended) will open a DHIS2 instance on 'localhost:3000'. Log in with:
```bash
- Server: http://localhost:9999
- Username: admin
- Password: district 
```


## **Case Description** 
[Description of the case](https://www.uio.no/studier/emner/matnat/ifi/IN5320/h22/project/case-1/index.html)


## **About DHIS2**
DHIS2 is designed as a flexible, configurable platform for collecting, storing, visualizing, and analyzing data of any kind. It is open-source, web-based, and most used as a health management information system. Countries can monitor public health, combat and prevent pandemics, and manage treatment programs for severe illnesses like HIV and Malaria. 

The project started in 1994 as a tool for decentralizing and integrating health services in post-apartheid South Africa. Since then, it’s had tremendous growth and gained support from major organizations and funds; Norad, The Global Fund, UNICEF, CDC, The Bill and Melinda Gates Foundation, and more. Today the platform has a global footprint of 2.3 billion people and is a leading example of a Global Public Good. 


## **About The App**
This project is an attempt to design and develop a web-based DHIS2 app that supports hospital store managers in registering the dispensing of commodities in Whotopia, a fictional country. Our group was assigned the Senjehun MCHP (Maternal and Child Health Program) facility.  

The app consists of the following components:

#### **Overview** 
The Overview component lets the user look at the stock balance of all the commodities Senjehun MCHP has in its system. They can see the consumption and end balance for the current period, and the quantity to be ordered for next period. 
From here the user can also replenish commodities. The stock in Overview is mutated accordingly to the entered restock and the data is logged in the dataStore endpoint.

#### **Overview Neighbors** 
The neighbors-component allows the user to enter the neighboring hospitals stock listings, to see whether those have sufficient stock in case of outage in their own stock.

#### **Dispensing** 
Allows the user to dispense the different commodities that are in stock. The user enters the type of commodity, amount, as well as who it is from and to. If successfull, the stock in overview will be updated and logging-information is submitted to the dataStore API endpoint. 

#### **Replenish** 
Allows the user to organize a restock of commodities. The stock in Overview is mutated accordingly to the entered restock and the data is logged in the dataStore endpoint. 

#### **Transaction Log** 
Lets the user look at the dispensing logs and restock logs of commodities. The data is pulled from the dataStore endpoint. 

#### **Data Elements** 
Displays a list of all the data elements in the Life-Saving Commodities dataset. When a commodity is selected its identificator, display name and creation data is presented. 