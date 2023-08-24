import { ButtonAct } from "./ButtonFunction.js";
import { totalCell } from "./ButtonCreation.js";

const tableUrlToCacth = window.location.href;
const url = tableUrlToCacth.match(/tableId=(\d{1,2})/)[0];

export function ButtonListProcessor(buttons) {
  editButton(buttons);
  actionButton(buttons);

  //Create a pop up to edit the button
  function editButton(buttons) {
    let foundButton = false;

    //console.log(buttons);

    /*
    buttons.forEach((element) => {
      console.log(element.idname);
    });*/

    for (const button of buttons) {
      const myButton = document.getElementById(button.idname);
      //console.log(myButton);

      const popupContent = `
        <div id="myModal" class="modal">
          <div class="modal-content">
          <div><h2>Edit Button</h2></div>
            <div class="close">&times;</div>
            <form id= "saveForm">
              <div>
                <label for="name">Name:</label>
                <input type="text" id="nameInput" name="name" required>
              </div>
              <div>
                <label for="price">Price:</label>
                <input type="number" id="priceInput" name="price" required>
              </div>
              <button id = "submitBtn">Submit</button>
            </form>
          </div>
        </div>`;

      myButton.addEventListener("contextmenu", function (event) {
        event.preventDefault();
        const popupContainer = document.getElementById("popupContainer");
        popupContainer.innerHTML = popupContent;
        popupContainer.style.display = "block";

        const clickedButtonId = event.target.id;
        if (clickedButtonId === button.idname) {
          foundButton = true;
        }

        const nameInput = document.getElementById("nameInput");
        const priceInput = document.getElementById("priceInput");
        const submitBtn = document.getElementById("submitBtn");

        submitBtn.addEventListener("click", function (event) {
          event.preventDefault();

          if (nameInput.value !== "" && nameInput.value !== null) {
            button.name = nameInput.value;
            myButton.textContent = nameInput.value;
          }

          if (priceInput.value != "") {
            button.price = parseFloat(priceInput.value);
          }
          button.price = parseFloat(button.price);
          const data = ["table", button, "editItem"];

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
                    `${response.status} ${
                      response.statusText
                    }: ${JSON.stringify(errorData)}`
                  );
                });
              }
            })
            .catch((error) => {
              console.error(error);
            });

          popupContainer.style.display = "none";
        });

        const closeBtn = document.querySelector(".close");
        closeBtn.addEventListener("click", function () {
          popupContainer.style.display = "none";
        });
      });

      if (foundButton) {
        //event ajax

        break; // Break out of the outer loop
      }
    }
  }

  //Create the Action burron to ROW
  function actionButton(buttons) {
    for (const button of buttons) {
      document
        .getElementById(button.idname)
        .addEventListener("click", function () {
          // Get the item and value from the user or generate them dynamically

          const row = document.querySelector(
            "#myTable tbody tr[id='" + button.id + "']"
          );
          //var valueCell = row.querySelector(".itemAmount");

          button.amount++;

          if (row) {
            var valueCell = parseInt(
              row.querySelector(".itemAmount").textContent
            );
            button.amount = valueCell;
            button.amount++;
          } else {
            button.amount = 1;
          }

          button.totalValue = button.amount * button.price;

          ButtonAct(button);
          totalCell();
        });
    }
  }
}
