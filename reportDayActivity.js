const mysql = require('mysql');

const SendMessage = require("./sendMessage");

const Timeouts = require("./timeOuts");

let redmineTimeout;

const testStaff = ["Петров", "Иванов", "Сидоров"];

class ReportDayActivity {
    static start(access_token, text) {
            console.log("START # ", text, access_token);
            this.remindRedmain(access_token);

    }


    static remindRedmain(access_token) {
        if (access_token) {

            const connection = mysql.createConnection(
                {
                    host: '***.***.*.**',
                    user: 'redmine',
                    password: '********',
                    database: '*******',
                }
            );

            connection.connect(function (err) {
                //todo clear comments
                console.log("Connection ERROR", err);
            });


            let userIds = '';
            let queryString = 'select id, firstname, lastname  from users u ' +
                'where exists (select * from custom_values cv where cv.customized_id=u.id AND cv.customized_type="Principal"  and  cv.value="CeboTeam")';
            connection.query(queryString, function (err, rows, fields) {


                //todo clear comments
                //if (err) throw err;
                if (err) {
                    console.log("Not connected");
                    let s = "";
                    for (i = 0; i < testStaff.length; i++){
                        s += testStaff[i] + "<br/>\n";
                    }

                    ReportDayActivity.initNextTimeout()
                } else {
                    for (var i in rows) {
                        userIds += rows[i].id + ',';
                    }
                    console.log(userIds);
                    //let queryString = 'select firstname, lastname  from users u ' +
                    let queryString = 'select *  from users u ' +
                        'where u.id in (' + userIds + '49)' +
                        ' AND not exists (select * from time_entries te where te.user_id = u.id and (spent_on between NOW() - INTERVAL 2 DAY AND  NOW() ))';
                    //' AND not exists (select * from time_entries te where te.user_id = u.id )';
                    console.log(queryString);

                    connection.query(queryString, function (err, rows, fields) {
                        if (err) throw err;
                        let s = '';
                        for (var i in rows) {
                            //console.log("ROW ", rows[i]);
                            s += rows[i].firstname + ' ' + rows[i].lastname + ', заполни редмайн' + "<br/>\n";
                        }
                        if (s) {
                            console.log("ALERT ", s);
                            //botSession.send('Ребятки');
                            //botSession.send(s);
                            //todo clear comments
                            //SendMessage.send(access_token, s);
                            ReportDayActivity.initNextTimeout()


                        }
                    });
                }
                connection.end();



            });
        }
    }


    static initNextTimeout() {
        let nextTime = 2 * 60 * 60 * 1000;

        let currentTime = new Date();
        if (currentTime.getHours() >= 17) {
            nextTime = 30 * 60 * 1000
        }

        if (currentTime.getHours() >= 18) {
            nextTime = 15 * 60 * 1000
        }


        if (currentTime.getHours() >= 20) {
            let nextDayTimeout = setTimeout(Timeouts.initTimeouts(), 5 * 60 * 60 * 1000);
            return
        }

        redmineTimeout = setTimeout(this.remindRedmain, nextTime);
    }

}

module.exports = ReportDayActivity;