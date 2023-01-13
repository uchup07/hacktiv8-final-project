# Hacktiv8 Final Project - TODO

**TODO** is a Application for final project

This Application is made of two parts
* Client (<span style="color:red">**Coming Soon**</span>)
  - web UI with REST endpoints available through an API app (see below)
  - is a React.js project located in the [client](https://github.com/uchup07/hacktiv8-todo-app-client) folder
* API
  - uses Postgres with [Sequelize](https://sequelize.org/)
  - is a node.js project project located in the [api](https://github.com/uchup07/hacktiv8-final-project/tree/main/src/api) folder.

# Table of Contents

- [Hacktiv8 Final Project - TODO](#hacktiv8-final-project---todo)
- [Table of Contents](#table-of-contents)
  - [How to](#how-to)
  - [Install NPM Package](#install-npm-package)
  - [Create Environment](#create-environment)
  - [Sequelize](#sequelize)
    - [User](#user)
    - [Task Group](#task-group)
    - [Task](#task)
  - [Running API](#running-api)
  - [Lets Try](#lets-try)
    - [Register](#register)
    - [Login](#login)
    - [Todo Groups](#todo-groups)
      - [1. View all Task Groups](#1-view-all-task-groups)
      - [2. View Task Group By UUID](#2-view-task-group-by-uuid)
      - [3. Create Task Group](#3-create-task-group)
      - [4. Update Task Group By UUID](#4-update-task-group-by-uuid)
      - [5. Delete Task Group by UUID](#5-delete-task-group-by-uuid)
    - [Todo](#todo)
      - [1. View All](#1-view-all)
      - [2. View By UUID](#2-view-by-uuid)
      - [3. Create](#3-create)
      - [4. Update By UUID](#4-update-by-uuid)
      - [5. Delete By UUID](#5-delete-by-uuid)
  - [License](#license)

## How to

First clone application

```
$ git clone https://github.com/uchup07/hacktiv8-final-project.git
```

*Next, Because this repo uses a git submodule, you wiill need to pull the client application using:
```
$ git submodule update --init --recursive
```

*) notes if it using client apps

goto sub directory 
```
$ cd hacktiv8-final-project/src/api
```

## Install NPM Package

```
$ npm install
```

## Create Environment

rename file ``.env.example`` to ``.env``

```
$ mv .env.example .env
```

Configuration for database on ``.env``

```
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=todo
DB_HOST=localhost
DB_PORT=5432

APP_PORT=3000

JWT_SECRET_KEY=rahasia
```

Before Running Application create database name on postgres like ``DB_NAME`` above, and after that on command line or terminal

## Sequelize

create **migration** and **seeder** using sequelize-cli, for more details on [sequelize-cli](https://github.com/sequelize/cli)

**Table Migration**

Database Tabels
* users
* tasks
* task_groups

```
$ npx sequelize db:migrate
```

**Seeding Data**

### User
```
$ npx sequelize db:seed --seed 20230110065008-user_datas.js
```

### Task Group
```
$ npx sequelize db:seed --seed 20230112055205-task_groups_datas.js
```

### Task

```
$ npx sequelize db:seed --seed 20230112060632-task_datas.js
```

Make sure all of datas insert on that tables

## Running API

```
$ npm run start
```

## Lets Try

Now, using any HTTP Client like [POSTMAN](https://www.getpostman.com/apps)

### Register

For User Registration

``POST http://localhost:3000/v1/api/register``

Parameters Body

| Parameter              | Value                    | Required   |
| ---------------------- | ------------------------ | ---------- |
| username               | string                   | true       |
| email                  | string                   | true       |
| password               | string                   | true       |
| firstName              | string                   | true       |
| lastName               | string                   | true       |

Response ``Status 200``

```json
{
    "id": "string",
    "firstName": "string",
    "lastName": "string",
    "username": "string",
    "email": "string"
}
```

### Login

For Login

``POST http://localhost:3000/v1/api/auth/login``

Parameters Body

| Parameter              | Value                    |
| ---------------------- | ------------------------ |
| email                  | string                   |
| password               | string                   |

Response ``Status 200``

```json
{
    "token": "string"
}
```

### Todo Groups

#### 1. View all Task Groups

Retriving all of datas from ``task_groups`` Table

``GET http://localhost:3000/v1/api/todos``

Parameters Query

| Parameter                 | Value             | Required      |
| ------------------------- | ----------------- | ------------- |
| page                      |                   | false         |
| size                      |                   | false         |
| search                    |                   | false         |

Response ``Status 200``

```json
{
    "totalItems": number,
    "data": [
        {
            "id": number,
            "uuid": "string",
            "title": "string",
            "UserId": 2,
            "createdAt": "date",
            "updatedAt": "date",
            "User": {
                "id": number,
                "uuid": "string",
                "firstName": "string",
                "lastName": "string",
                "email": "string",
                "username": "string",
                "createdAt": "date",
                "updatedAt": "date"
            },
            "Tasks": [
                {
                    "id": number,
                    "uuid": "string",
                    "TaskGroupId": number,
                    "description": "string",
                    "completed": boolean,
                    "completedAt": "date | null",
                    "createdAt": "date",
                    "updatedAt": "date"
                },
                {
                    ...
                }
        }
    ],
    "totalPages": number,
    "currentPage": number
}
```

#### 2. View Task Group By UUID

``GET http://localhost:3000/v1/api/todos/:id``

For getting ``:id`` just take alook field ``uuid`` on table ``task_groups``

``:id => uuid``

Response ``Status 200``

```json
{
    "name": "TaskGroupView",
    "data": {
        "id": number,
        "uuid": "string",
        "title": "string",
        "UserId": number,
        "createdAt": "date",
        "updatedAt": "date",
        "Tasks": [
            {
                "id": number,
                "uuid": "string",
                "TaskGroupId": number,
                "description": "string",
                "completed": boolean,
                "completedAt": "date | null",
                "createdAt": "date",
                "updatedAt": "date"
            },
            {
                ...
            }
        ]
    }
}
```

#### 3. Create Task Group

Creating Task Group

``POST http://localhost:3000/v1/api/todos``

Parameters Body

| Parameter              | Value                    | Required   |
| ---------------------- | ------------------------ | ---------- |
| title                  | string                   | true       |

Response ``Status 200``

```json
{
    "name": "CreateTodoGroup",
    "message": "Todo Group Successfully Created!",
    "data": {
        "uuid": "string",
        "id": number,
        "title": "string",
        "UserId": number,
        "updatedAt": "date",
        "createdAt": "date"
    }
}
```

#### 4. Update Task Group By UUID

Update Task Group

``PUT http://localhost:3000/v1/api/todos/:id``

``:id`` is uuid from table ``task_groups``

Parameters Body

| Parameter              | Value                    | Required   |
| ---------------------- | ------------------------ | ---------- |
| title                  | string                   | true       |

Response ``Status 200``

```json
{
    "name": "TaskGroupUpdate",
    "message": "Task Group was updated Successfully!",
    "data": {
        "uuid": "string",
        "id": number,
        "title": "string",
        "UserId": number,
        "updatedAt": "date",
        "createdAt": "date"
    }
}
```

#### 5. Delete Task Group by UUID

Deleting task group by uuid with association task remove or delete

``DELETE http://localhost:3000/v1/api/todos/:id``

``:id`` is uuid from table ``task_groups``

Response ``Status 200``

```json
{
    "name": "TaskGroupDelete",
    "message": "Task Group Successfully Deleted!"
}
```

### Todo

#### 1. View All

Viewing all todo datas

``GET http://localhost:3000/v1/api/todos/:groupId/items``

Parameters Query

| Parameter                 | Value             | Required      |
| ------------------------- | ----------------- | ------------- |
| page                      |                   | false         |
| size                      |                   | false         |
| search                    |                   | false         |

Response ``Status 200``

```json
{
    "totalItems": number,
    "data": [
        {
            "uuid": "string",
            "TaskGroupId": number,
            "description": "string",
            "completed": true,
            "completedAt": "date | null",
            "createdAt": "date",
            "updatedAt": "date",
            "TaskGroup": {
                "id": number,
                "uuid": "string",
                "title": "string",
                "UserId": number,
                "createdAt": "date",
                "updatedAt": "date"
            }
        },
        {
            ...
        }
    ],
    "totalPages": number,
    "currentPage": number
}
```

#### 2. View By UUID

``GET http://localhost:3000/v1/api/todos/:groupId/items/:id``

* ``:groupId`` just take alook field ``uuid`` on table ``task_groups``

* ``:id`` just take alook field ``uuid`` on table ``taks``

Response ``Status 200``

```json
{
    "name": "TaskView",
    "data": {
        "id": 2,
        "uuid": "string",
        "TaskGroupId": number,
        "description": "string",
        "completed": true,
        "completedAt": "date | null",
        "createdAt": "date",
        "updatedAt": "date",
        "TaskGroup": {
            "id": number,
            "uuid": "string",
            "title": "string",
            "UserId": number,
            "createdAt": "date",
            "updatedAt": "date"
        }
    }
}
```

#### 3. Create

``POST http://localhost:3000/v1/api/todos``

Parameters Body

| Parameter                 | Value             | Required      |
| ------------------------- | ----------------- | ------------- |
| description               |                   | true          |

Response ``Status 200``

```json
{
    "name": "TaskCreate",
    "message": "Task was created Successfully!",
    "data": {
        "uuid": "ffdd1993-12ce-4a50-888f-9b0e4ddbd028",
        "id": 6,
        "description": "Nangka muda",
        "TaskGroupId": 3,
        "updatedAt": "2023-01-13T06:40:02.890Z",
        "createdAt": "2023-01-13T06:40:02.890Z",
        "completed": false,
        "completedAt": null
    }
}
```

#### 4. Update By UUID

``PUT http://localhost:3000/v1/api/todos/:groupId/items/:id``

* ``:groupId`` just take alook field ``uuid`` on table ``task_groups``

* ``:id`` just take alook field ``uuid`` on table ``taks``

Response ``Status 200``

```json
{
    "name": "TaskUpdate",
    "message": "Task was updated successfully!",
    "data": {
        "id": 2,
        "uuid": "string",
        "TaskGroupId": number,
        "description": "string",
        "completed": true,
        "completedAt": "date | null",
        "createdAt": "date",
        "updatedAt": "date"
    }
}
```

#### 5. Delete By UUID

``DELETE http://localhost:3000/v1/api/todos/:groupId/items/:id``

* ``:groupId`` just take alook field ``uuid`` on table ``task_groups``

* ``:id`` just take alook field ``uuid`` on table ``taks``

Response ``Status 200``

```json
{
    "name": "TaskDelete",
    "message": "Task Successfully Deleted!"
}
```


## License
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=plastic)](https://opensource.org/licenses/MIT)



