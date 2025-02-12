document.addEventListener('DOMContentLoaded', function () {
    const generateButton = document.getElementById('generateButton');
    const updateButton = document.getElementById('updateButton');
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
        // Generate collection dates for all bins
        collectionDates.green = generateCollectionDates(new Date(greenStartDateInput.value), parseInt(greenRepeatDaysInput.value));
        collectionDates.blue = generateCollectionDates(new Date(blueStartDateInput.value), parseInt(blueRepeatDaysInput.value));
        collectionDates.purple = generateCollectionDates(new Date(purpleStartDateInput.value), parseInt(purpleRepeatDaysInput.value));
        collectionDates.brown = generateCollectionDates(new Date(brownStartDateInput.value), parseInt(brownRepeatDaysInput.value));
        collectionDates.grey = generateCollectionDates(new Date(greyStartDateInput.value), parseInt(greyRepeatDaysInput.value));

        generateCalendar();
    });

    updateButton.addEventListener('click', function () {
        console.log('Update button clicked');
        const binData = generateBinData();
        console.log('Generated bin data:', JSON.stringify(binData, null, 2));
        sendBinDataToJsonBin(binData);
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

    function generateBinData() {
        const binData = {};

        for (const [color, dates] of Object.entries(collectionDates)) {
            dates.forEach(date => {
                const dateString = date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
                if (!binData[dateString]) {
                    binData[dateString] = [];
                }
                binData[dateString].push(color);
            });
        }

        // Convert binData object to an array of objects and sort by date
        const sortedBinData = Object.entries(binData)
            .map(([date, bins]) => ({ date, bins: bins.join(', ') }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        return sortedBinData;
    }

    function sendBinDataToJsonBin(binData) {
        const apiKey = '$2a$10$am33dKwbEV2.NEe9c6OVmOjvbbASzTBAPvNjkA76aipnMW7HUHoea'; // Replace with your actual jsonbin.io API key
        const binId = '67acf1f7acd3cb34a8df62e3'; // Replace with your actual bin ID

        fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': apiKey
            },
            body: JSON.stringify(binData) // Ensure the data is correctly formatted
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Bin data updated successfully:', data);
            alert('Bin data updated successfully!');
        })
        .catch(error => {
            console.error('Error updating bin data:', error);
            alert('Error updating bin data. Check console for details.');
        });
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
});
