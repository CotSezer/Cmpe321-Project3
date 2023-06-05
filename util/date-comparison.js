async function compareDates(date1, date2) {
    // Extract day, month, and year from date1
    const [month1, day1, year1] = date1.split('/');
    const parsedDate1 = new Date(`${year1}-${month1}-${day1}`);

    // Extract day, month, and year from date2
    const [month2, day2, year2] = date2.split('/');
    const parsedDate2 = new Date(`${year2}-${month2}-${day2}`);

    if (parsedDate1 < parsedDate2) {
        return -1; // date1 is earlier
    } else if (parsedDate1 > parsedDate2) {
        return 1; // date1 is later
    } else {
        return 0; // dates are equal
    }
}

module.exports = compareDates;
