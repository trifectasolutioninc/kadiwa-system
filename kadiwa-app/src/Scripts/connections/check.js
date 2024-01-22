// sessionUtils.js
const redirectToIndexIfNoContact = () => {
    const contact = sessionStorage.getItem('contact');
    
    if (contact === null || contact === '') {
      // Redirect to the index page
      window.location.href = '/'; // Adjust the path accordingly
      return false; // Indicate that the redirection is performed
    } else {
      // Use the username as needed in your dashboard page
      console.log('userID: ' + contact);
      return true; // Indicate that the contact is valid
    }
  };
  
  export default redirectToIndexIfNoContact;
  