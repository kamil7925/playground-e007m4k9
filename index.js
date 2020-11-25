const express = require('express');
var process = require('process');

const app = express();

const config = require('./config.json');

const au = require('autoit');

//Star Citizen
//[CLASS:Notepad]

//Default route
app.get('/', function (req, res) {
    res.setHeader('Content-Type', 'text/plain');

    res.send('UP');
});

//SC Route
app.get(config.SC_Url_Extension + "/:token", function (req, res) {
    res.setHeader('Content-Type', 'text/plain');

    var token = req.params.token;

    //console.log(token); //TO BE REMOVED FOR DEBUG

    //sleep(4.500); //TO BE REMOVED FOR DEBUG

    au.Init();

    au.WinGetHandle(config.SC_Window_Name);

    const start = process.hrtime();

    while (au.WinExists(config.SC_Window_Name) === 0) {
        if (process.hrtime(start)[0] < 30) {
            au.WinGetHandle(config.SC_Window_Name);
        }
        else {
            res.send(config.Status_Failed);
            return;
        }
    }

    if (token.indexOf('_') > -1) {
        if (token.substring(0, config.Hold_Key_Flag.length) === config.Hold_Key_Flag) {
            var words = token.split('_');

            au.Opt("SendKeyDownDelay", words[2]);
            au.Send("{" + words[1] + "}");
            au.Opt("SendKeyDownDelay", 5);
        }
        else if (token.substring(0, config.LAlt_Key_Flag.length) === config.LAlt_Key_Flag) {
            var words_2 = token.split('_');

            au.Send("{LALT}{" + words_2[1] + "}");//{" + words[1] + "}");
        }
    }
    else if (token.indexOf('_') === -1) {
        au.Send("{" + token + "}");
    }

    res.send(config.Status_Success);

    return;
});

function sleep(seconds) {
    var e = new Date().getTime() + seconds * 1000;
    while (new Date().getTime() <= e) { }
}

app.listen(3000, () => console.log('i-Fly API is listening on port 3000!'));
