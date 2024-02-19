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
    chat5 : {
        id: "chat5",
        keywords : [
            "kadiwa commodity", "kadiwa commodities"
        ] ,
        sender:"bot",
        message: `1. Rice \n 2. Corn \n 3.Fish \n 4. Live Stock and Poultry Poultry \n 5. Vegetables \n 6. Spices \n 7. Fruits \n 8. Other Basic Commodities.`
    },

};

export { ChatBOT };