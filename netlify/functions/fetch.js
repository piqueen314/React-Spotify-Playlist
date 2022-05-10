const axios = require("axios")
const qs = require("qs")

export function handler(event, context, callback) {
  // apply our function to the queryStringParameters and assign it to a variable
  //const API_PARAMS = qs.stringify(event.queryStringParameters)
  // Get env var values defined in our Netlify site UI
  const { API_TOKEN } = process.env
  // In this example, the API Key needs to be passed in the params with a key of key.
  // We're assuming that the ApiParams var will contain the initial ?
 
  const CLIENTID = `${API_TOKEN}`

  // Let's log some stuff we already have.
  console.log("Injecting token to", API_TOKEN);
  console.log("logging event.....", event)
  console.log("Constructed URL is ...", API_TOKEN)

   // Here's a function we'll use to define how our response will look like when we call callback
  const pass = (body) => {callback( null, {
    statusCode: 200,
    body: JSON.stringify(body)
  })}

  // Perform the API call.
  const getClient = () => {
    axios.get(API_TOKEN)
    .then((response) =>
      {
        console.log(response.data)
        pass(response.data)
      }
    )
    .catch(err => pass(err))
  }


  if(event.httpMethod == 'GET'){
    getClient()
  };
};