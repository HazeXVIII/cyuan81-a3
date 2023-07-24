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
    if(gender === 'male') {
        theIdealWeight = 50 + (0.91 * (height - 152.4));
    } else if (gender === 'female') {
        theIdealWeight = 45.5 + (0.91 * (height = 152.4));
    } else {
        return res.status(400).json({error: 'Invalid gender. Please provide "male" or "female".'});
    }
    theIdealWeight = parseFloat(theIdealWeight.toFixed(2));
    res.json({ idealWeight: theIdealWeight });
});

app.get('/caloriesburned', async (req, res) => {
    const { bmi, goal, weight, height, age, gender } = req.query;
    const activityLevel = parseFloat(req.query.activityLevel);

    // calculate or assign the bmi
    const calculatedBMI = bmi || (parseFloat(weight) / (parseFloat(height) * parseFloat(height)));
    const roundedBMI = parseFloat(calculatedBMI.toFixed(2));

    // calculate the basal metabolic rate (BMR) for men and women
    let BMR;
    if (gender === 'male') {
        BMR = 88.362 + (13.397 * parseFloat(weight)) + (4.799 * parseFloat(height) * 100)
        - (5.677 * parseFloat(age));
    } else if (gender === 'female') {
        BMR = 447.593 + (9.247 * parseFloat(weight)) + (3.098 * parseFloat(height) * 100)
        - (4.330 * parseFloat(age));
    } else {
        return res.status(400).json({error: 'Invalid gender. Please provide "male" or "female".'});
    }

    // calculate the total daily expenditure (TDEE)
    let TDEE;
    switch (activityLevel) {
        case 1:
            TDEE = BMR * 1.2;
            break;
        case 2:
            TDEE = BMR * 1.375;
            break;
        case 3:
            TDEE = BMR * 1.55;
            break;
        case 4:
            TDEE = BMR * 1.725;
            break;
        default:
            return res.status(400).json({error: 'Invalid activity level. Please provide a valid choice.'})
    }

    try {
        // call the /idealweight route using axios to get idealWeight
        const idealWeightResponse = await axios.get('http://localhost:3000/idealweight', {
            params: {
                height,
                gender,
            },
        });
    
        // Extract idealWeight from the response data
        const idealWeight = idealWeightResponse.data.idealWeight;
    
        // call the /bodyfat route using axios to get bodyFatPercentage
        const bodyFatResponse = await axios.get('http://localhost:3000/bodyfat', {
            params: {
                bmi: roundedBMI,
                weight,
                height,
                age,
                gender,
            },
        });
    
        // extract bodyFatPercentage from the response data
        const bodyFatPercentage = bodyFatResponse.data.bodyFat;
    
        // calculate calories for the selected goal
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
                return res.status(400).json({ error: 'Invalid goal. Please provide a valid goal (weight_loss, weight_maintenance, or weight_gain).' });
        }

        // round the recommendedCalories to two decimal places
        recommendedCalories = parseFloat(recommendedCalories.toFixed(2));
    
        res.json({
            goal,
            BMI: roundedBMI,
            TDEE,
            recommendedCalories,
            idealWeight,
            bodyFatPercentage,
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