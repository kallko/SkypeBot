const report = require("./reportDayActivity");


class TimeOuts {

static initTimeouts(access_token, firstCall) {
    let  timeotFriday, timeotToLastDay, timeotToMiddleDay;
    let currentTime = new Date();

    let dayOfWeek = currentTime.getDay();
    let dayOfMonth = currentTime.getDate();
    let year = currentTime.getFullYear();
    let month = currentTime.getMonth();

    let lastDay = this.getLastDayOfMonth(year, month);
    let toFriday = dayOfWeek > 5 ?  12 - dayOfWeek : 5 - dayOfWeek;
    let toLastDayOfMonth = lastDay - dayOfMonth;
    let toMiddleOfMonth = dayOfMonth > 15 ? 15 + toLastDayOfMonth : 15 - dayOfMonth;



    if (firstCall && toFriday === 0 || toLastDayOfMonth === 0 || toMiddleOfMonth === 0  ) {
        report.start("1");
    }

    if (toFriday !== 0 && !timeotFriday) {
        console.log("Create Friday Report Timeout");
        let dateToStart = new Date(year, month, dayOfMonth + toFriday, 13).getTime();
        let toStart = dateToStart - currentTime;
        //console.log("toFriday", toStart);
        timeotFriday = setTimeout(function () {
            report.start("2");
            timeotFriday = null;
            TimeOuts.initTimeouts(access_token, false);
        }, toStart);

    }

    if (toLastDayOfMonth !== 0 && !timeotToLastDay && toFriday !== toLastDayOfMonth && !this.isWeekend(dayOfMonth + toLastDayOfMonth, month, year)) {
        let dateToStart = new Date(year, month, dayOfMonth + toLastDayOfMonth, 13).getTime();
        let toStart = dateToStart - currentTime;
        if (toStart < 2147483647) {
            timeotToLastDay = setTimeout(function () {
                report.start("3");
                timeotToLastDay = null;
                TimeOuts.initTimeouts(access_token, false);
            }, toStart);
        } else {
            console.log ("Its too long time to last Day");
        }

    }

    if (toMiddleOfMonth !== 0 && !timeotToMiddleDay && toFriday !== toMiddleOfMonth && !this.isWeekend(dayOfMonth + toMiddleOfMonth, month, year)) {

        let dateToStart = new Date(year, month, dayOfMonth + toMiddleOfMonth, 13).getTime();

        let toStart = dateToStart - currentTime;
        if (toStart < 2147483647) {
            timeotToMiddleDay = setTimeout(function () {
                report.start("4");
                timeotToMiddleDay = null;
                TimeOuts.initTimeouts(access_token, false);
            }, toStart);
        } else {
            console.log ("Its too long time to middle Day");

        }

    }

    //todo remove it
    //report.start(access_token, "5");

    return "";

    //return "To Friday " + toFriday + " days. To last day of month " + toLastDayOfMonth + " days. To next middle of month " + toMiddleOfMonth + " days." ;

}


static getLastDayOfMonth(year, month) {
    let date = new Date(year, month + 1, 0);
    return date.getDate();
}

static isWeekend (day, month, year){
    let date = new Date(year, month, day, 0);
    return date.getDay() > 5
}

}
module.exports = TimeOuts;