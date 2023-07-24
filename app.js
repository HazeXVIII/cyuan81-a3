const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/bmi', (req, res) => {
    const { weight, height } = req.query;
    let bmi = parseFloat(weight) / (parseFloat(height) * parseFloat(height));
    bmi = parseFloat(bmi.toFixed(2));
    res.json({ bmi });
});

app.get('/bodyfat', (req, res) => {
    const { bmi, weight, height, age, gender } = req.query;
    let bodyFatPercentage;

    // calculated BMI can use the bmi calculation from /bmi route
    const calculatedBMI = bmi || (parseFloat(weight) / (parseFloat(height) * parseFloat(height)));
    
    if (gender === 'male') {
        bodyFatPercentage = (1.20 * calculatedBMI) + (0.23 * parseFloat(age)) - 16.2;
    } else if (gender === 'female') {
        bodyFatPercentage = (1.20 * calculatedBMI) + (0.23 * parseFloat(age)) - 5.4;
    } else {
        return res.status(400).json({error: 'Invalid gender. Please provide "male" or "female".'});
    }
    bodyFatPercentage = parseFloat(bodyFatPercentage.toFixed(2));
    res.json({ bodyFat: bodyFatPercentage });
});

app.get('/idealweight', (req, res) => {
    const { height, gender } = req.query;
    let theIdealWeight;
    if (gender === 'male') {
        theIdealWeight = 50 + (0.91 * (height - 152.4));
    } else if (gender === 'female') {
        theIdealWeight = 45.5 + (0.91 * (height - 152.4));
    } else {
        return res.status(400).json({error: 'Invalid gender. Please provide "male" or "female".'});
    }
    theIdealWeight = parseFloat(theIdealWeight.toFixed(2));
    res.json({ idealWeight: theIdealWeight });
});

// function to calculate BMR based on gender
function calculateBMR(weight, height, age, gender) {
    const weightInKg = parseFloat(weight);
    const heightInCm = parseFloat(height) * 100;
    const ageInYears = parseFloat(age);

    if (gender === 'male') {
        return 88.362 + (13.397 * weightInKg) + (4.799 * heightInCm) - (5.677 * ageInYears);
    } else if (gender === 'female') {
        return 447.593 + (9.247 * weightInKg) + (3.098 * heightInCm) - (4.330 * ageInYears);
    } else {
        throw new Error('Invalid gender. Please provide "male" or "female".');
    }
}

// function to calculate TDEE based on BMR and activity level
function calculateTDEE(BMR, activityLevel) {
    switch (activityLevel) {
        case 'sedentary':
            return BMR * 1.2;
        case 'lightly_active':
            return BMR * 1.375;
        case 'active':
            return BMR * 1.55;
        case 'very_active':
            return BMR * 1.725;
        default:
            throw new Error('Invalid activity level. Please provide a valid choice.');
    }
}

app.get('/caloriesburned', async (req, res) => {
    const { bmi, goal, weight, height, age, gender, activityLevel} = req.query;

    // calculate or assign the bmi
    const calculatedBMI = bmi || (parseFloat(weight) / (parseFloat(height) * parseFloat(height)));

    try {
        // Calculate BMR and TDEE
        const BMR = calculateBMR(weight, height, age, gender);
        const TDEE = calculateTDEE(BMR, activityLevel);

        // Calculate recommendedCalories based on the selected goal
        let recommendedCalories;
        switch (goal) {
            case 'weight_loss':
                recommendedCalories = TDEE * 0.85; // 15% calorie deficit for weight loss
                break;
            case 'weight_maintenance':
                recommendedCalories = TDEE; // Maintain current weight
                break;
            case 'weight_gain':
                recommendedCalories = TDEE * 1.10; // 10% calorie surplus for weight gain
                break;
            default:
                throw new Error('Invalid goal. Please provide a valid goal (weight_loss, weight_maintenance, or weight_gain).');
        }

        // round the recommendedCalories to two decimal places
        recommendedCalories = parseFloat(recommendedCalories.toFixed(2));
    
        res.json({
            goal,
            BMI: calculatedBMI,
            TDEE,
            recommendedCalories,
        });
    } catch (error) {
        // handle any errors that may occur during the HTTP requests
        console.error('Error fetching data:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});