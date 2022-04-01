# sms-api

### Requirements

1. Node Package Manager (NPM) is required. To install Node, download from [https://nodejs.com/en/download](https://nodejs.org/en/download/).

2. Environment variables will need to be set. These environment variables include database connection details that should not be hard-coded into the application code. These environmental variables can be set in a .env file. Check the env.template for the list of environmental variables

### 1. Postgres Database

- Run the following command to set up a docker instance of postgres:

```
    docker pull postgres
```

```
    docker run --rm --name postgres -e POSTGRES_PASSWORD=password -d -p 5432:5432 postgres
```

- Run the following command in another terminal to copy the dump onto the postgres database

```
docker exec -i {container_id} psql -U postgres -d postgres <{full-path-to-schema.sql}

eg: docker exec -i eaefcc2898728a8b83cfe3b9a2a03887cf23b13cfccc5a186fcd118ae5ef3ffd psql -U postgres -d postgres <C:\Users\nzube\OneDrive\Desktop\sms-api\schema.sql
```

### 2. Redis Instance

- Run the following command to set up a docker instance of redis:

```
    docker pull redis
```

```
    docker run --name redis -p 6379:6379 -d redis
```

- Your .env:

```
    NODE_ENV="production"
    REST_PORT=3000

    #POSTGRES
    DB_HOST=localhost
    DB_NAME=postgres
    DB_USER=postgres
    DB_PORT=5432
    DB_PASSWORD=password

    #REDIS

    REDIS_HOST=localhost
    REDIS_PORT=6379
    REDIS_PASSWORD=password
```

### 3. Installation of packages

- Run the command from the root directory:
  ```
  npm install
  ```
- Run the application:
  ```
  npm start
  ```
- Run unit tests:

```
    npm run test
```

- Base Url: `http://localhost:3000/`. This can be accessed in your web browser. A JSON with status of UP `{"status":"UP"}` will be displayed. You can import the sample postman collection, which is added to the root directory to test the API `SMS-API.postman_collection`.

### 4. Deployment

Application is hosted on Heroku [https://mmk-sms-api.herokuapp.com/](https://mmk-sms-api.herokuapp.com/)
