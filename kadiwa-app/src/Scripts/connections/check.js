// sessionUtils.js
const redirectToIndexIfNoConnect = () => {
    const uid = sessionStorage.getItem('uid');
    const sid = sessionStorage.getItem('sid');
    const log = sessionStorage.getItem('log');
    
    if (uid === null || uid === '') {
      // Redirect to the index page
      window.location.href = '/'; // Adjust the path accordingly
      return false; // Indicate that the redirection is performed
    } else {

      return true; // Indicate that the contact is valid
    }
  };
  
  export default redirectToIndexIfNoConnect;
  