function getChallenges(){
    var session = fromCookie("session");
    if (session === null || session === undefined || session==="undefined") {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                //TODO if response received (Success)
                console.log(this.responseText);
                object = JSON.parse(this.responseText);
                var object;
                var tHS = object.treasureHunts;
                var challengesList = document.getElementById("Challenges");
                var challengesForm = document.getElementById("challengesForm");
                for (var i = 0; i < tHS.length; i++) {
                    challengesList.innerHTML += '<li><input type="radio" name="treasure-hunt-id" ' +
                        'value=' + tHS[i].uuid + '>' + tHS[i].name + '</li><br>';
                }
                challengesForm.innerHTML += '<input type="submit" value="Submit">';
            }
        };
        xhttp.open("GET", "https://codecyprus.org/th/api/list", true);
        xhttp.send();
    }else {
        window.location.href = "Questions.html";
    }
}

function getFromURL(param) {
    let url = new URL(window.location.href);
    return url.searchParams.get(param);
}

function question(){
    var session = fromCookie("session");
    if (session === null || session === undefined || session==="undefined") {
        console.log("no session in cookie");
        var player = getFromURL("player");
        var thID = getFromURL("treasure-hunt-id");
        console.log(player);

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                let obj = JSON.parse(this.responseText);
                console.log(obj);
                session = obj.session;
                let time = new Date(Date.now()+1200000);
                document.cookie = "session" + "=" + session + ";" + "expires=" + time.toUTCString();
                loadQuestion();
            }
        };
        xhttp.open("GET", "https://codecyprus.org/th/api/start?player=" + player + "&app=Simpsons&treasure-hunt-id=" + thID, true);
        xhttp.send();
    } else {
        console.log("session "+session);
        loadQuestion();
    }
}
function info(){
    alert("Our team consists of Andreas Kesidis,Giannis Toumazou,Nicole Demetriou - view my homepage at http://akesidis.github.io!!!"+" "+"Andreas Kesidis @ http://akesidis.github.io");

}
function loadQuestion() {
    score();
    var qReq = new XMLHttpRequest();
    qReq.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let qObj = JSON.parse(this.responseText);
            console.log(qObj);
            if (!qObj.completed) {
                document.getElementById("question").innerHTML = qObj.questionText;
                var answer = document.getElementById("answer");
                var qAns = '<form id=answerForm action="Answer.html">';
                if (qObj.questionType === "INTEGER" || qObj.questionType === "NUMERIC") {
                    qAns +=
                        '<input type="number" name="answer">';
                } else if (qObj.questionType === "MCQ") {
                    qAns +=
                        '<input type="radio" name="answer" value="a">A' +
                        '<input type="radio" name="answer" value="b">B' +
                        '<input type="radio" name="answer" value="c">C' +
                        '<input type="radio" name="answer" value="d">D' ;
                } else if (qObj.questionType === "BOOLEAN") {
                    qAns +=
                        '<input type="radio" name="answer" value="true"> True' +
                        '<input type="radio" name="answer" value="false"> False';
                } else if (qObj.questionType === "TEXT") {
                    qAns +=
                        '<input type="text" name="answer" placeholder="answer">' ;
                }
                qAns +=
                    '<br><br><input type="submit">' +
                    '</form>';
                if (qObj.canBeSkipped) {
                    qAns += '<br><input type="button" value="Skip" onclick="skip()"> ';
                }
                answer.innerHTML = qAns;
            }else {
                window.location.href = "Leaderboard.html";
            }
        }
    };
    qReq.open("GET", "https://codecyprus.org/th/api/question?session=" + fromCookie("session"), true);
    qReq.send();
}

function skip() {
    var sReq = new XMLHttpRequest();
    sReq.onreadystatechange = function (){
        if (this.readyState === 4 && this.status === 200) {
       if(confirm("Are you sure you want to skip this question?" +
              "" +
             "This will result to loss of points!")){
            loadQuestion();
       }
       else{}
        }
    };
    sReq.open("GET","https://codecyprus.org/th/api/skip?session="+fromCookie("session"));
    sReq.send();
}

function answer() {
    var answer = getFromURL("answer");
    console.log(answer);
    var aHTTP = new XMLHttpRequest();
    aHTTP.onreadystatechange = function(){
        if (this.readyState === 4 && this.status === 200) {
            var aObj = JSON.parse(this.responseText);
            console.log(aObj);
            var result = document.getElementById("result");
            if (aObj.correct) {
                result.innerHTML = 'Correct<br>';
            }else {
                result.innerHTML = 'Incorrect<br>'
            }
            result.innerHTML += '<form action="Questions.html"> ' +
                '<input type="submit"/>'+
                '</form>';
        }
    };
    aHTTP.open("GET", "https://codecyprus.org/th/api/answer?session="+fromCookie("session")+"&answer=" + answer, true);
    aHTTP.send();
}

function deleteCookie() {
    let expir = new Date(Date.now() - 10000);
    let keyValue = document.cookie.split(";");
    for (let i = 0; i < keyValue.length; i++) {
        let key = keyValue[i].split("=")[0].trim();
        document.cookie = key + "=; " + "expires=" + expir.toUTCString() + ";";
    }
}

function fromCookie(property) {
    let keyValue = document.cookie.split(";");
    for (let i = 0; i < keyValue.length; i++) {
        let key = keyValue[i].split("=")[0].trim();
        let val = keyValue[i].split("=")[1];
        if (property===key) return val;
    }
}
function isTest() {
    let url = new URL(window.location.href);
    return url.searchParams.get("test") != null;
}
function leaderBoard() {
    var lReq = new XMLHttpRequest();
    let url;
    if(isTest())
    {
        url = "https://codecyprus.org/th/test-api/";
    }else {
        url = "https://codecyprus.org/th/api/";
    }
    lReq.onreadystatechange = function(){
        if (this.readyState === 4 && this.status === 200) {
            var obj = JSON.parse(this.responseText);
            console.log(obj);
            var leadList = document.getElementById("leaderList");
            var leadArray = obj.leaderboard;
            let options = { day: 'numeric', month: 'short', hour: '2-digit',minute: '2-digit', second: '2-digit' };
            for (let i=0;i<leadArray.length;i++){
                let date = new Date(leadArray[i].completionTime);
                let formattedDate = date.toLocaleDateString("en-UK", options);
                leadList.innerHTML += '<li>'+ leadArray[i].player + " " + leadArray[i].score + " " + formattedDate+"</li>";
            }
        }
    };
    console.log(fromCookie("session"));
    lReq.open("GET", url+"leaderboard?session=" + fromCookie("session") + "&limit=20&sorted", true);
    lReq.send();
}

function score() {
    var session = fromCookie("session");
    if (session !== null || session !== undefined || session !=="undefined") {
        var scReq = new XMLHttpRequest();
        scReq.onreadystatechange = function(){
            if (this.readyState === 4 && this.status === 200) {
                var scObj = JSON.parse(this.responseText);
                var score = document.getElementById("score");
                score.innerHTML = "Score: "+scObj.score;
            }
        };
        scReq.open("GET", "https://codecyprus.org/th/api/score?session=" + fromCookie("session"), true);
        scReq.send();
    }
}

//Get the location from the client.
function getLocation() {
    navigator.geolocation.getCurrentPosition(showPosition);
    function showPosition(position) {
        console.log("latitude: " + position.coords.latitude); //To check if the location is get by the server
        console.log("longitude: " + position.coords.longitude);
        sendLocation(position.coords.latitude, position.coords.longitude);
    }
}

//Send the location to the server.
function sendLocation(latitude,longitude) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            //TODO If response received (success).
            console.log("location received!");
        }
        else {
            //TODO If response not received (error).
        }
    };
    xhttp.open("GET", "https://codecyprus.org/th/api/location?" +
        "session=" + fromCookie("session") + "&latitude=" + latitude + "&longitude=" + longitude, true);
    xhttp.send();
}
getLocation();

