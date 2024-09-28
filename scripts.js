// Global Variables
let userGoals = [];
let userPoints = 0;

// Event Listener for Goal Setting
document.getElementById('set-goal-btn').addEventListener('click', setGoal);

// Goal Setting Function
function setGoal() {
    const goalInput = document.getElementById('goal');
    const goalText = goalInput.value.trim();

    if (goalText) {
        userGoals.push({ goal: goalText, achieved: false });
        updateRewardsList();
        goalInput.value = ''; // Clear input
        alert(`Goal set: "${goalText}"`);
    } else {
        alert('Please enter a valid goal.');
    }
}

// Update the Rewards List
function updateRewardsList() {
    const rewardsList = document.getElementById('rewards-list');
    rewardsList.innerHTML = ''; // Clear the list

    userGoals.forEach((goal, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = goal.goal + (goal.achieved ? ' (Achieved)' : '');
        rewardsList.appendChild(listItem);
    });
}

// Function to Reward Users Based on Item Usage
function rewardUser(itemName) {
    userGoals.forEach(goal => {
        if (!goal.achieved) {
            const isAchieved = checkGoalAchieved(goal.goal, itemName);
            if (isAchieved) {
                goal.achieved = true;
                userPoints += 10; // Reward 10 points
                alert(`Congratulations! You've achieved a goal: "${goal.goal}". You've earned 10 points!`);
                updateRewardsList();
            }
        }
    });
}

// Mock Function to Check if a Goal Has Been Achieved (Replace with Real Logic)
function checkGoalAchieved(goal, itemName) {
    // Placeholder logic, replace with actual condition check
    return Math.random() < 0.5; // Randomly simulate achievement
}

// Event Listener for Adding Items to the Inventory
document.getElementById('inventory-form').addEventListener('submit', addItem);

// Function to Add an Item to the Inventory
function addItem(event) {
    event.preventDefault();

    // Get form values
    const itemName = document.getElementById('item-name').value;
    const category = document.getElementById('category').value;
    const condition = document.getElementById('condition').value;

    // Check for duplicate item
    const existingItem = checkForDuplicate(itemName);
    if (existingItem) {
        alert(`You already have "${itemName}" in your inventory.`);
        return;
    }

    // Create new table row
    const table = document.getElementById('inventory-list');
    const row = document.createElement('tr');

    // Insert columns, including last-used date (set to today's date initially)
    const today = new Date();
    const lastUsedDate = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    row.innerHTML = `
        <td>${itemName}</td>
        <td>${category}</td>
        <td>${condition}</td>
        <td class="last-used">${lastUsedDate}</td>
        <td class="actions">
            <button onclick="deleteItem(this)">Delete</button>
        </td>
        <td class="actions">
            <button onclick="showSustainabilityInsights('${itemName}')">View Insights</button> <!-- New button for insights -->
        </td>
    `;

    // Append the row to the table
    table.appendChild(row);

    // Set reminder for underused items
    setReminder(row, itemName, lastUsedDate);

    // Reward the user based on item usage
    rewardUser(itemName);
}

// Function to Delete an Item from the Inventory
function deleteItem(button) {
    button.parentElement.parentElement.remove();
}

// Check for Duplicate Items in the Inventory
function checkForDuplicate(itemName) {
    const rows = document.querySelectorAll('#inventory-list tr');
    for (let row of rows) {
        const existingItemName = row.cells[0].textContent;
        if (existingItemName.toLowerCase() === itemName.toLowerCase()) {
            return true;  // Duplicate found
        }
    }
    return false;
}

// Function to Set Reminders for Underused Items
function setReminder(row, itemName, lastUsedDate) {
    setInterval(() => {
        const currentDate = new Date();
        const lastUsed = new Date(lastUsedDate);
        const timeDifference = Math.floor((currentDate - lastUsed) / (1000 * 60 * 60 * 24)); // Days

        if (timeDifference >= 10) {  // Reminder if the item hasn't been used for 10 days
            alert(`Reminder: The item "${itemName}" has not been used for 10 days. Consider using or maintaining it.`);
        }
    }, 86400000);  // Check once a day (24 hours in milliseconds)
}

// Function to Display Sustainability Insights
function showSustainabilityInsights(itemName) {
    const insights = {
        "Laptop": {
            impact: "High energy consumption during production.",
            ecoFriendlySuggestions: ["Consider using energy-efficient models.", "Recycle old electronics at designated centers."],
            recycling: "Find recycling options at your local e-waste facility.",
            secondHand: "Check second-hand stores or online marketplaces."
        },
        "T-Shirt": {
            impact: "Cotton production can be water-intensive.",
            ecoFriendlySuggestions: ["Opt for organic cotton t-shirts.", "Consider clothing swaps."],
            recycling: "Donate to local charities or textile recycling programs.",
            secondHand: "Visit thrift stores or online resale platforms."
        },
        // Add more items as needed
    };

    const itemInsights = insights[itemName] || { 
        impact: "No data available.", 
        ecoFriendlySuggestions: [], 
        recycling: "", 
        secondHand: "" 
    };

    alert(`
        Environmental Impact: ${itemInsights.impact}
        Eco-Friendly Suggestions: ${itemInsights.ecoFriendlySuggestions.join(", ")}
        Recycling Options: ${itemInsights.recycling}
        Second-Hand Options: ${itemInsights.secondHand}
    `);
}
