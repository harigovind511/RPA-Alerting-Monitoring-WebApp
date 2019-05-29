function keypressed(event) {
    if (event.which == 13 || event.keyCode == 13) {
        startChat();
    }
    return true;
};

export function startChat() {
  var connected = false;
  var botConnection = new BotChat.DirectLine({
      secret: "nP8SpPT2vjE.cwA.Pec.lvSfqApPQm-VXy_wROILSCrV4yDWw_Cd5uE0iNNwKmM"                    
  });

  var user = null;
  var bot = null;

    var mask = document.getElementById("mask");
    mask.className = "mask off";
    var chat = document.getElementById("chatContainer");
    chat.className = "on";

    var txtUserName = document.getElementById("txtUserName");
    var userName = txtUserName.value;

    var params = BotChat.queryParams(location.search);

    user = {
        id: params['userid'] || userName,
        name: params["username"] || userName
    };

    bot = {
        id: params['botid'] || 'botid',
        name: params["botname"] || 'botname'
    };

    BotChat.App({
        botConnection: botConnection,
        user: user,
        bot: bot
    }, document.getElementById("BotChatGoesHere"));

    //botConnection
    //    .postActivity({ type: "event", value: "Welcome", from: user, name: "Welcome" })
    //    .subscribe(id => console.log("success"));

    //botConnection
    //    .postActivity({ type: "conversationUpdate", "membersAdded": [ user ], from: user})
    //    .subscribe(id => console.log("success"));

    botConnection
        .postActivity({ type: "ping", from: user})
        .subscribe(id => console.log("success"));
}

export function connect() {
    var name;
    if (!connected)
        name = "agent";
    else
        name = "disconnect";
    botConnection
        .postActivity({ type: "event", from: user, name: name })
        .subscribe(id => {
            if (id === "retry")
                return;
            console.log("success");
            connected = !connected;
            if (connected) {
                document.getElementById("connect").innerHTML = "Disconnect";
                document.getElementById("heading").innerHTML =
                    "You are now connected to an agent.";
            } else {
                document.getElementById("connect").innerHTML = "Connect with Agent";
                document.getElementById("heading").innerHTML =
                    "To chat with an agent, click on Connect button.";
            }
        });
};

export function stopConversation(){
    botConnection
        .postActivity({ type: "event", value: "", from: user, name: "stopConversation" })
        .subscribe(id => console.log("success"));
};