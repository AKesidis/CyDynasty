
function getChallenges(){
    var challengesList=document.getElementById("Challenges");

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange=function(){

        if(this.readyState===4 && this.status===200){
            //TODO if response received (Success)
            console.log(this.responseText);
             object = JSON.parse(this.responseText);
            console.log("STATUS===>"+object.status);


            var newITEM;
            var object;

            for(var i =0;i<object.treasureHunts.length;i++){

                newITEM = document.createElement("li");

                var linkItem=document.createElement("a");
                linkItem.innerHTML=object.treasureHunts[i].name;
                linkItem.href="https://codecyprus.org/th/api/start?player=Homer&app=Simpson&treasure-hunt-id=\" + object.treasureHunts[i].uuid;"
                newITEM.appendChild(linkItem);

                challengesList.appendChild(newITEM);
            }
        }
        else{
            //TODO if response not received(error)
        }
    };
    xhttp.open("GET","https://codecyprus.org/th/api/list",true);
    xhttp.send();
}



function info(){

    var F_PlayerName = document.getElementById("PlayerName").value;
    var F_Email = document.getElementById("Email").value;

    if (F_PlayerName==="" || F_Email==="")
    {
        alert("ERROR");
    }else {
         if(window.sessionStorage) {
             /*Go to questions*/
             F_PlayerName.value = sessionStorage.getItem("PlayerName");//get Form Elements
             F_Email.value = sessionStorage.getItem("Email");

             F_PlayerName.addEventListener("input", function () {
                 sessionStorage.setItem("PlayerName", F_PlayerName.value);
             }, false);
             F_Email.addEventListener("input", function () {
                 sessionStorage.setItem("Email", F_Email.value);
             }, false);
         }
        location.href="Questions.html";


    }

}



function start(){
    var xhttp=new XMLHttpRequest();
    xhttp.onreadystatechange=function(){
        if(this.readyState===4 && this.status===200){
            console.log(this.responseText);
            var object=JSON.parse(this.responseText);
            console.log("STATUS===>"+object.status);


        }
    }



}
