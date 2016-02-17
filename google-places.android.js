var application = require("application");
var imageSource = require("image-source");

var _googleServerApiKey
var _placesApiUrl = 'https://maps.googleapis.com/maps/api/place/autocomplete/json'
var _placesDetailsApiUrl = 'https://maps.googleapis.com/maps/api/place/details/json'
var _placesImagesApiUrl = 'https://maps.googleapis.com/maps/api/place/photo'
var _errorCallback

function handleErrors(response) {
  
  if (!response.ok) {    
    console.lod("############################ error")
    console.log("#####" + JSON.stringify(response));    
    console.lod("############################")

    if(_errorCallback)
      _errorCallback(response.statusText)
  }

  return response; 
}

function capitalize(text) {
  return text.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};


exports.setGoogleServerApiKey = function(googleServerApiKey){
  _googleServerApiKey = googleServerApiKey
}

exports.setErrorCallback = function(errorCallback){
  _errorCallback = errorCallback
}

exports.search = function(text, types){

    var searchBy = capitalize(text).replace(new RegExp(" ", 'g'), "");
    var url = _placesApiUrl + "?input=" + searchBy + "&types=" + types + "&language=pt_BR&key=" + _googleServerApiKey
    console.log("###############################")
    console.log("################### searchBy=" + types + ", value=" + searchBy)
    console.log("################### url=" + url)
    console.log("###############################")

    return fetch(url)
    .then(handleErrors)
    .then(function(response) {
      return response.json();
    }).then(function(data) {

      var items = []

      for(var i = 0; i < data.predictions.length; i++){
        items.push({
          descricao: data.predictions[i].description,
          placeId: data.predictions[i].place_id,
          'data': data.predictions[i]
        })
      }

      console.log("############################## data.length=" + data.predictions.length)
      console.log("###=" + JSON.stringify(data))
      console.log("##############################")
      
      return items
    })
}

exports.details = function(placeid){

    var url = _placesDetailsApiUrl + "?placeid=" + placeid + "&language=pt_BR&key=" + _googleServerApiKey
    console.log("###############################")
    console.log("################### placeid=" + placeid)
    console.log("################### url=" + url)
    console.log("###############################")

    return fetch(url)
    .then(handleErrors)
    .then(function(response) {
      return response.json();
    }).then(function(data) {

      console.log("############################## google place")
      console.log("###=" + JSON.stringify(data))
      console.log("##############################")

      var place = {}
      var address_components = data.result.address_components
      for(var key in address_components){
        
        var address_component = address_components[key]

        
        if (address_component.types[0] == "route"){      
            place.rua = address_component.long_name;
        }
        
        if (address_component.types[0] == "locality"){
            place.cidade = address_component.long_name;
        }

        if (address_component.types[0] == "country"){ 
            place.pais = address_component.long_name;
        }

        if (address_component.types[0] == "postal_code_prefix"){ 
            place.cep = address_component.long_name;
        }

        if (address_component.types[0] == "street_number"){ 
            place.numero = address_component.long_name;
        }

        if(address_component.types[0] == "sublocality_level_1"){
          place.bairro = address_component.long_name; 
        }
      }

      place.latitude = data.result.geometry.location.lat
      place.longitude = data.result.geometry.location.lng
      place.nome = data.result.name
      place.telefone = data.result.international_phone_number
      place.endereco = data.result.formatted_address

      if(data.result.photos && data.result.photos.length > 0){
        place.photoReference = data.result.photos[0].photo_reference
      }

      console.log("############################## parsed place")
      console.log("###=" + JSON.stringify(place))
      console.log("##############################")
      
      return place

    })
}

exports.loadPlacePhoto = function(photoreference, onSuccessCallback, onFailCallback){
  var url = _placesImagesApiUrl + "?maxwidth=100&photoreference=" + photoreference + "&key=" + _googleServerApiKey;
  console.log("#################################")
  console.log("##### url=" + url)
  console.log("#################################")
  return imageSource.fromUrl(url)
}