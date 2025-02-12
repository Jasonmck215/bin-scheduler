document.addEventListener('DOMContentLoaded', function () {
    const generateButton = document.getElementById('generateButton');
    const startDateInput = document.getElementById('startDate');
    const repeatDaysInput = document.getElementById('repeatDays');
    const calendarContainer = document.getElementById('calendar');
    const scheduleList = document.getElementById('scheduleList'); // This is hidden

    let collectionDates = [];

    generateButton.addEventListener('click', function () {
        const startDate = new Date(startDateInput.value);
        const repeatDays = parseInt(repeatDaysInput.value);

        if (startDate && repeatDays) {
            collectionDates = generateCollectionDates(startDate, repeatDays);
            generateCalendar();
        }
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
                if (isCollectionDate(currentDate)) {
                    td.classList.add('green');
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

    function isCollectionDate(date) {
        // Check if the date is one of the collection dates
        return collectionDates.some(collectionDate =>
            collectionDate.getDate() === date.getDate() &&
            collectionDate.getMonth() === date.getMonth() &&
            collectionDate.getFullYear() === date.getFullYear());
    }
});
