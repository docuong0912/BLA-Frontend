export function getWeekDates() {
    var today = new Date();
    var day = today.getDay(); // Get the current day (0-6, where 0 is Sunday)
    var monday = new Date(today); // Create a new date object
    monday.setDate(today.getDate() - day + (day === 0 ? -6 : 1)); // Calculate Monday of the current week

    var sunday = new Date(today); // Create a new date object
    sunday.setDate(monday.getDate() + 6); // Calculate Sunday of the current week

    return { monday, sunday }; // Return an object containing Monday and Sunday dates
}
export function getMonthName(date) {
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return months[date.getMonth()];
}