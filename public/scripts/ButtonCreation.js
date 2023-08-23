import { ButtonListProcessor } from "./ButtonListProcessor.js";

const tableUrlToCacth = window.location.href;
const tableUrlId = tableUrlToCacth.match(/tableId=(\d{1,2})/)[0];

export function buttonCreation(buttonList, orderList) {
  totalCell();
  //name of the buttons name
  for (let l of buttonList) {
    const buttonId = l.id_name;

    const button = document.querySelector(`[id="${buttonId}"]`);
    if (button) {
      button.textContent = l.button_name;
    }
  }

  const Buttons = [];

  for (let i = 0; i < buttonList.length; i++) {
    const foundItem = orderList.find((item) => item.id === buttonList[i].id);
    // console.log(foundItem);
    if (foundItem) {
      Buttons.push(foundItem);
    } else {
      var item = {
        id: buttonList[i].id,
        name: buttonList[i].button_name,
        idname: buttonList[i].id_name,
        amount: 0,
        price: buttonList[i].price,
        totalvalue: 0.0,
      };
      Buttons.push(item);
    }
  }

  ButtonListProcessor(Buttons);
}

export function totalCell() {
  var totalValue = 0.0;

  const rows = document.querySelectorAll("#myTable tbody tr");
  if (rows) {
    for (let r of rows) {
      totalValue += parseFloat(r.querySelector(".itemPrice").textContent);
    }
  }

  let roundedTotal = totalValue.toFixed(2);

  // Find the existing row with the same item, if any
  var totalAmountElement = document.getElementById("totalTable");

  totalAmountElement.innerHTML = "<h4>" + roundedTotal + "€" + "</h4>";
}
