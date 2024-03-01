
// CONSUMER ID GENERATOR

export function generateUniqueID() {
    var currentDate = new Date();
    var year = currentDate.getFullYear();
    var month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
    var day = ("0" + currentDate.getDate()).slice(-2);
    var hours = ("0" + currentDate.getHours()).slice(-2);
    var minutes = ("0" + currentDate.getMinutes()).slice(-2);
    var random4DigitNumber = (
        "000" + Math.floor(1000 + Math.random() * 9000)
    ).slice(-4);

    return `${year}-${month}${day}-${hours}${minutes}-${random4DigitNumber}`;
}
