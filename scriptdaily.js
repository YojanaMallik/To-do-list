document.addEventListener("DOMContentLoaded", function () {
    populateDropdowns();
    updateDaily();
});

function populateDropdowns() {
    const startTimeDropdown = document.getElementById("startTime");
    const endTimeDropdown = document.getElementById("endTime");

    for (let i = 0; i <= 23; i++) {
        const option = document.createElement("option");
        option.text = i.toString().padStart(2, "0") + ":00";
        option.value = i.toString().padStart(2, "0") + ":00";
        startTimeDropdown.appendChild(option);
        endTimeDropdown.appendChild(option.cloneNode(true));
    }
}

function getAndUpdate() {
    console.log("Updating List...");
    const startTime = document.getElementById("startTime").value;
    const endTime = document.getElementById("endTime").value;
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;

    const item = {
        startTime: startTime,
        endTime: endTime,
        title: title,
        description: description,
    };

    let itemList = JSON.parse(localStorage.getItem("dailyItemsJson")) || [];
    itemList.push(item);
    localStorage.setItem("dailyItemsJson", JSON.stringify(itemList));

    updateDaily();
    clearForm();
}

function updateDaily() {
    const itemList = JSON.parse(localStorage.getItem("dailyItemsJson")) || [];
    const tableBody = document.getElementById("tableBody");
    let tableHtml = "";

    itemList.forEach((item, index) => {
        const statusClass = item.status === "Complete" ? "alert-success" : "alert-danger";

        tableHtml += `
            <tr>
                <td>${item.startTime}</td>
                <td>${item.endTime}</td>
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
    let itemList = JSON.parse(localStorage.getItem("dailyItemsJson")) || [];
    let item = itemList[itemIndex];

    item.status = newStatus;
    localStorage.setItem("dailyItemsJson", JSON.stringify(itemList));
    updateDaily();
}

function toggleStatus(itemIndex) {
    let itemList = JSON.parse(localStorage.getItem("dailyItemsJson")) || [];
    let item = itemList[itemIndex];

    item.status = item.status === "Pending" ? "Complete" : "Pending";
    localStorage.setItem("dailyItemsJson", JSON.stringify(itemList));
    updateDaily();
}

function deleteItem(itemIndex) {
    let itemList = JSON.parse(localStorage.getItem("dailyItemsJson")) || [];
    itemList.splice(itemIndex, 1);
    localStorage.setItem("dailyItemsJson", JSON.stringify(itemList));
    updateDaily();
}

function clearDailyStorage() {
    if (confirm("Do you really want to clear the list?")) {
        localStorage.removeItem("dailyItemsJson");
        updateDaily();
    }
}

function clearForm() {
    document.getElementById("startTime").value = "";
    document.getElementById("endTime").value = "";
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
}

const addButton = document.getElementById("add");
addButton.addEventListener("click", getAndUpdate);
