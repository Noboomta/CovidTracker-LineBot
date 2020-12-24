const functions = require("firebase-functions")
const request = require("request-promise")
const requester = require("./covid_api_request")
const payload_generator = require("./payload_script")

exports.webhook = functions.https.onRequest(async (req, res) => {
    const lah = require("lineapihelper")
    lah.setrequest(req);
    lah.cat(functions.config().lineapi.cat);
    var input_text = lah.message().text;
    var out_text = ""
    var payload
    // Check if user input a Thailand overview command. 
    if (requester.overview_command(input_text)) {
        // V1 out_text = input_text + " cases in Thailand: " + await requester.today_api(input_text) + " Persons.";
        // V1 payload = requester.payload_in_text(out_text)
        payload = await payload_generator.flex_thailand(input_text)
    }

    // Check if user input a Thailand province name. 
    else if (requester.province(input_text)) {
        // V1 out_text = input_text + ", Thailand total cases: " + await requester.today_api2(input_text) + " Persons.";
        // V1 payload = requester.payload_in_text(out_text)
        payload = await payload_generator.flex_province(input_text)
    }

    // Check if user input a World overview command. 
    else if (requester.world_command(input_text)) {
        // out_text = input_text + ": " + await requester.world_api(input_text) + " cases.";
        // payload = requester.payload_in_text(out_text)
        payload = await payload_generator.flex_world(input_text)
    }

    // Check if user input a BOOM command.
    else if (input_text === "BOOM") {
        out_text = "God Boom, Welcome Sir!! Have a nice day.";
        payload = payload_generator.payload_in_text(out_text)
    }

    // Check if user input a Contact command and return the contact payload.
    else if (input_text === "Contact") {
        out_text = "Contact FB: Puvana Swatvanith";
        payload = payload_generator.payload_in_text(out_text)
    }

    // Check if user input a Collaborator command.
    else if (input_text === "Collaborator") {
        // V1 out_text = "Collaborator:" + "\n" + "lisbono2001" + "\n" + "Noboomta" + "\n" + "Bhatara007" + "\n" + "toey10112";
        payload = payload_generator.payload_collaborator();
    }

    // Check if user input Help or help command.
    else if (input_text === "help" || input_text === "Help") {
        payload = payload_generator.payload_help()
    }

    // else if (input_text === "Thailand"){
    //     payload = payload_generator.thailand_review()
    //     console.log(payload)
    // }

    else {
        out_text = "No command, try 'help' or 'Help' for more guide." ;
        payload = payload_generator.payload_in_text(out_text)
    }
    
    const SplitCommand = input_text.split(",")
    if (SplitCommand[0] === "login"){
        console.log("Test")
        payload_generator.accessSpreadsheet(SplitCommand[1], lah.userId)
        payload = payload_generator.payload_in_text("Welcome " + SplitCommand[1] + "!! Logged in!")
    }

    // reply payload.
    return lah.reply(lah.replyToken(), payload)

    .then((response) => {
        // console.log(response)
        return res.status(200).send();
    }).catch((e) => {
        // console.log(e)
        return res.status(500).send();
    })
})

