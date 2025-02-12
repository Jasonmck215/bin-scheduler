document.addEventListener("DOMContentLoaded", function () {
    console.log("Script loaded successfully!");

    // Listen for the button click
    let button = document.getElementById("generateButton");
    button.addEventListener("click", generateSchedule);
});

// Generate the collection schedule and display it
function generateSchedule() {
    let startDateInput = document.getElementById("startDate").value;
    let repeatDays = parseInt(document.getElementById("repeatDays").value);
    let scheduleList = document.getElementById("scheduleList");
    let calendarDiv = document.getElementById("calendar");
    
    scheduleList.innerHTML = ""; // Clear previous results
    calendarDiv.innerHTML = "";  // Clear previous calendar

    if (!startDateInput || isNaN(repeatDays) || repeatDays <= 0) {
        alert("Please enter a valid start date and repeat days.");
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
        let newDate = new Date(startDate);
        dates.push(newDate);
        startDate.setDate(startDate.getDate() + repeatDays);
    }

    console.log("Generated Dates:", dates); // Debugging
    // Display the list of upcoming dates
    dates.forEach(date => {
        let listItem = document.createElement("li");
        listItem.textContent = date.toDateString();
        scheduleList.appendChild(listItem);
    });

    // Generate the calendar view
    generateCalendar(dates);
}

// Generate the calendar for the current month and highlight collection dates
function generateCalendar(collectionDates) {
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    // Get the first and last day of the month
    let firstDay = new Date(currentYear, currentMonth, 1);
    let lastDay = new Date(currentYear, currentMonth + 1, 0);

    // Get the number of days in the month
    let numDays = lastDay.getDate();
    
    // Create the calendar grid
    let calendarGrid = document.createElement("table");
    let calendarHeader = document.createElement("thead");
    let calendarBody = document.createElement("tbody");

    // Days of the week
    let daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let headerRow = document.createElement("tr");
    daysOfWeek.forEach(day => {
        let headerCell = document.createElement("th");
        headerCell.textContent = day;
        headerRow.appendChild(headerCell);
    });
    calendarHeader.appendChild(headerRow);
    
    // Add calendar grid
    let row = document.createElement("tr");
    for (let i = 0; i < firstDay.getDay(); i++) {
        row.appendChild(document.createElement("td"));
    }

    // Add days of the month
    for (let day = 1; day <= numDays; day++) {
        let cell = document.createElement("td");
        cell.textContent = day;

        // Highlight collection dates
        let cellDate = new Date(currentYear, currentMonth, day);
        collectionDates.forEach(date => {
            if (cellDate.toDateString() === date.toDateString()) {
                cell.classList.add("green");  // Highlight with green
            }
        });

        row.appendChild(cell);

        // Start a new row after every Saturday (7 days)
        if ((firstDay.getDay() + day) % 7 === 0) {
            calendarBody.appendChild(row);
            row = document.createElement("tr");
        }
    }

    // If the last row isn’t filled (incomplete week), add it
    if (row.children.length > 0) {
        calendarBody.appendChild(row);
    }

    calendarGrid.appendChild(calendarHeader);
    calendarGrid.appendChild(calendarBody);
    
    // Add the calendar grid to the page
    document.getElementById("calendar").appendChild(calendarGrid);
}
