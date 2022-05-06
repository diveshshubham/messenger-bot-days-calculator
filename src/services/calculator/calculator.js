const moment = require('moment')
module.exports = {
    dayCalculator: (userDate) => {
        // This is the birthdate we're checking, in ISO 8601 format
        const birthdate = userDate;

        // Get today's date in ISO 8601 format
        const today = moment().format('YYYY-MM-DD');

        // Calculate current age of person in years (moment truncates by default)
        const years = moment().diff(birthdate, 'years');

        // Special case if birthday is today; we do NOT need an extra year added
        const adjustToday = birthdate.substring(5) === today.substring(5) ? 0 : 1;

        // Add age plus one year (unless birthday is today) to get next birthday
        const nextBirthday = moment(birthdate).add(years + adjustToday, 'years');

        // Final calculation in days
        const daysUntilBirthday = nextBirthday.diff(today, 'days');

        return daysUntilBirthday
    }
}
