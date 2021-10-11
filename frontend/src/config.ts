// The apiId here identifies the API in AWS APIGateway that is being called.
// The apiEndpoint is the API's baseUrl.
// const apiId = '40g2xhokvj'
const apiId = '4fbe0u2xb4'   // flashcards
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev-v1`

export const authConfig = {
  domain: 'wudev.auth0.com',                             // Auth0 domain
  // clientId: '1rjeLFNomhhCoa9nEP0SKt5WAGi4sciN',          // Auth0 client id
  clientId: '1i5eOTEtMWXd0tpFBRiu4vu32oxPhvXd',   // flashcards
  callbackUrl: 'http://localhost:3000/callback'          // callback url
}

