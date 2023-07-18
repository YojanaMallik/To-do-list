document.addEventListener("DOMContentLoaded", function () {
  updateMonthly();
});

function getAndUpdate() {
  console.log("Updating List...");
  const date = document.getElementById("date").value;
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;

  const item = {
      date: date,
      title: title,
      description: description,
      status: "Pending"
  };

  let itemList = JSON.parse(localStorage.getItem("monthlyItemsJson")) || [];
  itemList.push(item);
  localStorage.setItem("monthlyItemsJson", JSON.stringify(itemList));

  updateMonthly();
  clearForm();
}

function updateMonthly() {
  const itemList = JSON.parse(localStorage.getItem("monthlyItemsJson")) || [];
  const tableBody = document.getElementById("tableBody");
  let tableHtml = "";

  itemList.forEach((item, index) => {
      const statusClass = item.status === "Complete" ? "alert-success" : "alert-danger";
      
      const dateObj = new Date(item.date);
      const formattedDate = dateObj.getDate().toString().padStart(2, "0") + "-" + (dateObj.getMonth() + 1).toString().padStart(2, "0") + "-" + dateObj.getFullYear();

      tableHtml += `
          <tr>
              <td>${formattedDate}</td>
              <td>${item.title}</td>
              <td>${item.description}</td>
              <td>
                  <div class="status-alert ${statusClass}" onclick="toggleStatus(${index})">${item.status}</div>
              </td>
              <td><button class="btn btn-sm btn-primary" onclick="deleteItem(${index})">Delete</button></td>
          </tr>
      `;
  });

  tableBody.innerHTML = tableHtml;
}

function updateStatus(itemIndex, newStatus) {
  let itemList = JSON.parse(localStorage.getItem("monthlyItemsJson")) || [];
  let item = itemList[itemIndex];

  item.status = newStatus;
  localStorage.setItem("monthlyItemsJson", JSON.stringify(itemList));
  updateMonthly();
}

function toggleStatus(itemIndex) {
  let itemList = JSON.parse(localStorage.getItem("monthlyItemsJson")) || [];
  let item = itemList[itemIndex];

  item.status = item.status === "Pending" ? "Complete" : "Pending";
  localStorage.setItem("monthlyItemsJson", JSON.stringify(itemList));
  updateMonthly();
}

function deleteItem(itemIndex) {
  let itemList = JSON.parse(localStorage.getItem("monthlyItemsJson")) || [];
  itemList.splice(itemIndex, 1);
  localStorage.setItem("monthlyItemsJson", JSON.stringify(itemList));
  updateMonthly();
}

function clearMonthlyStorage() {
  if (confirm("Do you really want to clear the list?")) {
      localStorage.removeItem("monthlyItemsJson");
      updateMonthly();
  }
}

function clearForm() {
  document.getElementById("date").value = "";
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
}

const addButton = document.getElementById("add");
addButton.addEventListener("click", getAndUpdate);
