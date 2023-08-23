const express = require("express");
const path = require("path");
const fileURLToPath = require("url");
const {
  query_getOpenTableId,
  saveItemToDatabase,
  query_getTableInformation,
  query_getButtonsInformation,
} = require("./database.js");

const hostname = "0.0.0.0"; // Allow connections from any IP
const port = process.env.PORT || 8080; //
const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//GET HOME
app.get("/home", async (req, res) => {
  res.render("index");
});

//GET TABLES
app.get("/tables", async (req, res) => {
  var ids = await query_getOpenTableId();
  var Json = JSON.stringify(ids);
  var obj = JSON.parse(Json);
  var idList = obj[0];

  res.render("tables", { idList });
});

//GET TABLE
app.get("/tableId=:tableId", async (req, res) => {
  const tableId = req.params.tableId;

  const item = await query_getTableInformation(tableId);
  var itemList = item[0];

  const btn = await query_getButtonsInformation(tableId);
  var btnList = btn[0];

  res.render("tabletemplate", { tableId, itemList, btnList });
});

//POST TABLE
app.post("/tableId=:tableId", async (req, res) => {
  const tableId = req.params.tableId;
  const data = req.body;

  saveItemToDatabase(data);
  const tableData = await query_getTableInformation(tableId);

  res.send(tableData);
});

app.put("/tableId=:tableId", async (req, res) => {
  const tableId = req.params.tableId;
  const data = req.body;
  // console.log(data);
  //PROBLEMA DUPLICACAO DE ENTRADAS SENDO ADICIONADAS NO DATABASE
  //1. QUANDO EU CLICO NO BOTAO.
  //2. QUANDO EU CARREGO OS ITEMS DA MESA.

  saveItemToDatabase(data);

  res.send("btn updated");
});

app.listen(port, () => console.log(`Running on port ${port}!`));
