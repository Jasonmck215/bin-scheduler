// Function to generate the schedule and show it on the calendar
function generateSchedule() {
    // Get values for each bin from user input
    const greenBinDate = document.getElementById('greenBinDate').value;
    const greenBinRepeat = document.getElementById('greenBinRepeat').value;
    
    const blueBinDate = document.getElementById('blueBinDate').value;
    const blueBinRepeat = document.getElementById('blueBinRepeat').value;

    const purpleBinDate = document.getElementById('purpleBinDate').value;
    const purpleBinRepeat = document.getElementById('purpleBinRepeat').value;

    const brownBinDate = document.getElementById('brownBinDate').value;
    const brownBinRepeat = document.getElementById('brownBinRepeat').value;

    const greyBinDate = document.getElementById('greyBinDate').value;
    const greyBinRepeat = document.getElementById('greyBinRepeat').value;

    // Check if all dates and repeats are provided
    if (!greenBinDate || !blueBinDate || !purpleBinDate || !brownBinDate || !greyBinDate) {
        alert('Please enter all dates.');
        return;
    }

    // Array of bin data
    const binData = [
        { name: 'green', date: new Date(greenBinDate), repeat: greenBinRepeat, color: 'green' },
        { name: 'blue', date: new Date(blueBinDate), repeat: blueBinRepeat, color: 'blue' },
        { name: 'purple', date: new Date(purpleBinDate), repeat: purpleBinRepeat, color: 'purple' },
        { name: 'brown', date: new Date(brownBinDate), repeat: brownBinRepeat, color: 'brown' },
        { name: 'grey', date: new Date(greyBinDate), repeat: greyBinRepeat, color: 'grey' }
    ];

    // Generate the calendar
    const calendarContainer = document.getElementById('calendarContainer');
    calendarContainer.innerHTML = '';  // Clear previous calendar if any

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonth = new Date().getMonth();  // Get current month
    const currentYear = new Date().getFullYear();  // Get current year

    // Create the calendar
    for (let monthOffset = 0; monthOffset < 12; monthOffset++) {
        const month = (currentMonth + monthOffset) % 12;
        const year = currentYear + Math.floor((currentMonth + monthOffset) / 12);
        
        // Create month header
        const monthHeader = document.createElement('div');
        monthHeader.classList.add('month-header');
        monthHeader.textContent = `${monthNames[month]} ${year}`;
        calendarContainer.appendChild(monthHeader);

        // Create table for the calendar days
        const table = document.createElement('table');
        const headerRow = document.createElement('tr');
        const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        daysOfWeek.forEach(day => {
            const th = document.createElement('th');
            th.textContent = day;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        // Determine first day of the month and the number of days in the month
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        let currentDate = 1;
        let row = document.createElement('tr');

        // Loop through each day of the month and create the table rows
        for (let i = 0; i < 42; i++) { // 42 cells (6 rows of 7 days)
            if (i >= firstDay && currentDate <= daysInMonth) {
                const td = document.createElement('td');
                td.textContent = currentDate;
                
                // Highlight the dates for each bin collection
                binData.forEach(bin => {
                    let collectionDate = new Date(bin.date);
                    collectionDate.setDate(collectionDate.getDate() + bin.repeat * (Math.floor((currentDate - bin.date.getDate()) / bin.repeat)));

                    if (currentDate === collectionDate.getDate() && month === collectionDate.getMonth() && year === collectionDate.getFullYear()) {
                        td.classList.add(bin.color);
                    }
                });

                row.appendChild(td);
                currentDate++;
            } else {
                row.appendChild(document.createElement('td'));  // Empty cell
            }

            if (i % 7 === 6) { // End of the week
                table.appendChild(row);
                row = document.createElement('tr');
            }
        }

        calendarContainer.appendChild(table);
    }
}
