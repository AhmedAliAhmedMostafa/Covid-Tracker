const API_ENDPOINT = "https://covid-19-data.p.rapidapi.com/";
document.querySelector('.search-box__button').addEventListener('click',
()=>{
  const countryName = document.querySelector('.search-box__input').value;
  getData(countryName)
  .then( ([data])=>{
    displyData(data,countryName);
  })
  .catch((err)=>{console.log(err)});;
});

function getData(countryName = null){
  let parameters ;
  if(!countryName)
    parameters = "totals";
  else
    parameters = "country/?name="+countryName;
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
getData()
.then(([data])=>{displyData(data)});
