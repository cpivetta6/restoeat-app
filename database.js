const database = require("mysql2");

const pool = database.createPool({
  host: "127.0.0.1", // MySQL server hostname
  user: "root", // MySQL username
  password: "blknfg", // MySQL password
  database: "restoapp", // MySQL database name
  port: 3306, // MySQL port (default is 3306)
});

// Insert a new table and buttons into the database

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
  const query = "select table_id from order_item";

  try {
    const connection = await pool.promise().getConnection();
    try {
      const result = connection.execute(query);

      return result;
    } catch (error) {
      // Handle any errors that occur during the query
      console.error(error);
      throw error; // Optionally rethrow the error to propagate it
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error executing query:", error);
    throw error; // Rethrow the error for error handling in the calling code
  }
}

async function query_getTableInformation(tableId) {
  const query_getTableInformation =
    "SELECT oi.item_id AS id, bi.button_name AS name, bi.id_name AS idName, oi.amount, bi.price, oi.totalValue FROM order_item oi JOIN button_item bi ON oi.item_id = bi.id WHERE oi.table_id = ?;";
  const select_parameter = [tableId];

  try {
    const connection = await pool.promise().getConnection();
    try {
      const result = connection.execute(
        query_getTableInformation,
        select_parameter
      );

      return result;
    } catch (error) {
      // Handle any errors that occur during the query
      console.error(error);
      throw error; // Optionally rethrow the error to propagate it
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error executing query:", error);
    throw error; // Rethrow the error for error handling in the calling code
  }
}

async function query_getButtonsInformation() {
  const query_getTableInformation = "SELECT * FROM button_item";

  try {
    const connection = await pool.promise().getConnection();
    try {
      const result = connection.execute(query_getTableInformation);

      return result;
    } catch (error) {
      // Handle any errors that occur during the query
      console.error(error);
      throw error; // Optionally rethrow the error to propagate it
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error executing query:", error);
    throw error; // Rethrow the error for error handling in the calling code
  }
}

async function query_updateBtnData(button) {
  const query =
    "UPDATE button_item SET button_name = ?, price = ? WHERE id = ?";

  const parameters = [
    button.name === undefined ? "test" : button.name,
    button.price === undefined ? "test" : button.price,
    button.id === undefined ? "test" : button.id,
  ];

  try {
    const connection = await pool.promise().getConnection();
    try {
      // Insert the table into the "tables" table
      connection.execute(query, parameters, (error, results, fields) => {
        if (error) {
          console.error(error);
          // Handle the error
        } else {
          console.log("btn updated");
          // Handle successful query execution
        }
      });
    } catch (err) {
      throw err;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error executing query:", error);
    throw error; // Rethrow the error for error handling in the calling code
  }
}

async function query_deleteRow(table, button) {
  const query_selectTableID =
    "DELETE FROM order_item WHERE table_id = ? and item_id = ?";

  const parameter = [
    table.id === undefined ? null : table.id,
    button.id === undefined ? null : button.id,
  ];

  try {
    const connection = await pool.promise().getConnection();
    try {
      // Insert the table into the "tables" table
      connection.execute(
        query_selectTableID,
        parameter,
        (error, results, fields) => {
          if (error) {
            console.error(error);
            // Handle the error
          } else {
            console.log("deleted");
            // Handle successful query execution
          }
        }
      );
    } catch (err) {
      throw err;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error executing query:", error);
    throw error; // Rethrow the error for error handling in the calling code
  }
}

async function query_addOrUpdateItem(table, button) {
  const query_selectTableID =
    "SELECT COUNT(*) AS count FROM order_item WHERE table_id = ? and item_id = ?";

  const select_parameter = [
    table.id === undefined ? null : table.id,
    button.id === undefined ? null : button.id,
  ];

  var counter = [];

  try {
    const connection = await pool.promise().getConnection();
    try {
      const result = await connection.execute(
        query_selectTableID,
        select_parameter
      );
      counter = result[0][0];
    } catch (error) {
      // Handle any errors that occur during the query
      console.error(error);
      throw error; // Optionally rethrow the error to propagate it
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error executing query:", error);
    throw error; // Rethrow the error for error handling in the calling code
  }

  //const counter = result[0][0];

  if (counter.count > 0) {
    //update button
    query_updateButtonOrderItem(table, button);
  } else {
    //insert button
    query_insertOrderItem(table, button);
  }
}

async function query_updateButtonOrderItem(table, button) {
  const query_updateItem =
    "UPDATE order_item SET amount = ?, totalValue = ? WHERE table_id = ? and item_id = ?";
  const params = [button.amount, button.totalValue, table.id, button.id];

  try {
    const connection = await pool.promise().getConnection();
    try {
      // Insert the table into the "tables" table
      connection.execute(query_updateItem, params, (error, results, fields) => {
        if (error) {
          console.error(error);
          // Handle the error
        } else {
          console.log("Record inserted successfully");
          // Handle successful query execution
        }
      });
    } catch (err) {
      throw err;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error executing query:", error);
    throw error; // Rethrow the error for error handling in the calling code
  }
}

async function query_checkDuplicate(table, button) {
  const query_selectTableID =
    "SELECT COUNT(*) AS count FROM order_item WHERE table_id = ? and item_id = ?";

  const duplicate_check_params = [table.id, button.id];

  var count = 0;

  try {
    const connection = await pool.promise().getConnection();
    try {
      const [rows] = await connection.execute(
        query_selectTableID,
        duplicate_check_params
      );
      connection.release();
      count = rows[0].count;
    } catch (error) {
      // Handle any errors that occur during the query
      console.error(error);
      throw error; // Optionally rethrow the error to propagate it
    } finally {
      connection.release();
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
    //define insert table query
    const query_insertTable =
      "INSERT INTO order_item (table_id , item_id, amount, totalValue) VALUES (?, ?, ?, ?)";
    const table_parameters = [
      table.id,
      button.id,
      button.amount,
      button.totalValue,
    ];

    try {
      const connection = await pool.promise().getConnection();
      try {
        // Insert the table into the "tables" table
        connection.execute(
          query_insertTable,
          table_parameters,
          (error, results, fields) => {
            if (error) {
              console.log(error);
              // Handle the error
            } else {
              console.log("Record inserted successfully");
              // Handle successful query execution
            }
          }
        );
      } catch (err) {
        throw err;
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error("Error executing query:", error);
      throw error; // Rethrow the error for error handling in the calling code
    }
  }
}

module.exports = {
  query_getOpenTableId,
  saveItemToDatabase,
  query_getTableInformation,
  query_getButtonsInformation,
};
