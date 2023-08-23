const { Pool } = require("pg");

const databaseUrl = process.env.DATABASE_URL;
const connectionString =
  "postgres://postgresql_test2_5avf_user:jp6koVgNcnRyiERCMwuCGT4KOwAsZOK3@dpg-cjc9fubbq8nc739b5stg-a.frankfurt-postgres.render.com/postgresql_test2_5avf";

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false },
});

async function saveItemToDatabase(data) {
  const table = data[0];
  const button = data[1];
  const operation = data[2];

  console.log(operation);

  switch (operation) {
    case "insertOrderItems":
      await query_addOrUpdateItem(table, button);
      break;

    case "insertItem":
      await query_insertOrderItem(table, button);
      break;

    case "updateItem":
      await query_updateButtonOrderItem(table, button);
      break;

    case "deleteItem":
      await query_deleteRow(table, button);
      break;

    case "editItem":
      await query_updateBtnData(button);
      break;
  }
}

async function query_getOpenTableId() {
  const query = "SELECT table_id FROM order_item";

  try {
    const client = await pool.connect();
    try {
      const result = await client.query(query);

      return result.rows;
    } catch (error) {
      // Handle any errors that occur during the query
      console.error(error);
      throw error; // Optionally rethrow the error to propagate it
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error executing query:", error);
    throw error; // Rethrow the error for error handling in the calling code
  }
}

async function query_getTableInformation(tableId) {
  const query_getTableInformation =
    "SELECT oi.item_id AS id, bi.button_name AS name, bi.id_name AS idName, oi.amount, bi.price, oi.totalvalue FROM order_item oi JOIN button_item bi ON oi.item_id = bi.id WHERE oi.table_id = $1;";
  const select_parameter = [tableId];

  try {
    const client = await pool.connect();
    try {
      const result = await client.query(
        query_getTableInformation,
        select_parameter
      );

      return result.rows;
    } catch (error) {
      // Handle any errors that occur during the query
      console.error(error);
      throw error; // Optionally rethrow the error to propagate it
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error executing query:", error);
    throw error; // Rethrow the error for error handling in the calling code
  }
}

async function query_getButtonsInformation() {
  const query_getTableInformation = "SELECT * FROM button_item";

  try {
    const client = await pool.connect();
    try {
      const result = await client.query(query_getTableInformation);

      return result.rows;
    } catch (error) {
      // Handle any errors that occur during the query
      console.error(error);
      throw error; // Optionally rethrow the error to propagate it
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error executing query:", error);
    throw error; // Rethrow the error for error handling in the calling code
  }
}

async function query_updateBtnData(button) {
  const query =
    "UPDATE button_item SET button_name = $1, price = $2 WHERE id = $3";

  const parameters = [
    button.name === undefined ? null : button.name,
    button.price === undefined ? null : button.price,
    button.id === undefined ? null : button.id,
  ];

  try {
    const client = await pool.connect();
    try {
      const result = await client.query(query, parameters);

      console.log("btn updated");
      // Handle successful query execution
    } catch (error) {
      console.error(error);
      // Handle the error
      throw error; // Optionally rethrow the error to propagate it
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error executing query:", error);
    throw error; // Rethrow the error for error handling in the calling code
  }
}

async function query_deleteRow(table, button) {
  const query_selectTableID =
    "DELETE FROM order_item WHERE table_id = $1 AND item_id = $2";

  const parameters = [
    table.id === undefined ? null : table.id,
    button.id === undefined ? null : button.id,
  ];

  try {
    const client = await pool.connect();
    try {
      const result = await client.query(query_selectTableID, parameters);

      console.log("deleted");
      // Handle successful query execution
    } catch (error) {
      console.error(error);
      // Handle the error
      throw error; // Optionally rethrow the error to propagate it
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error executing query:", error);
    throw error; // Rethrow the error for error handling in the calling code
  }
}

async function query_addOrUpdateItem(table, button) {
  const query_selectTableID =
    "SELECT COUNT(*) AS count FROM order_item WHERE table_id = $1 AND item_id = $2";

  const select_parameter = [
    table.id === undefined ? null : table.id,
    button.id === undefined ? null : button.id,
  ];

  var counter = 0;

  try {
    const client = await pool.connect();
    try {
      const result = await client.query(query_selectTableID, select_parameter);
      counter = result.rows[0].count;
    } catch (error) {
      // Handle any errors that occur during the query
      console.error(error);
      throw error; // Optionally rethrow the error to propagate it
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error executing query:", error);
    throw error; // Rethrow the error for error handling in the calling code
  }

  if (counter > 0) {
    // Call your update function here
    query_updateButtonOrderItem(table, button);
  } else {
    // Call your insert function here
    query_insertOrderItem(table, button);
  }
}

async function query_updateButtonOrderItem(table, button) {
  const query_updateItem =
    "UPDATE order_item SET amount = $1, totalvalue = $2 WHERE table_id = $3 AND item_id = $4";

  const params = [button.amount, button.totalValue, table.id, button.id];

  try {
    const client = await pool.connect();
    try {
      await client.query(query_updateItem, params);

      console.log("Record updated successfully");
      // Handle successful query execution
    } catch (error) {
      console.error(error);
      // Handle the error
      throw error; // Optionally rethrow the error to propagate it
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error executing query:", error);
    throw error; // Rethrow the error for error handling in the calling code
  }
}

async function query_checkDuplicate(table, button) {
  const query_selectTableID =
    "SELECT COUNT(*) AS count FROM order_item WHERE table_id = $1 AND item_id = $2";

  const duplicate_check_params = [table.id, button.id];

  var count = 0;

  try {
    const client = await pool.connect();
    try {
      const result = await client.query(
        query_selectTableID,
        duplicate_check_params
      );
      count = parseInt(result.rows[0].count);
    } catch (error) {
      // Handle any errors that occur during the query
      console.error(error);
      throw error; // Optionally rethrow the error to propagate it
    } finally {
      client.release();
      return count;
    }
  } catch (error) {
    console.error("Error executing query:", error);
    throw error; // Rethrow the error for error handling in the calling code
  }
}

async function query_insertOrderItem(table, button) {
  const counter = await query_checkDuplicate(table, button);

  if (counter === 0) {
    const query_insertTable =
      "INSERT INTO order_item (table_id, item_id, amount, totalvalue) VALUES ($1, $2, $3, $4)";
    const table_parameters = [
      table.id,
      button.id,
      button.amount,
      button.totalValue,
    ];

    try {
      const client = await pool.connect();
      try {
        await client.query(query_insertTable, table_parameters);

        console.log("Record inserted successfully");
        // Handle successful query execution
      } catch (error) {
        console.error(error);
        // Handle the error
        throw error; // Optionally rethrow the error to propagate it
      } finally {
        client.release();
      }
    } catch (error) {
      console.error("Error executing query:", error);
      throw error; // Rethrow the error for error handling in the calling code
    }
  } else {
    console.log("counter > 0");
  }
}

module.exports = {
  query_getOpenTableId,
  saveItemToDatabase,
  query_getTableInformation,
  query_getButtonsInformation,
};
