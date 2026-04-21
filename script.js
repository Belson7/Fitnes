document.addEventListener('DOMContentLoaded', () => {
    const btnBmi = document.getElementById('btn-bmi');
    const inputBmiWeight = document.getElementById('bmi-weight');
    const inputBmiHeight = document.getElementById('bmi-height');
    const resultBmi = document.getElementById('bmi-result');

    btnBmi.addEventListener('click', () => {
        const weight = parseFloat(inputBmiWeight.value);
        const height = parseFloat(inputBmiHeight.value) / 100;

        if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
            resultBmi.style.display = 'block';
            resultBmi.style.borderLeftColor = '#ef4444';
            resultBmi.innerHTML = '<span style="color: #ef4444;"><i class="fa-solid fa-triangle-exclamation"></i> Proszę podać prawidłowe wartości.</span>';
            return;
        }

        const bmi = (weight / (height * height)).toFixed(2);
        let category = '';
        let color = '';

        if (bmi < 18.5) {
            category = 'Niedowaga';
            color = '#38bdf8';
        } else if (bmi < 24.9) {
            category = 'Waga prawidłowa';
            color = '#22c55e';
        } else if (bmi < 29.9) {
            category = 'Nadwaga';
            color = '#f59e0b';
        } else {
            category = 'Otyłość';
            color = '#ef4444';
        }

        resultBmi.style.display = 'block';
        resultBmi.style.borderLeftColor = color;
        resultBmi.innerHTML = `
            <div style="font-size: 1.25rem; font-weight: 700; color: ${color}; margin-bottom: 0.5rem;">
                Twoje BMI: ${bmi}
            </div>
            <div style="color: var(--text-primary);">
                Klasyfikacja: <strong>${category}</strong>
            </div>
        `;
    });

    const btnBmr = document.getElementById('btn-bmr');
    const bmrGender = document.getElementById('bmr-gender');
    const bmrAge = document.getElementById('bmr-age');
    const bmrWeight = document.getElementById('bmr-weight');
    const bmrHeight = document.getElementById('bmr-height');
    const bmrActivity = document.getElementById('bmr-activity');
    const resultBmr = document.getElementById('bmr-result');

    let currentBmr = 0;

    btnBmr.addEventListener('click', () => {
        const gender = bmrGender.value;
        const age = parseInt(bmrAge.value);
        const weight = parseFloat(bmrWeight.value);
        const height = parseFloat(bmrHeight.value);
        const activity = parseFloat(bmrActivity.value);

        if (isNaN(age) || isNaN(weight) || isNaN(height) || age <= 0 || weight <= 0 || height <= 0) {
            resultBmr.style.display = 'block';
            resultBmr.style.borderLeftColor = '#ef4444';
            resultBmr.innerHTML = '<span style="color: #ef4444;"><i class="fa-solid fa-triangle-exclamation"></i> Proszę podać prawidłowe wartości.</span>';
            return;
        }

        let bmrBase = 0;
        if (gender === 'male') {
            bmrBase = (10 * weight) + (6.25 * height) - (5 * age) + 5;
        } else {
            bmrBase = (10 * weight) + (6.25 * height) - (5 * age) - 161;
        }

        currentBmr = bmrBase * activity;

        resultBmr.style.display = 'block';
        resultBmr.style.borderLeftColor = '#38bdf8';
        resultBmr.innerHTML = `
            <div style="font-size: 1.25rem; font-weight: 700; color: var(--accent); margin-bottom: 0.5rem;">
                Zapotrzebowanie Kaloryczne
            </div>
            <div style="color: var(--text-primary); margin-bottom: 0.5rem;">
                BMR (Spoczynkowe): <strong>${Math.round(bmrBase)} kcal</strong>
            </div>
            <div style="color: var(--text-primary);">
                TDEE (Całkowite): <strong>${Math.round(currentBmr)} kcal</strong>
            </div>
        `;
    });

    const btnMacros = document.getElementById('btn-macros');
    const macroGoal = document.getElementById('macro-goal');
    const resultMacros = document.getElementById('macros-result');

    btnMacros.addEventListener('click', () => {
        const weight = parseFloat(bmrWeight.value) || parseFloat(inputBmiWeight.value);

        if (currentBmr === 0 || isNaN(weight)) {
            resultMacros.style.display = 'block';
            resultMacros.style.borderLeftColor = '#ef4444';
            resultMacros.innerHTML = '<span style="color: #ef4444;"><i class="fa-solid fa-circle-info"></i> Najpierw oblicz BMR i podaj wagę.</span>';
            return;
        }

        const goal = macroGoal.value;
        let targetCalories = currentBmr;

        if (goal === 'lose') {
            targetCalories -= 500;
        } else if (goal === 'gain') {
            targetCalories += 500;
        }

        const protein = weight * 2;
        const fat = weight * 1;
        const proteinKcal = protein * 4;
        const fatKcal = fat * 9;
        const carbsKcal = targetCalories - proteinKcal - fatKcal;
        const carbs = carbsKcal > 0 ? carbsKcal / 4 : 0;

        resultMacros.style.display = 'block';
        resultMacros.style.borderLeftColor = '#22c55e';
        resultMacros.innerHTML = `
            <div style="font-size: 1.25rem; font-weight: 700; color: #22c55e; margin-bottom: 0.5rem;">
                Cel: ${Math.round(targetCalories)} kcal
            </div>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; text-align: center; margin-top: 1rem;">
                <div style="background: rgba(15, 23, 42, 0.6); padding: 0.5rem; border-radius: 8px;">
                    <div style="font-weight: 600; color: #38bdf8;">Białko</div>
                    <div>${Math.round(protein)}g</div>
                </div>
                <div style="background: rgba(15, 23, 42, 0.6); padding: 0.5rem; border-radius: 8px;">
                    <div style="font-weight: 600; color: #f59e0b;">Tłuszcz</div>
                    <div>${Math.round(fat)}g</div>
                </div>
                <div style="background: rgba(15, 23, 42, 0.6); padding: 0.5rem; border-radius: 8px;">
                    <div style="font-weight: 600; color: #22c55e;">Węgle</div>
                    <div>${Math.round(carbs)}g</div>
                </div>
            </div>
        `;
    });

    const btnWorkout = document.getElementById('btn-workout');
    const workoutType = document.getElementById('workout-type');
    const workoutAmount = document.getElementById('workout-amount');
    const workoutList = document.getElementById('workout-list');
    const totalBurnedEl = document.getElementById('total-burned');

    let totalBurned = 0;

    workoutType.addEventListener('change', () => {
        const selectedText = workoutType.options[workoutType.selectedIndex].text;
        if (selectedText.includes('min')) {
            workoutAmount.placeholder = 'Liczba minut (np. 15)';
        } else {
            workoutAmount.placeholder = 'Liczba powtórzeń (np. 15)';
        }
    });

    btnWorkout.addEventListener('click', () => {
        const amount = parseFloat(workoutAmount.value);
        const kcalPerUnit = parseFloat(workoutType.value);
        const workoutName = workoutType.options[workoutType.selectedIndex].text.split(' (')[0];

        if (isNaN(amount) || amount <= 0) {
            return;
        }

        const burned = Math.round(amount * kcalPerUnit);
        totalBurned += burned;

        const li = document.createElement('li');
        li.innerHTML = `<span><i class="fa-solid fa-check" style="color: var(--accent); margin-right: 0.5rem;"></i>${workoutName} x${amount}</span> <span style="color: #ef4444; font-weight: 600;">+${burned} kcal</span>`;
        
        workoutList.appendChild(li);
        totalBurnedEl.textContent = totalBurned;
        workoutAmount.value = '';
    });
});
