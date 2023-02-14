# Url shortener

This is a simple Url shortner written for node with typescript, utilizing a mongoDB database

Utilized fastify as the server and mongoose as the MongoDB driver/ORM

## Routes

### /shortener

Recieves a json body with this format

```json
{
	"url": "https://google.com"
}
```

It does url validation utilizing the [Javascript URL API](https://developer.mozilla.org/en-US/docs/Web/API/URL)

Returns a shortId that can later be used to retrieve back the URL, response body looks like this

```json
{
	"shortId": "2aDARTWP"
}
```

### /:shortId

Recieves the shortId as a URL parameter and returns back the full URL, the body looks like this

```json
{
	"longUrl": "https://google.com"
}
```

## Improvements to be made

* Some way to handle duplicates (might not be viable because of the way expiration works)
