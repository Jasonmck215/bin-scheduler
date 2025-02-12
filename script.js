document.addEventListener('DOMContentLoaded', function () {
    const generateButton = document.getElementById('generateButton');
    const greenStartDateInput = document.getElementById('greenStartDate');
    const greenRepeatDaysInput = document.getElementById('greenRepeatDays');
    const blueStartDateInput = document.getElementById('blueStartDate');
    const blueRepeatDaysInput = document.getElementById('blueRepeatDays');
    const purpleStartDateInput = document.getElementById('purpleStartDate');
    const purpleRepeatDaysInput = document.getElementById('purpleRepeatDays');
    const brownStartDateInput = document.getElementById('brownStartDate');
    const brownRepeatDaysInput = document.getElementById('brownRepeatDays');
    const greyStartDateInput = document.getElementById('greyStartDate');
    const greyRepeatDaysInput = document.getElementById('greyRepeatDays');
    const calendarContainer = document.getElementById('calendar');

    let collectionDates = {
        green: [],
        blue: [],
        purple: [],
        brown: [],
        grey: []
    };

    generateButton.addEventListener('click', function () {
        // Green Bin
        const greenStartDate = new Date(greenStartDateInput.value);
        const greenRepeatDays = parseInt(greenRepeatDaysInput.value);

        // Blue Bin
        const blueStartDate = new Date(blueStartDateInput.value);
        const blueRepeatDays = parseInt(blueRepeatDaysInput.value);

        // Purple Bin
        const purpleStartDate = new Date(purpleStartDateInput.value);
        const purpleRepeatDays = parseInt(purpleRepeatDaysInput.value);

        // Brown Bin
        const brownStartDate = new Date(brownStartDateInput.value);
        const brownRepeatDays = parseInt(brownRepeatDaysInput.value);

        // Grey Bin
        const greyStartDate = new Date(greyStartDateInput.value);
        const greyRepeatDays = parseInt(greyRepeatDaysInput.value);

        // Generate collection dates for all bins
        collectionDates.green = generateCollectionDates(greenStartDate, greenRepeatDays);
        collectionDates.blue = generateCollectionDates(blueStartDate, blueRepeatDays);
        collectionDates.purple = generateCollectionDates(purpleStartDate, purpleRepeatDays);
        collectionDates.brown = generateCollectionDates(brownStartDate, brownRepeatDays);
        collectionDates.grey = generateCollectionDates(greyStartDate, greyRepeatDays);

        generateCalendar();

        // Convert collectionDates to formatted JSON grouped by date
        const formattedCollectionDates = formatCollectionDatesByDate(collectionDates);
        const jsonData = JSON.stringify(formattedCollectionDates);
        console.log(jsonData); // For debugging purposes

        // Send JSON data to JSONbin.io
        sendJsonToJsonbin(jsonData);
    });

    function generateCollectionDates(startDate, repeatDays) {
        const dates = [];
        const numOfMonths = 12; // Generate dates for the next 12 months
        for (let i = 0; i < numOfMonths; i++) {
            const collectionDate = new Date(startDate);
            collectionDate.setDate(startDate.getDate() + (i * repeatDays));  // Add repeating days

            // Add each repeated date within this year
            while (collectionDate.getFullYear() === startDate.getFullYear()) {
                dates.push(new Date(collectionDate));
                collectionDate.setDate(collectionDate.getDate() + repeatDays); // Add repeat interval
            }
        }
        return dates;
    }

    function formatCollectionDatesByDate(collectionDates) {
        const dateBins = {};

        for (const binColor in collectionDates) {
            collectionDates[binColor].forEach(date => {
                const formattedDate = formatDate(date);
                if (!dateBins[formattedDate]) {
                    dateBins[formattedDate] = [];
                }
                dateBins[formattedDate].push(binColor);
            });
        }

        return dateBins;
    }

    function formatDate(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function generateCalendar() {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        // Clear the previous calendar
        calendarContainer.innerHTML = '';

        // Generate 12 months starting from the current month
        for (let monthOffset = 0; monthOffset < 12; monthOffset++) {
            const monthDate = new Date(currentYear, currentMonth + monthOffset, 1);
            const monthCalendar = createMonthCalendar(monthDate);
            calendarContainer.appendChild(monthCalendar);
        }
    }

    function createMonthCalendar(monthDate) {
        const monthName = monthDate.toLocaleString('default', { month: 'long' });
        const year = monthDate.getFullYear();
        const month = monthDate.getMonth();

        const monthContainer = document.createElement('div');
        monthContainer.classList.add('month-container');

        const header = document.createElement('div');
        header.classList.add('month-header');
        header.textContent = `${monthName} ${year}`;
        monthContainer.appendChild(header);

        const calendarTable = document.createElement('table');
        const headerRow = document.createElement('tr');
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        // Create header row with days of the week
        daysOfWeek.forEach(day => {
            const th = document.createElement('th');
            th.textContent = day;
            headerRow.appendChild(th);
        });
        calendarTable.appendChild(headerRow);

        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);

        let dayOfWeek = firstDayOfMonth.getDay();
        let currentDay = 1;

        // Generate the calendar days
        while (currentDay <= lastDayOfMonth.getDate()) {
            const row = document.createElement('tr');

            // Fill empty spaces for days before the first day of the month
            for (let i = 0; i < dayOfWeek; i++) {
                const td = document.createElement('td');
                row.appendChild(td);
            }

            // Add the actual days of the month
            while (dayOfWeek < 7 && currentDay <= lastDayOfMonth.getDate()) {
                const td = document.createElement('td');
                td.textContent = currentDay;

                const currentDate = new Date(year, month, currentDay);

                // Get the bin collection classes for this date
                const binClasses = getBinClasses(currentDate);

                // Apply a split color if there are multiple bins
                if (binClasses.length > 0) {
                    const percentage = 100 / binClasses.length;
                    const gradient = `linear-gradient(to right, ${binClasses.map((color, index) => `${color} ${index * percentage}% ${(index + 1) * percentage}%`).join(', ')})`;
                    td.style.background = gradient;
                }

                row.appendChild(td);
                currentDay++;
                dayOfWeek++;
            }

            // Add the row to the table
            calendarTable.appendChild(row);
            dayOfWeek = 0; // Reset the day of the week for the next row
        }

        monthContainer.appendChild(calendarTable);
        return monthContainer;
    }

    function getBinClasses(date) {
        const binClasses = [];

        // Check each bin's collection dates
        if (isCollectionDate(date, collectionDates.green)) binClasses.push('green');
        if (isCollectionDate(date, collectionDates.blue)) binClasses.push('blue');
        if (isCollectionDate(date, collectionDates.purple)) binClasses.push('purple');
        if (isCollectionDate(date, collectionDates.brown)) binClasses.push('brown');
        if (isCollectionDate(date, collectionDates.grey)) binClasses.push('grey');

        return binClasses;
    }

    function isCollectionDate(date, collectionDates) {
        return collectionDates.some(collectionDate =>
            collectionDate.getDate() === date.getDate() &&
            collectionDate.getMonth() === date.getMonth() &&
            collectionDate.getFullYear() === date.getFullYear());
    }

    async function sendJsonToJsonbin(jsonData) {
        const apiKey = '$2a$10$am33dKwbEV2.NEe9c6OVmOjvbbASzTBAPvNjkA76aipnMW7HUHoea'; // Replace with your JSONbin API key
        const binId = '67acf1f7acd3cb34a8df62e3'; // Replace with your JSONbin bin ID
        const endpoint = `https://api.jsonbin.io/v3/b/${binId}`; // JSONbin endpoint URL for updating a bin

        try {
            const response = await fetch(endpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': apiKey
                },
                body: jsonData
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log('Data successfully sent to JSONbin.io:', responseData);
            } else {
                console.error('Failed to send data to JSONbin.io:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error sending data to JSONbin.io:', error);
        }
    }
});
