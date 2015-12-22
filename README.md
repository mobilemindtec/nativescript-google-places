# nativescript-gplaces

Read Google Login Documentation at https://developers.google.com/places/android-api/?hl=pt-br

## Api Configuration

Create a new key to Google Places Api Web Service

## Use in app

```
  var GPlaces = require("../../modules/nativescript-gplaces");
  var googleServerApiKey = "your key api"
  
  exports.onLoaded = function(args) {  
    GPlaces.setGoogleServerApiKey(googleServerApiKey)  
    GPlaces.setErrorCallback(onPlacesErrorCallback)  
  }
  
  function onPlacesErrorCallback(text){
      alert(text)
  }  
```

## Place search
```
  // run search
  GPlaces.search(textSearch.text, types).then(function(result){
      // search list
  })
```

## Get place details
```
 // get place details
  GPlaces.details(placeId).then(function(place){
      // place result     
  })
```

