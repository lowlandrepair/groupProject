// Global variables
let randomNumber;
let attempts = 0;
let currentWord = '';
let wordScore = 0;
let currentQuestionIndex = 0;
let quizScore = 0;
let calorieItems = [];
let totalCalories = 0;

// Menu items array for array operations
const menuItems = [
    { name: 'Margherita Pizza', price: 12.99, category: 'pizza', vegetarian: true },
    { name: 'Spaghetti Carbonara', price: 14.99, category: 'pasta', vegetarian: false },
    { name: 'Fettuccine Alfredo', price: 16.99, category: 'pasta', vegetarian: true },
    { name: 'Lasagna Bolognese', price: 15.99, category: 'pasta', vegetarian: false },
    { name: 'Chicken Marsala', price: 19.99, category: 'meat', vegetarian: false },
    { name: 'Grilled Salmon', price: 22.99, category: 'seafood', vegetarian: false },
    { name: 'Caesar Salad', price: 7.99, category: 'salad', vegetarian: true },
    { name: 'Bruschetta', price: 8.99, category: 'appetizer', vegetarian: true },
    { name: 'Tiramisu', price: 7.99, category: 'dessert', vegetarian: true }
];

// Quiz questions array
const quizQuestions = [
    {
        question: "What is the main ingredient in traditional Carbonara?",
        options: ["Cream", "Eggs and Pecorino cheese", "Tomato sauce", "Butter"],
        correct: 1
    },
    {
        question: "Which region is Tiramisu from?",
        options: ["Naples", "Rome", "Veneto", "Sicily"],
        correct: 2
    },
    {
        question: "What type of pasta is used in Fettuccine Alfredo?",
        options: ["Spaghetti", "Penne", "Fettuccine", "Rigatoni"],
        correct: 2
    },
    {
        question: "Which cheese is traditionally used on Margherita Pizza?",
        options: ["Cheddar", "Mozzarella", "Parmesan", "Gorgonzola"],
        correct: 1
    },
    {
        question: "What does 'Al Dente' mean?",
        options: ["Overcooked", "Undercooked", "Firm to the bite", "Very soft"],
        correct: 2
    }
];

// Word scramble words
const wordWords = [
    { word: 'PIZZA', hint: 'Round Italian dish with cheese and toppings' },
    { word: 'PASTA', hint: 'Italian noodle dish' },
    { word: 'OLIVE', hint: 'Small green or black fruit used in Italian cooking' },
    { word: 'BASIL', hint: 'Aromatic herb used in pesto' },
    { word: 'GNOCCHI', hint: 'Italian potato dumplings' },
    { word: 'RISOTTO', hint: 'Creamy rice dish from Northern Italy' },
    { word: 'PROSCIUTTO', hint: 'Cured Italian ham' },
    { word: 'TIRAMISU', hint: 'Classic Italian dessert with coffee and mascarpone' }
];

// Initialize on page load
$(document).ready(function() {
    // Set minimum date for reservation to today
    const today = new Date().toISOString().split('T')[0];
    $('#resDate').attr('min', today);
    
    // Form validation
    $('#reservationForm').on('submit', function(e) {
        e.preventDefault();
        if (validateReservationForm()) {
            showSuccessMessage('Reservation confirmed! We\'ll see you soon.');
            this.reset();
        }
    });
    
    $('#orderForm').on('submit', function(e) {
        e.preventDefault();
        if (validateOrderForm()) {
            showSuccessMessage('Order placed successfully! Your food will be ready soon.');
            this.reset();
            $('#orderTotal').text('0.00');
            $('#menuItems').html('<div class="menu-item-row mb-2"><select class="form-control me-2" name="menuItem" required><option value="">Select Item</option><option value="Margherita Pizza">Margherita Pizza - $12.99</option><option value="Spaghetti Carbonara">Spaghetti Carbonara - $14.99</option><option value="Fettuccine Alfredo">Fettuccine Alfredo - $16.99</option><option value="Lasagna Bolognese">Lasagna Bolognese - $15.99</option><option value="Chicken Marsala">Chicken Marsala - $19.99</option><option value="Grilled Salmon">Grilled Salmon - $22.99</option><option value="Caesar Salad">Caesar Salad - $7.99</option><option value="Bruschetta">Bruschetta - $8.99</option><option value="Tiramisu">Tiramisu - $7.99</option></select><input type="number" class="form-control" name="quantity" min="1" max="10" value="1" style="width: 80px;" required><button type="button" class="btn btn-danger btn-sm" onclick="removeMenuItem(this)">Remove</button></div>');
        }
    });
    
    // Order type change handler
    $('#orderType').on('change', function() {
        if ($(this).val() === 'delivery') {
            $('#deliveryAddress').show();
            $('#orderAddress').prop('required', true);
        } else {
            $('#deliveryAddress').hide();
            $('#orderAddress').prop('required', false);
        }
    });
    
    // Menu item change handler for order total
    $(document).on('change', 'select[name="menuItem"], input[name="quantity"]', function() {
        updateOrderTotal();
    });
    
    // Add smooth scrolling
    $('a[href^="#"]').on('click', function(event) {
        var target = $(this.getAttribute('href'));
        if (target.length) {
            event.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 76
            }, 1000);
        }
    });
    
    // Add animations on scroll
    $(window).scroll(function() {
        $('.feature-card, .card, .team-member').each(function() {
            const elementTop = $(this).offset().top;
            const elementBottom = elementTop + $(this).outerHeight();
            const viewportTop = $(window).scrollTop();
            const viewportBottom = viewportTop + $(window).height();
            
            if (elementBottom > viewportTop && elementTop < viewportBottom) {
                $(this).addClass('animate-fade-in');
            }
        });
    });
});

// Form validation functions
function validateReservationForm() {
    let isValid = true;
    const form = document.getElementById('reservationForm');
    
    // Reset validation
    form.classList.remove('was-validated');
    $('.invalid-feedback').hide();
    
    // Validate name
    const name = document.getElementById('resName');
    if (name.value.trim() === '') {
        name.classList.add('is-invalid');
        isValid = false;
    } else {
        name.classList.remove('is-invalid');
    }
    
    // Validate email
    const email = document.getElementById('resEmail');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
        email.classList.add('is-invalid');
        isValid = false;
    } else {
        email.classList.remove('is-invalid');
    }
    
    // Validate phone
    const phone = document.getElementById('resPhone');
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    if (!phoneRegex.test(phone.value)) {
        phone.classList.add('is-invalid');
        isValid = false;
    } else {
        phone.classList.remove('is-invalid');
    }
    
    // Validate date
    const date = document.getElementById('resDate');
    if (date.value === '') {
        date.classList.add('is-invalid');
        isValid = false;
    } else {
        date.classList.remove('is-invalid');
    }
    
    // Validate time
    const time = document.getElementById('resTime');
    if (time.value === '') {
        time.classList.add('is-invalid');
        isValid = false;
    } else {
        time.classList.remove('is-invalid');
    }
    
    // Validate guests
    const guests = document.getElementById('resGuests');
    if (guests.value === '') {
        guests.classList.add('is-invalid');
        isValid = false;
    } else {
        guests.classList.remove('is-invalid');
    }
    
    // Validate terms
    const terms = document.getElementById('resTerms');
    if (!terms.checked) {
        terms.classList.add('is-invalid');
        isValid = false;
    } else {
        terms.classList.remove('is-invalid');
    }
    
    if (isValid) {
        form.classList.add('was-validated');
    }
    
    return isValid;
}

function validateOrderForm() {
    let isValid = true;
    const form = document.getElementById('orderForm');
    
    // Reset validation
    form.classList.remove('was-validated');
    $('.invalid-feedback').hide();
    
    // Validate name
    const name = document.getElementById('orderName');
    if (name.value.trim() === '') {
        name.classList.add('is-invalid');
        isValid = false;
    } else {
        name.classList.remove('is-invalid');
    }
    
    // Validate email
    const email = document.getElementById('orderEmail');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
        email.classList.add('is-invalid');
        isValid = false;
    } else {
        email.classList.remove('is-invalid');
    }
    
    // Validate phone
    const phone = document.getElementById('orderPhone');
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    if (!phoneRegex.test(phone.value)) {
        phone.classList.add('is-invalid');
        isValid = false;
    } else {
        phone.classList.remove('is-invalid');
    }
    
    // Validate order type
    const orderType = document.getElementById('orderType');
    if (orderType.value === '') {
        orderType.classList.add('is-invalid');
        isValid = false;
    } else {
        orderType.classList.remove('is-invalid');
    }
    
    // Validate delivery address if delivery is selected
    if (orderType.value === 'delivery') {
        const address = document.getElementById('orderAddress');
        if (address.value.trim() === '') {
            address.classList.add('is-invalid');
            isValid = false;
        } else {
            address.classList.remove('is-invalid');
        }
    }
    
    // Validate menu items
    const menuSelects = $('select[name="menuItem"]');
    let hasValidItem = false;
    menuSelects.each(function() {
        if ($(this).val() !== '') {
            hasValidItem = true;
        }
    });
    
    if (!hasValidItem) {
        menuSelects.first().addClass('is-invalid');
        isValid = false;
    } else {
        menuSelects.removeClass('is-invalid');
    }
    
    // Validate payment
    const payment = document.getElementById('orderPayment');
    if (payment.value === '') {
        payment.classList.add('is-invalid');
        isValid = false;
    } else {
        payment.classList.remove('is-invalid');
    }
    
    // Validate terms
    const terms = document.getElementById('orderTerms');
    if (!terms.checked) {
        terms.classList.add('is-invalid');
        isValid = false;
    } else {
        terms.classList.remove('is-invalid');
    }
    
    if (isValid) {
        form.classList.add('was-validated');
    }
    
    return isValid;
}

// Success message function
function showSuccessMessage(message) {
    $('#successMessage').html('<p>' + message + '</p>');
    $('#successModal').modal('show');
}

// Order form functions
function addMenuItem() {
    const menuItemHtml = '<div class="menu-item-row mb-2"><select class="form-control me-2" name="menuItem" required><option value="">Select Item</option><option value="Margherita Pizza">Margherita Pizza - $12.99</option><option value="Spaghetti Carbonara">Spaghetti Carbonara - $14.99</option><option value="Fettuccine Alfredo">Fettuccine Alfredo - $16.99</option><option value="Lasagna Bolognese">Lasagna Bolognese - $15.99</option><option value="Chicken Marsala">Chicken Marsala - $19.99</option><option value="Grilled Salmon">Grilled Salmon - $22.99</option><option value="Caesar Salad">Caesar Salad - $7.99</option><option value="Bruschetta">Bruschetta - $8.99</option><option value="Tiramisu">Tiramisu - $7.99</option></select><input type="number" class="form-control" name="quantity" min="1" max="10" value="1" style="width: 80px;" required><button type="button" class="btn btn-danger btn-sm" onclick="removeMenuItem(this)">Remove</button></div>';
    $('#menuItems').append(menuItemHtml);
}

function removeMenuItem(button) {
    $(button).parent().remove();
    updateOrderTotal();
}

function updateOrderTotal() {
    let total = 0;
    $('select[name="menuItem"]').each(function() {
        const itemText = $(this).val();
        const quantity = parseInt($(this).siblings('input[name="quantity"]').val()) || 0;
        
        if (itemText) {
            const price = parseFloat(itemText.split('$')[1]);
            total += price * quantity;
        }
    });
    
    $('#orderTotal').text(total.toFixed(2));
}

// Number Guessing Game
function checkGuess() {
    const guess = parseInt(document.getElementById('guessInput').value);
    
    if (isNaN(guess) || guess < 1 || guess > 100) {
        document.getElementById('guessResult').innerHTML = '<div class="alert alert-warning">Please enter a number between 1 and 100.</div>';
        return;
    }
    
    attempts++;
    document.getElementById('attempts').textContent = attempts;
    
    if (guess === randomNumber) {
        document.getElementById('guessResult').innerHTML = `<div class="alert alert-success">Congratulations! You guessed the number ${randomNumber} in ${attempts} attempts!</div>`;
        document.getElementById('guessInput').disabled = true;
    } else if (guess < randomNumber) {
        document.getElementById('guessResult').innerHTML = '<div class="alert alert-info">Too low! Try a higher number.</div>';
    } else {
        document.getElementById('guessResult').innerHTML = '<div class="alert alert-info">Too high! Try a lower number.</div>';
    }
}

function resetGuessGame() {
    randomNumber = Math.floor(Math.random() * 100) + 1;
    attempts = 0;
    document.getElementById('attempts').textContent = '0';
    document.getElementById('guessInput').value = '';
    document.getElementById('guessInput').disabled = false;
    document.getElementById('guessResult').innerHTML = '';
}

// Word Scramble Game
function startWordGame() {
    const randomIndex = Math.floor(Math.random() * wordWords.length);
    currentWord = wordWords[randomIndex].word;
    const scrambled = currentWord.split('').sort(() => Math.random() - 0.5).join('');
    
    document.getElementById('scrambledWord').textContent = scrambled;
    document.getElementById('wordGuess').value = '';
    document.getElementById('wordResult').innerHTML = '';
    document.getElementById('wordGuess').disabled = false;
}

function checkWord() {
    const guess = document.getElementById('wordGuess').value.toUpperCase();
    
    if (guess === currentWord) {
        wordScore += 10;
        document.getElementById('wordScore').textContent = wordScore;
        document.getElementById('wordResult').innerHTML = '<div class="alert alert-success">Correct! Well done!</div>';
        document.getElementById('wordGuess').disabled = true;
    } else {
        document.getElementById('wordResult').innerHTML = '<div class="alert alert-danger">Incorrect. Try again!</div>';
    }
}

function getHint() {
    const wordObj = wordWords.find(w => w.word === currentWord);
    if (wordObj) {
        document.getElementById('wordResult').innerHTML = `<div class="alert alert-info">Hint: ${wordObj.hint}</div>`;
        wordScore = Math.max(0, wordScore - 2);
        document.getElementById('wordScore').textContent = wordScore;
    }
}

// Quiz Game
function startQuiz() {
    currentQuestionIndex = 0;
    quizScore = 0;
    document.getElementById('quizScore').textContent = '0';
    document.getElementById('totalQuestions').textContent = quizQuestions.length;
    showQuestion();
}

function showQuestion() {
    if (currentQuestionIndex >= quizQuestions.length) {
        document.getElementById('questionText').innerHTML = `Quiz completed! Your final score: ${quizScore}/${quizQuestions.length}`;
        document.getElementById('quizOptions').innerHTML = '';
        document.getElementById('checkAnswerBtn').style.display = 'none';
        document.getElementById('nextQuestionBtn').style.display = 'none';
        return;
    }
    
    const question = quizQuestions[currentQuestionIndex];
    document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
    document.getElementById('questionText').textContent = question.question;
    
    let optionsHtml = '';
    question.options.forEach((option, index) => {
        optionsHtml += `<div class="form-check">
            <input class="form-check-input" type="radio" name="quizAnswer" id="option${index}" value="${index}">
            <label class="form-check-label" for="option${index}">${option}</label>
        </div>`;
    });
    
    document.getElementById('quizOptions').innerHTML = optionsHtml;
    document.getElementById('checkAnswerBtn').style.display = 'inline-block';
    document.getElementById('nextQuestionBtn').style.display = 'none';
}

function checkAnswer() {
    const selectedAnswer = document.querySelector('input[name="quizAnswer"]:checked');
    
    if (!selectedAnswer) {
        alert('Please select an answer!');
        return;
    }
    
    const answerIndex = parseInt(selectedAnswer.value);
    const correctAnswer = quizQuestions[currentQuestionIndex].correct;
    
    if (answerIndex === correctAnswer) {
        quizScore++;
        document.getElementById('quizScore').textContent = quizScore;
        document.getElementById('quizOptions').innerHTML += '<div class="alert alert-success mt-2">Correct!</div>';
    } else {
        document.getElementById('quizOptions').innerHTML += '<div class="alert alert-danger mt-2">Incorrect. The correct answer was: ' + quizQuestions[currentQuestionIndex].options[correctAnswer] + '</div>';
    }
    
    // Disable radio buttons
    document.querySelectorAll('input[name="quizAnswer"]').forEach(input => {
        input.disabled = true;
    });
    
    document.getElementById('checkAnswerBtn').style.display = 'none';
    document.getElementById('nextQuestionBtn').style.display = 'inline-block';
}

function nextQuestion() {
    currentQuestionIndex++;
    showQuestion();
}

// Tip Calculator
function updateTipDisplay() {
    const percentage = document.getElementById('tipPercentage').value;
    document.getElementById('tipDisplay').textContent = percentage + '%';
}

function calculateTip() {
    const billAmount = parseFloat(document.getElementById('billAmount').value);
    const tipPercentage = parseFloat(document.getElementById('tipPercentage').value);
    const splitCount = parseInt(document.getElementById('splitCount').value);
    
    if (isNaN(billAmount) || billAmount <= 0) {
        document.getElementById('tipResult').innerHTML = '<div class="alert alert-warning">Please enter a valid bill amount.</div>';
        return;
    }
    
    const tipAmount = billAmount * (tipPercentage / 100);
    const totalAmount = billAmount + tipAmount;
    const amountPerPerson = totalAmount / splitCount;
    
    document.getElementById('tipResult').innerHTML = `
        <div class="alert alert-info">
            <h5>Calculation Results:</h5>
            <p>Tip Amount: $${tipAmount.toFixed(2)}</p>
            <p>Total Amount: $${totalAmount.toFixed(2)}</p>
            <p>Amount per person: $${amountPerPerson.toFixed(2)}</p>
        </div>
    `;
}

// Calorie Counter
function addFood() {
    const foodSelect = document.getElementById('foodSelect');
    const quantity = parseInt(document.getElementById('foodQuantity').value);
    const foodName = foodSelect.options[foodSelect.selectedIndex].text.split('(')[0].trim();
    const calories = parseInt(foodSelect.value) * quantity;
    
    if (!foodSelect.value) {
        document.getElementById('calorieList').innerHTML = '<div class="alert alert-warning">Please select a food item.</div>';
        return;
    }
    
    calorieItems.push({ name: foodName, calories: calories, quantity: quantity });
    totalCalories += calories;
    
    updateCalorieList();
    
    // Reset selection
    foodSelect.value = '';
    document.getElementById('foodQuantity').value = '1';
}

function updateCalorieList() {
    let listHtml = '<h6>Food Items:</h6>';
    calorieItems.forEach((item, index) => {
        listHtml += `<div class="d-flex justify-content-between align-items-center mb-2">
            <span>${item.name} (x${item.quantity})</span>
            <span>${item.calories} cal <button class="btn btn-sm btn-outline-danger" onclick="removeFoodItem(${index})">Remove</button></span>
        </div>`;
    });
    
    document.getElementById('calorieList').innerHTML = listHtml;
    document.getElementById('totalCalories').textContent = totalCalories;
}

function removeFoodItem(index) {
    totalCalories -= calorieItems[index].calories;
    calorieItems.splice(index, 1);
    updateCalorieList();
}

function clearCalories() {
    calorieItems = [];
    totalCalories = 0;
    updateCalorieList();
    document.getElementById('calorieList').innerHTML = '';
}

// Array Operations
function showAllItems() {
    let result = '<h6>All Menu Items:</h6>';
    menuItems.forEach(item => {
        result += `<p>${item.name} - $${item.price} (${item.category})</p>`;
    });
    document.getElementById('arrayResult').innerHTML = result;
}

function filterVegetarian() {
    const vegetarianItems = menuItems.filter(item => item.vegetarian);
    let result = '<h6>Vegetarian Items:</h6>';
    vegetarianItems.forEach(item => {
        result += `<p>${item.name} - $${item.price}</p>`;
    });
    document.getElementById('arrayResult').innerHTML = result;
}

function sortPrices() {
    const sortedItems = [...menuItems].sort((a, b) => a.price - b.price);
    let result = '<h6>Items Sorted by Price (Low to High):</h6>';
    sortedItems.forEach(item => {
        result += `<p>${item.name} - $${item.price}</p>`;
    });
    document.getElementById('arrayResult').innerHTML = result;
}

function findExpensive() {
    const expensiveItems = menuItems.filter(item => item.price > 15);
    let result = '<h6>Expensive Items (>$15):</h6>';
    expensiveItems.forEach(item => {
        result += `<p>${item.name} - $${item.price}</p>`;
    });
    document.getElementById('arrayResult').innerHTML = result;
}

// Loop Demonstrations
function demonstrateLoops() {
    let result = '<h6>Loop Demonstrations:</h6>';
    
    // For loop
    result += '<p><strong>For loop (counting 1-5):</strong></p>';
    for (let i = 1; i <= 5; i++) {
        result += `${i} `;
    }
    
    // While loop
    result += '<p><strong>While loop (doubling until >100):</strong></p>';
    let num = 1;
    while (num <= 100) {
        result += `${num} `;
        num *= 2;
    }
    
    // Do-while loop
    result += '<p><strong>Do-while loop (at least once):</strong></p>';
    let count = 10;
    do {
        result += `${count} `;
        count--;
    } while (count > 5);
    
    // For...of loop
    result += '<p><strong>For...of loop (menu items):</strong></p>';
    for (const item of menuItems.slice(0, 3)) {
        result += `${item.name} `;
    }
    
    document.getElementById('loopResult').innerHTML = result;
}

function showPattern() {
    let result = '<h6>Number Pattern:</h6>';
    for (let i = 1; i <= 5; i++) {
        for (let j = 1; j <= i; j++) {
            result += '* ';
        }
        result += '<br>';
    }
    document.getElementById('loopResult').innerHTML = result;
}

function countDown() {
    let result = '<h6>Countdown from 10:</h6>';
    for (let i = 10; i >= 1; i--) {
        result += `${i} `;
        if (i === 1) {
            result += 'Blast off! 🚀';
        }
    }
    document.getElementById('loopResult').innerHTML = result;
}

// Conditional Logic - Restaurant Recommender
function getRecommendation() {
    const mood = document.getElementById('moodSelect').value;
    const budget = document.getElementById('budgetSelect').value;
    const cuisine = document.getElementById('cuisineSelect').value;
    
    let recommendation = '';
    
    // Nested conditionals
    if (mood === 'romantic') {
        if (budget === 'high') {
            if (cuisine === 'italian') {
                recommendation = 'Perfect choice! We recommend our private dining area with a special Italian tasting menu and wine pairing.';
            } else if (cuisine === 'seafood') {
                recommendation = 'Excellent! Our seafood platter for two with champagne would be perfect for your romantic evening.';
            } else {
                recommendation = 'For a romantic evening, we suggest our chef\'s special tasting menu with wine pairing.';
            }
        } else if (budget === 'medium') {
            recommendation = 'Great choice! We recommend a window table with our special pasta dishes and a nice bottle of wine.';
        } else {
            recommendation = 'For a romantic experience on a budget, try our happy hour specials and share a dessert.';
        }
    } else if (mood === 'casual') {
        if (budget === 'low') {
            recommendation = 'Perfect! Our pizza and salad combos are great for casual dining.';
        } else if (budget === 'medium') {
            recommendation = 'Great! Our pasta dishes and appetizers are perfect for a casual meal.';
        } else {
            recommendation = 'Excellent! Try our full menu experience with appetizers, mains, and desserts.';
        }
    } else if (mood === 'family') {
        if (budget === 'low') {
            recommendation = 'Family-friendly! Our kids menu and family pizza deals are perfect.';
        } else if (budget === 'medium') {
            recommendation = 'Great for families! We have kid-friendly options and adult favorites.';
        } else {
            recommendation = 'Perfect for a family celebration! Our private dining area can accommodate groups.';
        }
    } else if (mood === 'business') {
        if (budget === 'high') {
            recommendation = 'Professional choice! Our business lunch specials and quiet atmosphere are ideal.';
        } else if (budget === 'medium') {
            recommendation = 'Good for business! Our lunch menu has quick service and great options.';
        } else {
            recommendation = 'Budget-friendly business lunch! Our express menu is perfect for working lunches.';
        }
    } else {
        recommendation = 'Please select your preferences to get a personalized recommendation.';
    }
    
    document.getElementById('recommendationResult').innerHTML = `<div class="alert alert-info">${recommendation}</div>`;
}

// Dish Selector with conditionals
function suggestDish() {
    const vegetarian = document.getElementById('vegetarian').checked;
    const glutenFree = document.getElementById('glutenFree').checked;
    const dairyFree = document.getElementById('dairyFree').checked;
    const spiceLevel = document.getElementById('spiceLevel').value;
    
    let suggestion = '';
    
    // Complex conditional logic
    if (vegetarian && glutenFree && dairyFree) {
        suggestion = 'We recommend our Garden Salad with olive oil dressing.';
    } else if (vegetarian && glutenFree) {
        suggestion = 'Try our Risotto Primavera or Gluten-free Pasta Arrabbiata.';
    } else if (vegetarian && dairyFree) {
        suggestion = 'Our Marinara Pasta or Vegetable Stir-fry would be perfect.';
    } else if (glutenFree && dairyFree) {
        suggestion = 'Try our Grilled Salmon with vegetables or Chicken Marsala (no cheese).';
    } else if (vegetarian) {
        if (spiceLevel === 'mild') {
            suggestion = 'Margherita Pizza or Fettuccine Alfredo would be perfect.';
        } else if (spiceLevel === 'medium') {
            suggestion = 'Try our Vegetarian Pizza or Pasta Primavera.';
        } else {
            suggestion = 'Spicy Arrabbiata Pasta or Puttanesca would be great!';
        }
    } else if (glutenFree) {
        suggestion = 'Our Grilled Salmon, Chicken Marsala, or any of our salads are gluten-free options.';
    } else if (dairyFree) {
        suggestion = 'Try our Marinara Pasta, Grilled Salmon, or Chicken Marsala (no cheese).';
    } else {
        // No restrictions
        if (spiceLevel === 'mild') {
            suggestion = 'Try our Margherita Pizza, Fettuccine Alfredo, or Chicken Marsala.';
        } else if (spiceLevel === 'medium') {
            suggestion = 'Spaghetti Carbonara, Lasagna Bolognese, or Pepperoni Pizza would be great.';
        } else if (spiceLevel === 'spicy') {
            suggestion = 'Try our Spicy Diavola Pizza or Arrabbiata Pasta.';
        } else {
            suggestion = 'For maximum spice, try our Extra Hot Arrabbiata or Spicy Seafood Pasta!';
        }
    }
    
    document.getElementById('dishResult').innerHTML = `<div class="alert alert-success">${suggestion}</div>`;
}

// Dynamic Content Generation
function generateContent() {
    const contentType = document.getElementById('contentType').value;
    const itemCount = parseInt(document.getElementById('itemCount').value);
    
    let content = '';
    
    if (contentType === 'menu') {
        content = '<h6>Generated Menu Items:</h6>';
        const dishes = ['Pizza', 'Pasta', 'Salad', 'Soup', 'Dessert', 'Appetizer', 'Seafood', 'Meat'];
        const adjectives = ['Classic', 'Special', 'Deluxe', 'Signature', 'Homemade', 'Traditional'];
        
        for (let i = 0; i < itemCount; i++) {
            const dish = dishes[Math.floor(Math.random() * dishes.length)];
            const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
            const price = (Math.random() * 20 + 8).toFixed(2);
            content += `<p>${adjective} ${dish} - $${price}</p>`;
        }
    } else if (contentType === 'reviews') {
        content = '<h6>Generated Customer Reviews:</h6>';
        const names = ['John', 'Sarah', 'Mike', 'Emily', 'David', 'Lisa', 'Tom', 'Anna'];
        const comments = [
            'Amazing food and great service!',
            'Best Italian restaurant in town!',
            'Love the atmosphere and authentic flavors.',
            'Excellent wine selection and delicious pasta.',
            'Perfect for date night!',
            'Family-friendly and kid-approved.',
            'Fresh ingredients and generous portions.',
            'Will definitely come back again!'
        ];
        
        for (let i = 0; i < itemCount; i++) {
            const name = names[Math.floor(Math.random() * names.length)];
            const comment = comments[Math.floor(Math.random() * comments.length)];
            const rating = Math.floor(Math.random() * 2) + 4; // 4-5 stars
            const stars = '⭐'.repeat(rating);
            content += `<div class="mb-2"><strong>${name}</strong> ${stars}<br><small>${comment}</small></div>`;
        }
    } else if (contentType === 'recipes') {
        content = '<h6>Generated Recipe Ideas:</h6>';
        const ingredients = ['Tomatoes', 'Basil', 'Garlic', 'Olive Oil', 'Cheese', 'Mushrooms', 'Spinach', 'Peppers'];
        const dishes = ['Pasta', 'Pizza', 'Salad', 'Soup', 'Sandwich', 'Wrap'];
        
        for (let i = 0; i < itemCount; i++) {
            const dish = dishes[Math.floor(Math.random() * dishes.length)];
            const mainIngredient = ingredients[Math.floor(Math.random() * ingredients.length)];
            const secondaryIngredient = ingredients[Math.floor(Math.random() * ingredients.length)];
            const cookingTime = Math.floor(Math.random() * 30) + 15;
            content += `<p><strong>${mainIngredient} and ${secondaryIngredient} ${dish}</strong><br><small>Cooking time: ${cookingTime} minutes</small></p>`;
        }
    } else if (contentType === 'events') {
        content = '<h6>Generated Special Events:</h6>';
        const eventTypes = ['Wine Tasting', 'Cooking Class', 'Live Music', 'Chef\'s Table', 'Theme Night', 'Holiday Special'];
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        
        for (let i = 0; i < itemCount; i++) {
            const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
            const day = days[Math.floor(Math.random() * days.length)];
            const time = Math.floor(Math.random() * 4) + 6; // 6-9 PM
            const price = Math.floor(Math.random() * 50) + 25;
            content += `<p><strong>${eventType} Night</strong><br><small>Every ${day} at ${time}:00 PM - $${price} per person</small></p>`;
        }
    }
    
    document.getElementById('generatedContent').innerHTML = content;
}

function clearGeneratedContent() {
    document.getElementById('generatedContent').innerHTML = '';
}

// Initialize games on page load
window.onload = function() {
    resetGuessGame();
};
