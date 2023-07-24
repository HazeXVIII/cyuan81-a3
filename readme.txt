GitHub Address: https://github.com/HazeXVIII/cyuan81-a3 

Fitness and Calorie Calculator

Description:
The Fitness and Calorie Calculator is a web application that allows users to calculate various health and fitness metrics, including Body Mass Index (BMI), Body Fat Percentage, Ideal Weight, and Calories Burned. The application provides an easy-to-use interface, where users can input their weight, height, age, gender, and activity level to receive personalized fitness and health recommendations.

Functionality:
Home: The home page welcomes users and introduces them to the Health and Calorie Calculator.
BMI Calculator: Users can calculate their BMI by entering their weight and height and clicking the "Submit" button. The calculated BMI is displayed on the screen.
Body Fat Calculator: Users can calculate their Body Fat Percentage by providing their weight, height, age, and gender (optional). The calculated body fat percentage is displayed on the screen.
Ideal Weight Calculator: Users can determine their Ideal Weight based on their height and gender. The calculated ideal weight is displayed on the screen.
Calories Deficit Calculator: Users can estimate the number of calories burned during physical activities by specifying the activity type, weight, and duration. The calculated calories burned are displayed on the screen.
Technologies Used:

HTML, CSS, Bootstrap: For building the user interface and styling the web page.
JavaScript, jQuery: For handling user input, making AJAX requests to the Node.js server, and updating the web page with calculated results.
Node.js, Express.js: For building the REST API to handle the BMI, Body Fat, Ideal Weight, and Calories Burned calculations.
JSON: For exchanging data between the front-end and back-end.

How to Use:
Clone the repository to your local machine.
Install Node.js if you haven't already.
Navigate to the project directory in your terminal.
Run npm install to install the required dependencies.
Start the Node.js server with npm start.
Open your web browser and access the application at http://localhost:3000.
Enter the required information in the respective forms.
Click the "Submit" button to perform the desired calculation.
View the results displayed on the web page.
Important Note:
This application runs locally on your machine and does not require an external API or database. It is meant for personal use and learning purposes. If you plan to deploy it in a production environment, consider implementing additional security measures and validation checks.

Contributions:
Contributions to this project are welcome! If you find any issues or have suggestions for improvements, feel free to submit a pull request or open an issue.

License:
This project is licensed under the MIT License.

Credits:

Created by Christopher Yuan
Thank you for using the Fitness and Calorie Calculator! If you have any questions or feedback, please don't hesitate to contact us at cyuan81@uw.edu. We hope this tool helps you on your fitness journey!

Body fat calculations based off of: https://www.gaiam.com/blogs/discover/how-to-calculate-your-ideal-body-fat-percentage
Ideal weight calculations based off of: https://pubs.asahq.org/anesthesiology/article/127/1/203/18747/Calculating-Ideal-Body-Weight-Keep-It-Simple 