exports.about = function (req,res) {
    var resp = {
        client : {
            host: req.connection.remoteAddress
        },
        server : {
            current_time : Date.now() ,
            services: [{
                name : " google " ,
                    actions : [{
                        name : " new_message_inbox " ,
                        description : " A mail is received by the user "
                    }] ,
                    reactions : [{
                        name : "send_mail " ,
                        description : " Sends a mail"
                    },{
                        name: "upload_file" ,
                        description: "Upload a file to user's drive"
                        }]
                    },{
                name : "slack" ,
                    actions : [{
                        name :  "reaction_added_to_message" ,
                        description : "Someone react to the user message"
                    },{
                        name :  "file_uploaded" ,
                        description : "Someone uploaded a file on slack"
                        }] ,
                    reactions: [{
                        name : "post_message" ,
                        description : "Post a message on slack"
                        }]
                    },{
                name : "time" ,
                    actions : [{
                        name :  "date is X day" ,
                        description : "Today is X day"
                    },{
                        name :  "every X time" ,
                        description : "Every X minute / sec / day"
                        }]
                    },{
                name : "spotify" ,
                    reactions : [{
                        name :  "createplaylist" ,
                        description : "Create a X named playlist on spotify"
                    }]
                }]
            }
        }
    res.send(resp);
}
