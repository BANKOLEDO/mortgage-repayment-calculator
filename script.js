document.addEventListener("DOMContentLoaded", function () {
    const calculateRepaymentsBtn = document.getElementById("calculate");
    const clearAllBtn = document.getElementById("clr-btn");
    const resultsBlock = document.getElementById("results-block");
    const emptyBlock = document.getElementById('empty-block');

    // Function to clean input and remove any commas
    const cleanInput = (input) => {
        return input.replace(/[^0-9.]/g, ''); // Removes all non-numeric and non-decimal characters
    };

    // Add input event listeners to clean input fields
    const numericFields = ["mortgage-amount", "mortgage-term", "interest-rate"];
    numericFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        field.addEventListener("input", function () {
            this.value = cleanInput(this.value); // Clean the input value
            // Clear error state if user is typing
            setErrorState(fieldId, false);
        });
    });

    const setErrorState = (fieldId, isError) => {
        const inputWrapper = document.getElementById(fieldId)?.closest('.input-wrapper');
        const errorMessage = document.getElementById(`${fieldId}-error`);
        const euroSign = document.querySelector('.euro-sign');
        const yearsText = document.querySelector('.years-text');
        const percentage = document.querySelector('.percentage');

        if (isError) {
            if (inputWrapper) {
                inputWrapper.classList.add('error');
            }
            if (errorMessage) {
                errorMessage.classList.add('visible');
            }

            // Apply error styles to .euro-sign, .years-text, .percentage
            if (euroSign && fieldId === "mortgage-amount") {
                euroSign.classList.add('error');
            }
            if (yearsText && fieldId === "mortgage-term") {
                yearsText.classList.add('error');
            }
            if (percentage && fieldId === "interest-rate") {
                percentage.classList.add('error');
            }
        } else {
            if (inputWrapper) {
                inputWrapper.classList.remove('error');
            }
            if (errorMessage) {
                errorMessage.classList.remove('visible');
            }

            // Remove error styles from .euro-sign, .years-text, .percentage
            if (euroSign && fieldId === "mortgage-amount") {
                euroSign.classList.remove('error');
            }
            if (yearsText && fieldId === "mortgage-term") {
                yearsText.classList.remove('error');
            }
            if (percentage && fieldId === "interest-rate") {
                percentage.classList.remove('error');
            }
        }
    };

    const displayResults = () => {
        const amount = parseFloat(cleanInput(document.getElementById("mortgage-amount").value));
        const termInYears = parseFloat(cleanInput(document.getElementById("mortgage-term").value));
        const interestRate = parseFloat(cleanInput(document.getElementById("interest-rate").value));
        const mortgageType = document.querySelector('input[name="mortgage-type"]:checked')?.value;
        let hasError = false;

        // Validate inputs
        if (isNaN(amount) || amount <= 0) {
            hasError = true;
            setErrorState("mortgage-amount", true);
        } else {
            setErrorState("mortgage-amount", false);
        }

        if (isNaN(termInYears) || termInYears <= 0) {
            hasError = true;
            setErrorState("mortgage-term", true);
        } else {
            setErrorState("mortgage-term", false);
        }

        if (isNaN(interestRate) || interestRate <= 0) {
            hasError = true;
            setErrorState("interest-rate", true);
        } else {
            setErrorState("interest-rate", false);
        }

        if (!mortgageType) {
            hasError = true;
            document.querySelector('.mortgage-type-error').classList.add('visible');
        } else {
            document.querySelector('.mortgage-type-error').classList.remove('visible');
        }

        if (!hasError) {
            const results = calculateMortgage(amount, termInYears, interestRate, mortgageType);
            resultsBlock.innerHTML = `
                <h1 class="results-heading">Your results</h1>
                <p class="results-paragraph">Your results are shown below based on the information you provided.To adjust the results, edit the form and click “calculate repayments” again.</p>
                <div class="results-container">
                    <div class="mrp-container">
                        <span class="mrp-header">Your monthly repayments</span><span class="mrp-number"> €${results.monthlyRepayment}</span>
                    </div>
                    <div class="hr"></div>
                    <div class="tp-container">
                        <span class="tp-header">Total you'll repay over the term</span><span class="tp-number"> €${results.totalToRepay}</span>
                    </div>
                </div>
            `;
            emptyBlock.style.display = "none";
        }
    };

    const clearAll = () => {
        document.getElementById("mortgage-amount").value = '';
        document.getElementById("mortgage-term").value = '';
        document.getElementById("interest-rate").value = '';
        document.querySelectorAll('input[name="mortgage-type"]').forEach((radio) => {
            radio.checked = false;
        });
        resultsBlock.innerHTML = '';
        emptyBlock.style.display = '';
        
        // Remove error states
        setErrorState("mortgage-amount", false);
        setErrorState("mortgage-term", false);
        setErrorState("interest-rate", false);
        document.querySelector('.mortgage-type-error').classList.remove('visible');
    };

    const calculateMortgage = (amount, termInYears, interestRate, mortgageType) => {
        // Calculate the monthly repayment and total to repay
        const termInMonths = termInYears * 12;
        const monthlyInterestRate = interestRate / 100 / 12;

        let monthlyRepayment = 0;
        if (mortgageType === "repayment") {
            const numerator = monthlyInterestRate * Math.pow(1 + monthlyInterestRate, termInMonths);
            const denominator = Math.pow(1 + monthlyInterestRate, termInMonths) - 1;
            monthlyRepayment = amount * (numerator / denominator);
        } else if (mortgageType === "interest-only") {
            monthlyRepayment = amount * monthlyInterestRate;
        }

        const totalToRepay = monthlyRepayment * termInMonths;

        return {
            monthlyRepayment: monthlyRepayment.toFixed(2),
            totalToRepay: totalToRepay.toFixed(2)
        };
    };

    calculateRepaymentsBtn.addEventListener("click", displayResults);
    clearAllBtn.addEventListener("click", clearAll);
});
