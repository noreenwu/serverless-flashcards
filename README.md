### Serverless Flashcards

This serverless application allows you to create your own flashcards,
to categorize them and to mark/unmark them as learned or to be studied. 

The backend uses the serverless.com framework to define AWS lambda endpoints
on AWS APIGateway, along with a DynamoDB database table and S3 bucket for image
storage.

The frontend is a React app which can be downloaded from this repository
and started up by doing ```npm install``` and ```npm start``` from the [frontend
directory](https://github.com/noreenwu/serverless-flashcards/tree/main/frontend). The frontend allows you to create new flashcards in specified categories,
and then to filter them by category, by mastery (learned or not), or both.

The lambda endpoints are behind auth, which is set up on auth0. This means
you can use a 3rd party, such as Google, to authenticate and use the app.
Users do not see each other's flashcards, only their own.

[A Postman collection](https://github.com/noreenwu/serverless-flashcards/blob/main/Serverless_Flashcards.postman_collection.json) is provided in this directory, which allows for
a runthrough of the available endpoints without having to start up the
React frontend.

#### Global Secondary Index
In order to retrieve flashcards from one specified category, a global
secondary index was specified, so that retrieval of subsets of flashcards
by category is efficient. If the user also specifies to see flashcards to be learned
or flashcards to be studied, the subset of flashcards is then filtered by
the mastery field.

If no category is specified, the same endpoint is used to retrieve data,
but the global secondary index is not used. The business logic layer
determines which data layer function to use, based on which combination of
category and mastery have been specified, and different data layer
functions were set up to either use the GSI or not.


#### Querystring Parameters

Querystring parameters are used instead of path parameters because the parameters
are specifying a subset of flashcards rather than a specific flashcard. As
described above, any combination of parameters (or no parameters) is possible,
and the same endpoint will return either filtered or unfiltered results.
