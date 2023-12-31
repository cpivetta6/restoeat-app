export function tableColor(idList) {
  if (idList) {
    for (var id of idList) {
      var tableId = id.table_id;

      const linkElement = document.getElementById(tableId);
      linkElement.style.background = "red";

      linkElement.addEventListener("mouseenter", function () {
        // Set the box-shadow style for the link on hover

        this.style.boxShadow = "0 0 0 0 #fff, 0 0 0 3px red";
      });

      linkElement.addEventListener("mouseleave", function () {
        // Reset the box-shadow style when the hover is not active

        this.style.boxShadow = "none";
      });
    }
  }
}

export function updateClock() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  const timeString = `${hours}:${minutes}:${seconds}`;

  document.getElementById("clock").textContent = timeString;
}

export function paymentPopUp() {
  const myButton = document.getElementById("paymentBtn");

  const popupContent = `
    <div class="modal"> 
    <div class="payment-header">
    <p>Are you sure you want to close the table and print the bill?</p>
    <div class="popup-buttons"> 
    <button id="confirmButton">Yes</button>
    <button id="cancelButton">Cancel</button>
    </div>
    </div>
    </div>
  `;

  myButton.addEventListener("click", function (event) {
    event.preventDefault();
    const confirmationPopup = document.getElementById("confirmationPopup");
    const listPopUp = document.getElementById("listPopUp");
    confirmationPopup.innerHTML = popupContent;
    confirmationPopup.style.display = "block";

    const confirmButton = document.getElementById("confirmButton");

    confirmButton.addEventListener("click", function (event) {
      event.preventDefault();

      const orderList = [];
      const rows = document.querySelectorAll("#myTable tbody tr");
      if (rows) {
        for (let r of rows) {
          const item = {
            name: r.querySelector(".itemName").textContent,
            amount: r.querySelector(".itemAmount").textContent,
            price: r.querySelector(".pitem").textContent,
            totalValue: r.querySelector(".itemPrice").textContent,
          };
          orderList.push(item);
        }
      }

      let orderListString = orderList
        .map((item) => {
          return `
          <tr>
            <td>${item.name}</td>
            <td class="quantity">${item.amount}</td>
            <td class="price">${item.totalValue}</td>
            
          </tr>
        `;
        })
        .join("<td>");

      const total = document.getElementById("totalTable").textContent;
      const totalRow = `
          <tr>
            <td class="total">TOTAL:</td>
            <td></td>
            <td class="total-value">${total}</td>
            
           
          </tr>

        `;

      const printBill = `
     
    
    
      <div class="invoice">
        <div class="invoice-header">
          <h2>Restaurant Invoice</h2>
          <p>Date: July 27, 2023</p>
        </div>
        <table>
          <thead>
            <tr>
              <th class="item"></th>
              <th></th>
              <th class="price"></th>
            </tr>
          </thead>
          <tbody>
            
             ${orderListString}
             ${totalRow}
          </tbody> 
         
        </table>
        <div class="popup-buttons"> 
        <button id="printButton">Print</button>
        <button id="cancelPrint">Cancel</button>
        </div>
      </div>
     
     
    
    `;

      listPopUp.innerHTML = printBill;
      listPopUp.style.display = "block";
      confirmationPopup.style.display = "none";
      /*
      const printButton = document.getElementById("printButton");
      printButton.addEventListener("click", function (e) {
        e.preventDefault();

        const confirmationPopup = document.getElementById("popupContainer");
        confirmationPopup.style.display = "none";
      });*/

      const cancelPrint = document.getElementById("cancelPrint");
      cancelPrint.addEventListener("click", function (e) {
        e.preventDefault();

        const listPopUp = document.getElementById("listPopUp");
        listPopUp.style.display = "none";
      });
    });

    const cancelButton = document.getElementById("cancelButton");
    cancelButton.addEventListener("click", function (e) {
      e.preventDefault();

      const confirmationPopup = document.getElementById("confirmationPopup");
      confirmationPopup.style.display = "none";
    });
  });
}
