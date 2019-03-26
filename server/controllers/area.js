exports.about = function (req,res) {
    var area = {
        area : {
            current_time : Date.now() ,
            services: [{
                name : " google " ,
                    actions : [{
                        name : " new_message_inbox " ,
                        description : " A new private message is received by the user "
                    }] ,
                    reactions : [{
                        name : "send_mail " ,
                        description : " The user likes a message "
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
                    },{
                        name :  "msg_posted" ,
                        description : "Someone post a spotify link on slack"
                        }] ,
                    reactions: [{
                        name : "post_message" ,
                        description : "Post a message on slack"
                        }]
                    },{
                name : "spotify" ,
                    reactions: [{
                        name : "createplaylist" ,
                        description : "Create a playlist on Spotify account"
                    },{
                        name : "savesong" ,
                        description : "Save song to your Spotify Library"
                        }]
                    },{
                name : "time" ,
                    actions : [{
                        name :  "repetitivejob" ,
                        description : "Every X time launch trigger"
                    },{
                        name :  "oncejob" ,
                        description : "If date is X launch trigger"
                        }]
                    }]
                }
            }
        res.send(area);
}
