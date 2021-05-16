- [API DOCUMENTATION](#api-documentation)
  * Endpoints: users, tokens, checks
  * Users: /api/users
    + [Create User](#create-user)
    + [Get user details](#get-user-details)
    + [Update User details](#update-user-details)
    + [Delete User](#delete-user)
  * Tokens: /api/tokens
    + [Create auth_token](#create-auth-token)
    + [Get auth_token expiry time](#get-auth-token-expiry-time)
    + [Extend Token expiry by 1 hour](#extend-token-expiry-by-1-hour)
    + [Delete Token](#delete-token)
  * Checks: /api/checks
    + [Create Check item](#create-check-item)
    + [Get Check item details](#get-check-item-details)
    + [Update Check item](#update-check-item)
    + [Delete Check item](#delete-check-item)


# API DOCUMENTATION <a name="api-documentation" />


## Endpoints: users, tokens, checks

> ## Users: /api/users

### Create User <a name="create-user" />

Method: POST
```
{
	"phone" : "1234567890",
	"firstName" : "asdf",
	"lastName" : "lkjh",
	"password" : "password",
	"tosAgreement" : boolean
}
```
### Get user details <a name="get-user-details" />

Method: GET 

Header: token= auth_token

Query String: ?phone=1234567890

### Update User details <a name="update-user-details" />

Method: PUT

Header: token= auth_token

```
{
	//any or all of the fields as per requirement
	"firstName" : "asdf",
	"lastName" : "lkjh",
	"password" : "password"
}
```

### Delete User <a name="delete-user" />

Method: DELETE

Header: token= auth_token

Query String: ?phone=1234567890


> ## Tokens: /api/tokens

### Create auth_token <a name="create-auth-token" />

Method: POST
```
{
	"phone" : "1234567890",
	"password" : "password"
}
```

### Get auth_token expiry time <a name="get-auth-token-expiry-time" />

Method: GET 

Query String: ?id=auth_token

### Extend Token expiry by 1 hour <a name="extend-token-expiry-by-1-hour" />

Method: PUT
```
{
	"id" : "auth_token",
	"extend" : boolean
}
```

### Delete Token <a name="delete-token" />

Method: DELETE

Query String: ?id=auth_token


> ## Checks: /api/checks

### Create Check item <a name="create-check-item" />

Method: POST

Header: token= auth_token
```
{
	"userPhone" : "1234567890",
	"protocol" : "http", //or "https"
	"url" : "www.google.com",
	"method" : "GET", //or "POST" or "PUT" or "DELETE"
	'successCodes' : [ 200, 201 ], //array 
	'timeOutSeconds' : 3 // >=1 && <= 5
}
```

### Get Check item details <a name="get-check-item-details" />

Method: GET 

Header: token= auth_token

Query String: ?id=check_id

### Update Check item <a name="update-check-item"/>

Method: PUT

Header: token= auth_token
```
{
	"id" : "check_id"
	//any or all of the fields as per requirement
	"userPhone" : "1234567890",
	"protocol" : "http", //or "https"
	"url" : "www.google.com",
	"method" : "GET", //or "POST" or "PUT" or "DELETE"
	'successCodes' : [ 200, 201 ], //array 
	'timeOutSeconds' : 3 // >=1 && <= 5
}
```

### Delete Check item <a name="delete-check-item"/>

Method: DELETE

Header: token= auth_token

Query String: ?id=check_id
