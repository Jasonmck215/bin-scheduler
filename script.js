document.getElementById('calculate').addEventListener('click', () => {
  const startDateInput = document.getElementById('start-date');
  const repeatIntervalSelect = document.getElementById('repeat-interval');
  const datesList = document.getElementById('dates-list');

  // Clear previous results
  datesList.innerHTML = '';

  // Get user inputs
  const startDate = new Date(startDateInput.value);
  const repeatInterval = parseInt(repeatIntervalSelect.value);

  if (isNaN(startDate.getTime())) {
    alert('Please select a valid start date.');
    return;
  }

  // Calculate and display the next 10 dates
  for (let i = 0; i < 10; i++) {
    const nextDate = new Date(startDate);
    nextDate.setDate(startDate.getDate() + i * repeatInterval);

    const listItem = document.createElement('li');
    listItem.textContent = nextDate.toLocaleDateString();
    datesList.appendChild(listItem);
  }
});
