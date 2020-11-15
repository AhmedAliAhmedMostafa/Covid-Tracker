const API_ENDPOINT = "https://covid-19-data.p.rapidapi.com/";
let ALL_COUNTRIES = [];
document.querySelector('.search-box__input').addEventListener('input',fetchCountriesList);
document.addEventListener('click',handleClickEvent);

function handleClickEvent(event){
  let eventTargetClassList = event.target.classList;
  let resultsContainer = document.querySelector('.results-container');
  if(!(eventTargetClassList.contains('result') || 
  eventTargetClassList.contains('search-box__input')||
  eventTargetClassList.contains('results-container'))){
    hideResultsContainer();
    console.log('clicked');
  }
  else if(eventTargetClassList.contains('search-box__input')&&
  resultsContainer.children.length!==0)
  {
    console.log(resultsContainer.innerHTML);
    showResultsContainer();
  }
}

function fetchCountriesList() {
  clearResults();
  if(ALL_COUNTRIES.length === 0)
  {
    getData('all')
    .then((data)=>{
      ALL_COUNTRIES = [...data];
      searchCountries();
    });
  }
  else{
    searchCountries();
  }

}

function searchCountries (){
  let resultsContiner = document.querySelector('.results-container');
  let queryTerm = document.querySelector('.search-box__input').value;
  ALL_COUNTRIES.forEach((country)=>{
  if( country.name.toLowerCase().startsWith(queryTerm.toLowerCase()) )
    {
      addSearhResult(country.name) ;
    }
  });
  if(resultsContiner.innerHTML == '')
  {
    resultsContiner.innerHTML = 'no matching results';

  }
  showResultsContainer();
}

function addSearhResult(countryName){
  let resultElement = document.createElement('div');
  resultElement.innerHTML = countryName ;
  resultElement.classList.add('result');
  resultElement.addEventListener('click',handleSelectResult);
  document.querySelector('.results-container').appendChild(resultElement);
}
function handleSelectResult({target}){
  const inputField = document.querySelector('.search-box__input');
  inputField.value = target.innerHTML;
  hideResultsContainer();
  displayLoadingNotification();

  getData(target.innerHTML)
  .then(([data])=>{displyData(data,target.innerHTML)});
}
function showResultsContainer(){
  document.querySelector('.results-container').classList.add('show');

}

function hideResultsContainer(){
  document.querySelector('.results-container').classList.remove('show');

}

function clearResults (){
  document.querySelector('.results-container').innerHTML ="" ;
}

function getData(countryName = null){
  let parameters ;
  switch(countryName){
    case 'all':
      parameters = 'help/countries';
      break;
    case null:
      parameters = "totals";
      break;
    default:
      parameters = "country/?name="+countryName;
  }
  return new Promise(function (resolve,reject){

      fetch(API_ENDPOINT+ parameters,{
        "method": "GET",
        "headers": {
          "x-rapidapi-key": "1659a1d2dbmsh1606c6e91c3e509p156e46jsn0bf850eda422",
          "x-rapidapi-host": "covid-19-data.p.rapidapi.com"
        }
      })
      .then(response => {
        return response.json();
      })
      .then((result)=>{resolve(result)})
      .catch(err => {
        reject(err);
      }); 
    });

}
function displyData(data,region = 'world') {
  document.querySelector('.summary__region').innerHTML = (region == '')?'world':region;
  const dataProperities = ["confirmed","deaths","recovered"] ;
  const valueDomElements = document.querySelectorAll('.summary__value') ;
  valueDomElements.forEach((element,index)=>{element.innerHTML = data[dataProperities[index]]});
}
function displayLoadingNotification(){
  document.querySelector('.summary__region').innerHTML = 'loading';
  const summaryContainers = document.querySelectorAll('.summary>article');
  const valueDomElements = document.querySelectorAll('.summary__value') ;
  valueDomElements.forEach((element)=>{element.innerHTML = ''});
  // summaryContainers.forEach(cont=>{cont.classList.add('summary--blur')});
}
// fetch initial data
getData()
.then(([data])=>{displyData(data)});
displayLoadingNotification();
