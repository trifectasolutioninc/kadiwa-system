// const handleScan = async (result) => {
//     // Handle the scanned QR code result here
//     console.log('Scanned QR Code:', result);
  
//     // Fetch the user's points from Firebase based on the contact number
//     const userDatabaseRef = ref(firebaseDB, `kadiwa_users_account/${kdwconnect}`);
//     try {
//       const userSnapshot = await get(userDatabaseRef);
//       const userData = userSnapshot.val();
  
//       // Check if the scanned points are greater than the user's points
//       const scannedPoints = parseFloat(result);
//       if (scannedPoints > userData.points) {
//         // Display a warning message in the QR modal
//         setKadiwaPtsToDisplay(0); // Reset displayed points
//         setShowQRCodeScanner(false); // Close the scanner modal
//         setShowWarningModal(true);
//         return;
//       }
  
//       // Check if the scanned points are enough for the purchase (10% of calculateTotal)
//       const calculateTotalValue = parseFloat(calculateTotal());
//       const requiredPoints = calculateTotalValue * 0.1;
//       if (scannedPoints < requiredPoints) {
//         // Display a warning message in the QR modal
//         setKadiwaPtsToDisplay(0); // Reset displayed points
//         setShowQRCodeScanner(false); // Close the scanner modal
//         setShowWarningModal(true, "Sorry, Not enough points");
//         return;
//       }
  
//       // Update the displayed Kadiwa Points
//       setKadiwaPtsToDisplay(scannedPoints);
  
//       // You may want to perform any specific actions based on the scanned result
  
//     } catch (error) {
//       console.error('Error fetching user data:', error);
//       // Handle error fetching user data
//     }
  
//     setShowQRCodeScanner(false); // Close the scanner modal after a successful scan
//   };