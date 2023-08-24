import { totalCell } from "./ButtonCreation.js";

const tableUrlToCacth = window.location.href;
const url = tableUrlToCacth.match(/tableId=(\d{1,2})/)[0];

const table = {
  id: tableUrlToCacth.match(/tableId=(\d{1,2})/)[1],
  name: tableUrlToCacth.match(/tableId=(\d{1,2})/)[0],
};

export async function ButtonAct(item) {
  // Find the existing row with the same item, if any
  var existingRow = document.querySelector(
    "#myTable tbody tr[id='" + item.id + "']"
  );

  if (item.amount > 1) {
    const data = [table, item, "insertOrderItems"];

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw new Error(
              `${response.status} ${response.statusText}: ${JSON.stringify(
                errorData
              )}`
            );
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  if (existingRow) {
    // Update the quantitiy in the existing row

    var valueCell = existingRow.querySelector(".itemAmount");
    var priceCell = existingRow.querySelector(".itemPrice");

    valueCell.textContent = item.amount;
    priceCell.textContent = item.totalValue.toFixed(2) + "€";
    totalCell();
  } else {
    const data = [table, item, "insertItem"];

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw new Error(
              `${response.status} ${response.statusText}: ${JSON.stringify(
                errorData
              )}`
            );
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
    // Create a new row and append it to the table

    var newRow = document.createElement("tr");

    //Set atribute unique for a newRow, to identify the diferent rows
    newRow.setAttribute("id", item.id);

    newRow.addEventListener("click", function () {
      // Get the value and price cells within the clicked row
      var amountCell = newRow.querySelector(".itemAmount");
      var pCell = newRow.querySelector(".itemPrice");

      item.amount = parseInt(amountCell.textContent);

      //Create logic function
      if (item.amount <= 1) {
        newRow.remove();
        item.amount = 0;
        item.totalValue = 0;
        const data = [table, item, "deleteItem"];
        //DELETE BTN IF AMOUNT IS < 1 >
        fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then((response) => {
            if (!response.ok) {
              return response.json().then((errorData) => {
                throw new Error(
                  `${response.status} ${response.statusText}: ${JSON.stringify(
                    errorData
                  )}`
                );
              });
            }
          })
          .catch((error) => {
            console.error(error);
          });

        totalCell();
      } else {
        item.amount--;
        item.totalValue = item.price * item.amount;

        amountCell.textContent = item.amount;
        pCell.textContent = item.totalValue.toFixed(2) + "€";

        const data = [table, item, "updateItem"];
        //UPDATE BTN IF THE AMOUNT IS > 0
        fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then((response) => {
            if (!response.ok) {
              return response.json().then((errorData) => {
                throw new Error(
                  `${response.status} ${response.statusText}: ${JSON.stringify(
                    errorData
                  )}`
                );
              });
            }
          })
          .catch((error) => {
            console.error(error);
          });

        totalCell();
      }
    });

    //Creating cells
    var itemCell = document.createElement("td");
    itemCell.classList.add("itemName");
    itemCell.textContent = item.name;
    newRow.appendChild(itemCell);

    var amountCell = document.createElement("td");
    amountCell.classList.add("itemAmount");
    amountCell.textContent = item.amount;
    newRow.appendChild(amountCell);

    var pCell = document.createElement("td");
    pCell.classList.add("pitem");
    item.price = parseFloat(item.price);
    pCell.textContent = item.price.toFixed(2) + "€";
    newRow.appendChild(pCell);

    var priceCell = document.createElement("td");
    priceCell.classList.add("itemPrice");
    priceCell.textContent = item.totalValue.toFixed(2) + "€";
    newRow.appendChild(priceCell);

    document.querySelector("#myTable tbody").appendChild(newRow);
    return "create";
  }
}
