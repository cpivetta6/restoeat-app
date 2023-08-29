// script.js
const button = document.getElementById("show-information");

const popupContent = `<div class="container">
<div class="container-header">
  <span id="close">&times</span>
</div>

<div class="text-info">
<h2>Functions Informations</h2>
<div style="display: flex; ">
<p style="font-weight: bold;">Decrease or Delete items: </p> 
<p>Click on the item printed row</p> 
</div>

<div style="display: flex;">
<p style="font-weight: bold;">Edit Button: </p> 
<p> Right-Click on the button</p> 
</div>

<div style="display: flex;">
<p style="font-weight: bold;">Return to the tables: </p> 
<p> Click on the logo "SERVEAT"</p> 
</div>

</div>

<div>




</div>`;

button.addEventListener("click", function (event) {
  event.preventDefault();

  const popupContainer = document.getElementById("info-popup");
  popupContainer.style.display = "flex";
  popupContainer.innerHTML = popupContent;

  const closeIcon = document.getElementById("close");

  closeIcon.addEventListener("click", function (event) {
    event.preventDefault();
    const popupContainer = document.getElementById("info-popup");
    popupContainer.style.display = "none";
  });
});
