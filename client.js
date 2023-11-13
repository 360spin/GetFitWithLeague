document.getElementById("summonerForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const gameName = document.getElementById("gameName").value;
    const tagLine = document.getElementById("tagLine").value;

    try {
        const response = await fetch("http://64.226.78.132:3000/api/fetchSummonerData", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                gameName,
                tagLine
            }),
        });

        const data = await response.json();

        // Display the results in the results div
        const resultsDiv = document.getElementById("results");
        resultsDiv.innerHTML = `
        <h2>Your Stats:</h2>
        <div class="stats-container">
            <div class="stat-box">Kills: ${data.kills}</div>
            <div class="stat-box">Deaths: ${data.deaths}</div>
            <div class="stat-box">Assists: ${data.assists}</div>
            <div class="stat-box">Team Kills: ${data.TeamChampionKills}</div>
            <div class="stat-box">Enemy Team Kills: ${data.enemyTeamChampionKills}</div>
            <div class="stat-box">Game Time: ${data.gameTime}min</div>
        </div>`;

        resultsDiv.classList.add("show");

        document.getElementById("workoutOptions").classList.remove("hidden");
        const workoutButtons = document.querySelectorAll("[data-workout]");
        workoutButtons.forEach((button) => {
            button.addEventListener("click", function () {
                const workoutType = this.getAttribute("data-workout");
                showWorkoutPlan(data, workoutType); // Call a function to display the workout plan based on data and workout type.
            });
        });
    } catch (error) {
        console.error("Error fetching match info:", error);
    }
});

const wholeBody = [
    "Jumping jacks",
    "Mountain Climbers",
    "High knees",
    "Frog jumps"
];

const upperBody = [
    "Push-ups",
    "Tricep push-ups",
    "Chair Dips",
    "Arm Circles",
    "Reverse snow angel",
    "Shoulder Taps",
    "Pike Pushups"
]

const absCore = [
    "Leg raises",
    "Bird Dog",
    "Bicycle Crunches",
    "Superman",
    "Russian Twist",
    "Crunches"
]

const lowerBody = [
    "Calf Rises",
    "Squats",
    "Lunges",
    "Side Lunges",
    "Donkey Kicks"
]

function getDifficultyMultiplier(difficulty) {
    const multipliers = {
        easy: 0.5,
        normal: 1.0,
        hard: 1.5,
        getbuffed: 2.5
    };

    return multipliers[difficulty.toLowerCase()] || 1.0; // Default to 'normal' if difficulty is not recognized
}

function getRandomItem(array) {
    if (!Array.isArray(array) || array.length === 0) {
        throw new Error('The provided argument is not a valid array or it is empty.');
    }
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}


function showWorkoutPlan(data, workoutType) {
    const workoutDiv = document.getElementById("workoutPlan");
    let workoutDetails = "";

    const {
        kills,
        deaths,
        assists,
        win,
        gameTime,
        enemyTeamChampionKills,
        TeamChampionKills
    } = data;

    // Using switch statement to determine workout details
// Determine the difficulty multiplier
let difficulty;
switch (workoutType) {
    case "Easy":
        difficulty = getDifficultyMultiplier("easy");
        break;
    case "Normal":
        difficulty = getDifficultyMultiplier("normal");
        break;
    case "Hard":
        difficulty = getDifficultyMultiplier("hard");
        break;
    case "Get-Buffed":
        difficulty = getDifficultyMultiplier("getBuffed");
        break;
    default:
        workoutDetails = `<p>Please select a valid workout type.</p>`;
        break;
}

// If a valid difficulty was set, create the workout plan
if (difficulty) {
    workoutDetails = `
        <button class="exercise-btn">${getRandomItem(wholeBody)}: ${Math.round(gameTime * difficulty)} Reps</button>
        <button class="exercise-btn">${getRandomItem(upperBody)}: ${Math.round((kills + assists) * difficulty)} Reps</button>
        <button class="exercise-btn">Plank: ${(deaths * 10) * difficulty} seconds</button>
        <button class="exercise-btn">${getRandomItem(absCore)}: ${Math.round(enemyTeamChampionKills * difficulty)} Reps</button>
        <button class="exercise-btn">${getRandomItem(lowerBody)}: ${Math.round(TeamChampionKills * difficulty)} Reps</button>`;
}


    workoutDiv.innerHTML = `<h3>${workoutType.replace("-", " ")} Workout Plan:</h3>
                            <div class="workout-buttons">${workoutDetails}</div>`;
    workoutDiv.classList.remove("hidden");

    // Adding click events to each exercise button
    const exerciseButtons = workoutDiv.querySelectorAll('.exercise-btn');
    exerciseButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            this.classList.toggle('completed');
            const allComplete = Array.from(exerciseButtons).every(button => button.classList.contains('completed'));
            if (allComplete) {
                workoutDiv.innerHTML += '<h1 class="congrats-msg">Good job, time for the next game!</h1>';
            }
        });
    });
}