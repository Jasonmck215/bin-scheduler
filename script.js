document.addEventListener('DOMContentLoaded', function () {
    const generateButton = document.getElementById('generateButton');
    const downloadButton = document.getElementById('downloadButton');
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

    downloadButton.addEventListener('click', function () {
        generateJSONFile();
    });

    function generateCollectionDates(startDate, repeatDays) {
        const dates = [];
        let collectionDate = new Date(startDate);

        // Keep adding collection dates for 12 months
        while (collectionDate.getFullYear() === startDate.getFullYear() || 
               collectionDate.getFullYear() === startDate.getFullYear() + 1) {
            dates.push(new Date(collectionDate));
            collectionDate.setDate(collectionDate.getDate() + repeatDays);

            // Stop if we've moved more than 12 months ahead
            if (collectionDate > new Date(startDate.getFullYear() + 1, startDate.getMonth(), startDate.getDate())) {
                break;
            }
        }
        return dates;
    }

    function generateCalendar() {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        calendarContainer.innerHTML = '';

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

        while (currentDay <= lastDayOfMonth.getDate()) {
            const row = document.createElement('tr');
            for (let i = 0; i < dayOfWeek; i++) row.appendChild(document.createElement('td'));
            
            while (dayOfWeek < 7 && currentDay <= lastDayOfMonth.getDate()) {
                const td = document.createElement('td');
                td.textContent = currentDay;
                const currentDate = new Date(year, month, currentDay);
                const binClasses = getBinClasses(currentDate);
                if (binClasses.length > 0) {
                    const percentage = 100 / binClasses.length;
                    const gradient = `linear-gradient(to right, ${binClasses.map((color, index) => `${color} ${index * percentage}% ${(index + 1) * percentage}%`).join(', ')})`;
                    td.style.background = gradient;
                }
                row.appendChild(td);
                currentDay++;
                dayOfWeek++;
            }
            calendarTable.appendChild(row);
            dayOfWeek = 0;
        }

        monthContainer.appendChild(calendarTable);
        return monthContainer;
    }

    function getBinClasses(date) {
        return Object.keys(collectionDates).filter(color => isCollectionDate(date, collectionDates[color]));
    }

    function isCollectionDate(date, collectionDates) {
        return collectionDates.some(collectionDate =>
            collectionDate.getDate() === date.getDate() &&
            collectionDate.getMonth() === date.getMonth() &&
            collectionDate.getFullYear() === date.getFullYear()
        );
    }

    function generateJSONFile() {
        const binCollection = {};

        for (const color in collectionDates) {
            collectionDates[color].forEach(date => {
                const formattedDate = date.toLocaleDateString('en-GB');
                if (!binCollection[formattedDate]) binCollection[formattedDate] = new Set();
                binCollection[formattedDate].add(color);
            });
        }

        const formattedCollection = Object.fromEntries(
            Object.entries(binCollection).map(([date, bins]) => [date, [...bins].join(', ')])
        );

        const jsonContent = JSON.stringify(formattedCollection, null, 4);
        console.log(jsonContent);
    }
});
