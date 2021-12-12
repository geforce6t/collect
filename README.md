# Collect
Schematic for storing forms (with questions) and responses (with answers) with relevant metadata along with plugins. 

### Usage

```
clone the repo
$ cd collect
$ yarn install
$ cp config/default.example.json config/default.json
$ yarn dev
```

## Usage and Features

### Plugins
- all of the "post-response-plugins" are stored inside the `src/plugins` directory.
- All of the configuration for plugins is stored inside the `config/default.json` file.
- Each plugin has a separate class in which queue is created using `bull`.
- Inside the `src/plugins/index.ts` all of the plugins are instantiated and exported as an object.
- Finally inside the reponse Controller reformed response data is added to corresponding queue.

** for the sheets plugins a "googleapi" credentials.json file is required inside `src/plugins/sheets`, of the form : 
```
{
  "type": "service_account",
  "project_id": "",
  "private_key_id": "",
  "private_key": "",
  "client_email": "",
  "client_id": "",
  "auth_uri": "",
  "token_uri": "",
  "auth_provider_x509_cert_url": "",
  "client_x509_cert_url": ""
}
```

### Centralised Logging

- by default requests are logged in `info` level
- all errors are logged that are thrown using `HTTPException` class
- use different named loggers in different modules.
- alias `bunyan=node_modules/.bin/bunyan` to view logs. E.g. `bunyan logs/logs.json`
- logs are rotated every day.

### Config

Config is managed using `config` package.

### Error

In order to create errors/exceptions use HTTPException through middleware.
e.g

```
return next(
    new HttpException({
            status: 401,
            message: "Invalid webmail credentials!",
            logger: this.logger,
          })
)
```

All these exceptions are captured, logged and handled by `error.middleware.ts`

### Validating incoming data

- Validate incoming data using `Data Transfer Objects (DTO)`.
- Create a corresponding dto file in `DataTransferObjects` to handle validation.
- The validation is handled using `class-validator`.
- Refer: `auth.controller.ts`, [Class Validator](https://www.npmjs.com/package/class-validator)
- There's option to make certain params optional

### Registering Controller

Register the controller to the `App` object in `server.ts`.

### Extending Library Interfaces

Setting up parameters like ```req.user```:
- Add a custom type declaration at ```Interfaces/@types/``` with optional parameters.
- Add the required Interface by extending the Required Library interface at ```Interfaces/..```
- Add a [Type-Guard](https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards) for the Custom Interface.
