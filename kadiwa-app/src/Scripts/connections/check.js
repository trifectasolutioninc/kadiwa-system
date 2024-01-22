// sessionUtils.js
const redirectToIndexIfNoConnect = () => {
    const kdwconnect = sessionStorage.getItem('kdwconnect');
    
    if (kdwconnect === null || kdwconnect === '') {
      // Redirect to the index page
      window.location.href = '/'; // Adjust the path accordingly
      return false; // Indicate that the redirection is performed
    } else {
      // Use the username as needed in your dashboard page
      console.log('userID: ' + kdwconnect);
      return true; // Indicate that the contact is valid
    }
  };
  
  export default redirectToIndexIfNoConnect;
  