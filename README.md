# Atlan-Task

### Usage

```
clone the repo / extract the archive
$ cd atlan-task
$ yarn i
$ cp default.example.json default.json
$ yarn dev
```

## Usage and Features

### Strict Mode

Strict mode is enabled by default. For more info refer: https://dev.to/briwa/how-strict-is-typescript-s-strict-mode-311a

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
