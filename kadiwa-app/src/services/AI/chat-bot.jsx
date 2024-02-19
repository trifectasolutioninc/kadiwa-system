const ChatBOT = {
    chat1 : {
        id: "chat1",
        keywords : [
            "hello", "hi", "watsup", "good day"
        ] ,
        sender:"bot",
        message: "Hello Good Day!"
    },
    chat2 : {
        id: "chat2",
        keywords : [
            "help", "assit"
        ] ,
        sender:"bot",
        message: "You want my help?  Reply Yes or No. "
    },
    chat3 : {
        id: "chat3",
        keywords : [
            "yes", 
        ] ,
        sender:"bot",
        message: "How can I help you? 1. How to buy? 2. Report"
    },
    chat4 : {
        id: "chat4",
        keywords : [
            "no", 
        ] ,
        sender:"bot",
        message: "Okay, thank you. Just ask chat us if you want help next time."
    },

};

export { ChatBOT };