/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.get("/article/new", "BlogController.create").as("create");
  Route.post("/article/new", "BlogController.save");

  Route.get("/article/:id", "BlogController.detail").as("detail");
  Route.post("/article/:id", "BlogController.update");

  Route.delete("/article/:id", "BlogController.delete");
}).middleware("auth");

Route.get("/", "BlogController.index").as("home");

Route.get("/login", "SecurityController.index").as("login");
Route.post("/login", "SecurityController.save");
