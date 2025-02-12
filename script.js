document.addEventListener("DOMContentLoaded", function () {
    console.log("Script loaded successfully!");

    document.getElementById("generateButton").addEventListener("click", generateSchedule);
});

function generateSchedule() {
    console.log("Button clicked!"); // Debugging

    let startDateInput = document.getElementById("startDate").value;
    let repeatDays = parseInt(document.getElementById("repeatDays").value);
    let scheduleList = document.getElementById("scheduleList");

    scheduleList.innerHTML = ""; // Clear previous results

    if (!startDateInput) {
        alert("Please select a start date.");
        return;
    }

    let startDate = new Date(startDateInput);
    let currentDate = new Date();
    let dates = [];

    // Move to the next collection date in the future
    while (startDate < currentDate) {
        startDate.setDate(startDate.getDate() + repeatDays);
    }

    // Generate the next 5 collection dates
    for (let i = 0; i < 5; i++) {
        let newDate = new Date(startDate); // Create a copy
        dates.push(newDate);
        startDate.setDate(startDate.getDate() + repeatDays);
    }

    // Display the dates
    dates.forEach(date => {
        let listItem = document.createElement("li");
        listItem.textContent = date.toDateString();
        scheduleList.appendChild(listItem);
    });
}
