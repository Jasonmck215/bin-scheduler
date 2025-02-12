// Sort dates by date
allDates.sort((a, b) => new Date(a.date.split('/').reverse().join('-')) - new Date(b.date.split('/').reverse().join('-')));

        return allDates;
        const groupedDates = allDates.reduce((acc, { date, bin }) => {
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(bin);
            return acc;
        }, {});

        // Convert groupedDates to the desired format
        const sortedDates = Object.keys(groupedDates).sort((a, b) => new Date(a.split('/').reverse().join('-')) - new Date(b.split('/').reverse().join('-')));
        const result = sortedDates.reduce((acc, date) => {
            acc[date] = groupedDates[date].join(', ');
            return acc;
        }, {});

        return result;
}

function formatDate(date) {
