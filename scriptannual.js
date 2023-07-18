function getAndUpdate() {
    console.log("Updating List...");
    const month = document.getElementById('month').value;
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;

    if (localStorage.getItem('annualItemsJson') == null) {
        annualItemJsonArray = [];
        annualItemJsonArray.push({ month, items: [{ title, description, status: 'Pending' }] });
        localStorage.setItem('annualItemsJson', JSON.stringify(annualItemJsonArray));
    } else {
        annualItemJsonArrayStr = localStorage.getItem('annualItemsJson');
        annualItemJsonArray = JSON.parse(annualItemJsonArrayStr);

        const existingMonthIndex = annualItemJsonArray.findIndex(item => item.month === month);
        if (existingMonthIndex === -1) {
            annualItemJsonArray.push({ month, items: [{ title, description, status: 'Pending' }] });
        } else {
            annualItemJsonArray[existingMonthIndex].items.push({ title, description, status: 'Pending' });
        }

        localStorage.setItem('annualItemsJson', JSON.stringify(annualItemJsonArray));
    }

    updateAnnual();
    clearForm();
}

function updateAnnual() {
    let annualItemJsonArray = [];
    if (localStorage.getItem('annualItemsJson') != null) {
        const annualItemJsonArrayStr = localStorage.getItem('annualItemsJson');
        annualItemJsonArray = JSON.parse(annualItemJsonArrayStr);
    }

    let tableBody = document.getElementById("tableBody");
    let str = "";
    annualItemJsonArray.forEach((monthObj, index) => {
        monthObj.items.forEach((item, itemIndex) => {
            const statusClass = item.status === "Complete" ? "alert-success" : "alert-danger";

            str += `
                <tr>
                    <td>${monthObj.month}</td>
                    <td>${item.title}</td>
                    <td>${item.description}</td>
                    <td>
                        <div class="status-alert ${statusClass}" onclick="toggleStatus(${index},${itemIndex})">${item.status}</div>
                    </td>
                    <td><button class="btn btn-sm btn-primary" onclick="deleteItem(${index},${itemIndex})">Delete</button></td>
                </tr>`;
        });
    });
    tableBody.innerHTML = str;
}

function toggleStatus(monthIndex, itemIndex) {
    const annualItemJsonArrayStr = localStorage.getItem('annualItemsJson');
    const annualItemJsonArray = JSON.parse(annualItemJsonArrayStr);
    const item = annualItemJsonArray[monthIndex].items[itemIndex];

    item.status = item.status === 'Pending' ? 'Complete' : 'Pending';
    localStorage.setItem('annualItemsJson', JSON.stringify(annualItemJsonArray));
    updateAnnual();
}

function deleteItem(monthIndex, itemIndex) {
    console.log("Delete", monthIndex, itemIndex);
    const annualItemJsonArrayStr = localStorage.getItem('annualItemsJson');
    const annualItemJsonArray = JSON.parse(annualItemJsonArrayStr);
    if (annualItemJsonArray[monthIndex]) {
        annualItemJsonArray[monthIndex].items.splice(itemIndex, 1);
        localStorage.setItem('annualItemsJson', JSON.stringify(annualItemJsonArray));
        updateAnnual();
    }
}

function clearStorage() {
    if (confirm("Do you really want to clear?")) {
        console.log('Clearing the storage');
        localStorage.removeItem('annualItemsJson');
        updateAnnual();
    }
}

function clearForm() {
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
}

const add = document.getElementById("add");
add.addEventListener("click", getAndUpdate);
updateAnnual();
