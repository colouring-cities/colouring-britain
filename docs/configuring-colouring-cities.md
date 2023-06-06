# Configuring the Colouring Cities Core Platform

## Introduction

We have added new configuration options to the Colouring Cities Core Platform, in order to make it easier to customise the platform for different cities/countries without unnecessary custom code and diverging codebases. 

This is done using configuration files, which are described in detail later in this document.  

Our hope is that every project in the Colouring Cities Research Programme (CCRP) will use this method to customise the interfaces of the Colouring Cities Platform for their own use as the programme moves forwards.
  
## The Config Files
The configuration files are located here:  

`app/src/cc-config.ts`  
`app/src/cc-config.json`  

### > cc-config.json
The JSON file contains the definition of the values of the variables. 

Currently, these parameters are:

- **'cityName'** (string) - The name of the city/country. 
- **'projectBlurb'** (string) - A line of text describing the relationship of the project to the CCRP
- **'githubURL'** (string) - The URL of the *project specific* GitHub repository
- **'privacyStatement'** (string) - A description of where user data is stored and what safeguards are in place

These text strings are then used at various points throughout the Platform's interface.

There are also some other values to customise the behaviour of the application:

- **'initialMapPosition'** (string) - The default latitude and longitude of the map when the page loads. 
- **'initialZoomLevel'** (string) - The default zoom level when the map loads. 

For example, the JSON file for Colouring London looks like this:

![alt text](images/cc-config-json.jpg "Title")

### > cc-config.ts
This file contains the declaration of the variables that can be configured. 

If you want to add additional parameters into the configuration framework, then they will need to be declared in this file and then defined in the JSON file (see below).
  
---
  
**NOTE: Any additional project specific text strings and parameters should be added to this file and the JSON file.**

*REQUEST: If you find any Colouring London-specific text or values, please report them or create a pull request to move them into the configuration framework.*
