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
        const currentDate = new Date(startDate);

        while (currentDate <= new Date(startDate.getFullYear() + 1, startDate.getMonth(), startDate.getDate())) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + repeatDays);
        }

        return dates;
    }

    function generateBinData() {
        const binData = {};

        for (const [color, dates] of Object.entries(collectionDates)) {
            dates.forEach(date => {
                const dateString = date.toISOString().split('T')[0];
                if (!binData[dateString]) {
                    binData[dateString] = new Set();
                }
                binData[dateString].add(color);
            });
        }

        const sortedBinData = Object.entries(binData)
            .map(([date, bins]) => ({
                date,
                bins: [...bins].join(', ')
            }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        return sortedBinData;
    }

    function sendBinDataToJsonBin(binData) {
        const apiKey = 'YOUR_JSONBIN_API_KEY';
        const binId = 'YOUR_BIN_ID';

        fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': apiKey
            },
            body: JSON.stringify(binData)
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
});
