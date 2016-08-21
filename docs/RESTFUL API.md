RESTFul API
===========


GET api/donor/:id
-----------------

	Retrieves donor with ID. Client will retrieve IDs through Feature#6
	with clicking on lazy loading pinpoints	(Basically click to show
    information) and after that GET request will be made and client
    will retrieve donor information


POST api/donor
--------------

    Creates a new donor and returns the ID to client.

Accepted JSON format:

   { "donor": { -JSON Format of donor- } }

Response:

    { "status": char, "unique_param": string }

PUT api/donor/:id
-----------------

	Updates donor with the ID. Requires client to know matching unique
	link provided to client after submit donor information. Client
	will be able to make this request on page /donor/edit/:unique_param

Accepted JSON format:

	{ "unique_param": string, donor: { -JSON Format of donor- } }


DELETE api/donor/:id
--------------------

	Deletes donor with the ID. Requires client to know matching unique
	link. This requires will available on /donor/edit/:id

Accepted JSON format:

	{ "unique_param": string }


POST api/donor/find/
--------------------

	Returns donors within the area supplied with JSON body.

Accepted JSON format:

	{ x1: float, y1: float, x2: float, y2: float }



Rest of allowed HTTP Requests
=============================


GET /

	Return the single page web application


GET /donor/edit/:unique_param

	Returns static version of donor edit page.
	For development purposes only, It's temporary.
