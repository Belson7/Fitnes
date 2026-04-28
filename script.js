document.documentElement.classList.add('js-enabled');

document.addEventListener('DOMContentLoaded', () => {
    try {
        const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
        
        function switchTheme(e) {
            if (e.target.checked) {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
        }
        
        if (toggleSwitch) {
            toggleSwitch.addEventListener('change', switchTheme);
            const currentTheme = localStorage.getItem('theme');
            if (currentTheme) {
                document.documentElement.setAttribute('data-theme', currentTheme);
                if (currentTheme === 'light') {
                    toggleSwitch.checked = true;
                }
            }
        }

        let currentBmr = 0;
        let totalFoodKcal = 0;
        let totalBurned = 0;
        let waterDrank = 0;
        let timerInterval;
        let timerElapsed = 0;
        let timerRunning = false;

        const btnSaveProfile = document.getElementById('btn-save-profile');
        const inputName = document.getElementById('profile-name');
        const inputAge = document.getElementById('profile-age');
        const inputGoal = document.getElementById('profile-goal');
        const greetingBox = document.getElementById('greeting-box');
        const inputBmiWeight = document.getElementById('bmi-weight');
        const inputBmiHeight = document.getElementById('bmi-height');
        const bmrAge = document.getElementById('bmr-age');

        function loadProfile() {
            try {
                const savedName = localStorage.getItem('profileName');
                const savedAge = localStorage.getItem('profileAge');
                const savedGoal = localStorage.getItem('profileGoal');
                if(savedName && greetingBox && inputName) {
                    inputName.value = savedName;
                    greetingBox.style.display = 'block';
                    greetingBox.innerHTML = `<span style="font-size:1.25rem;font-weight:700;color:var(--accent);">Witaj ponownie, ${savedName}!</span><br><span style="color:var(--text-muted);font-size:0.95rem;">Cel główny: ${savedGoal || 'Brak'}</span>`;
                }
                if(savedAge) {
                    if (inputAge) inputAge.value = savedAge;
                    if (bmrAge) bmrAge.value = savedAge;
                }
                if(savedGoal && inputGoal) {
                    inputGoal.value = savedGoal;
                }
            } catch (err) {}
        }
        loadProfile();

        if (btnSaveProfile) {
            btnSaveProfile.addEventListener('click', () => {
                if (inputName) localStorage.setItem('profileName', inputName.value);
                if (inputAge) localStorage.setItem('profileAge', inputAge.value);
                if (inputGoal) localStorage.setItem('profileGoal', inputGoal.value);
                loadProfile();
            });
        }

        function updateAdvancedStats() {
            const statBmr = document.getElementById('stat-bmr');
            const statEaten = document.getElementById('stat-eaten');
            const statBurned = document.getElementById('stat-burned');
            const statFinal = document.getElementById('stat-final');
            if (statBmr) statBmr.textContent = Math.round(currentBmr);
            if (statEaten) statEaten.textContent = totalFoodKcal;
            if (statBurned) statBurned.textContent = totalBurned;
            if (statFinal) {
                const finalResult = currentBmr - totalFoodKcal + totalBurned;
                statFinal.textContent = `${Math.round(finalResult)} kcal`;
            }
        }

        const btnBmi = document.getElementById('btn-bmi');
        const resultBmi = document.getElementById('bmi-result');

        if (btnBmi && inputBmiWeight && inputBmiHeight && resultBmi) {
            btnBmi.addEventListener('click', () => {
                const weight = parseFloat(inputBmiWeight.value);
                const height = parseFloat(inputBmiHeight.value) / 100;
                if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
                    resultBmi.style.display = 'block';
                    resultBmi.style.borderLeftColor = 'var(--danger)';
                    resultBmi.innerHTML = '<span style="color: var(--danger);"><i class="fa-solid fa-triangle-exclamation"></i> Wprowadź prawidłowe dane.</span>';
                    return;
                }
                const bmi = (weight / (height * height)).toFixed(2);
                let cat = '', col = '';
                if (bmi < 18.5) { cat = 'Niedowaga'; col = 'var(--accent)'; }
                else if (bmi < 24.9) { cat = 'Waga prawidłowa'; col = 'var(--success)'; }
                else if (bmi < 29.9) { cat = 'Nadwaga'; col = 'var(--warning)'; }
                else { cat = 'Otyłość'; col = 'var(--danger)'; }
                
                resultBmi.style.display = 'block';
                resultBmi.style.borderLeftColor = col;
                resultBmi.innerHTML = `
                    <div style="font-size: 1.25rem; font-weight: 700; color: ${col}; margin-bottom: 0.5rem;">Twoje BMI: ${bmi}</div>
                    <div>Klasyfikacja: <strong>${cat}</strong></div>
                `;
            });
        }

        const btnBmr = document.getElementById('btn-bmr');
        const bmrGender = document.getElementById('bmr-gender');
        const bmrActivity = document.getElementById('bmr-activity');
        const resultBmr = document.getElementById('bmr-result');

        if (btnBmr && bmrGender && bmrActivity && resultBmr && inputBmiWeight && inputBmiHeight && bmrAge) {
            btnBmr.addEventListener('click', () => {
                const w = parseFloat(inputBmiWeight.value);
                const h = parseFloat(inputBmiHeight.value);
                const a = parseInt(bmrAge.value);
                const act = parseFloat(bmrActivity.value);
                if (isNaN(w) || isNaN(h) || isNaN(a) || w <= 0 || h <= 0 || a <= 0) {
                    resultBmr.style.display = 'block';
                    resultBmr.style.borderLeftColor = 'var(--danger)';
                    resultBmr.innerHTML = '<span style="color: var(--danger);"><i class="fa-solid fa-triangle-exclamation"></i> Wpisz wagę i wzrost w sekcji BMI oraz wiek.</span>';
                    return;
                }
                let bmr = (10 * w) + (6.25 * h) - (5 * a);
                bmr += (bmrGender.value === 'male') ? 5 : -161;
                currentBmr = bmr * act;
                
                resultBmr.style.display = 'block';
                resultBmr.style.borderLeftColor = 'var(--accent)';
                resultBmr.innerHTML = `
                    <div style="font-size: 1.25rem; font-weight: 700; color: var(--accent); margin-bottom: 0.5rem;">Zapotrzebowanie Kaloryczne</div>
                    <div style="margin-bottom: 0.25rem;">BMR (Spoczynkowe): <strong>${Math.round(bmr)} kcal</strong></div>
                    <div>TDEE (Z aktywnością): <strong>${Math.round(currentBmr)} kcal</strong></div>
                `;
                updateFoodProgress();
                updateAdvancedStats();
            });
        }

        const btnProgress = document.getElementById('btn-progress');
        const startW = document.getElementById('start-weight');
        const currW = document.getElementById('current-weight');
        const targetW = document.getElementById('target-weight');
        const progFill = document.getElementById('weight-progress-fill');
        const progText = document.getElementById('weight-progress-text');

        if (btnProgress && startW && currW && targetW && progFill && progText) {
            btnProgress.addEventListener('click', () => {
                const s = parseFloat(startW.value);
                const c = parseFloat(currW.value);
                const t = parseFloat(targetW.value);
                if(isNaN(s) || isNaN(c) || isNaN(t)) return;
                
                const totalDiff = Math.abs(s - t);
                const currDiff = Math.abs(s - c);
                if (totalDiff === 0) return;
                
                let perc = (currDiff / totalDiff) * 100;
                if ((s > t && c > s) || (s < t && c < s)) perc = 0;
                if(perc > 100) perc = 100;
                if(perc < 0) perc = 0;

                progFill.style.width = `${perc}%`;
                progText.textContent = `${perc.toFixed(1)}% zrealizowanego celu`;
            });
        }

        const btnMacros = document.getElementById('btn-macros');
        const macroGoal = document.getElementById('macro-goal');
        const resultMacros = document.getElementById('macros-result');

        if (btnMacros && macroGoal && resultMacros && inputBmiWeight) {
            btnMacros.addEventListener('click', () => {
                const w = parseFloat(inputBmiWeight.value);
                if (currentBmr === 0 || isNaN(w)) {
                    resultMacros.style.display = 'block';
                    resultMacros.style.borderLeftColor = 'var(--danger)';
                    resultMacros.innerHTML = '<span style="color: var(--danger);"><i class="fa-solid fa-triangle-exclamation"></i> Najpierw oblicz BMR.</span>';
                    return;
                }
                let tKcal = currentBmr;
                if (macroGoal.value === 'lose') tKcal -= 500;
                else if (macroGoal.value === 'gain') tKcal += 500;

                const p = w * 2;
                const f = w * 1;
                const c = (tKcal - (p * 4) - (f * 9)) / 4;

                resultMacros.style.display = 'block';
                resultMacros.style.borderLeftColor = 'var(--success)';
                resultMacros.innerHTML = `
                    <div style="font-weight: 700; color: var(--success); margin-bottom: 1rem; font-size: 1.1rem;">Cel Kaloryczny: ${Math.round(tKcal)} kcal</div>
                    <div style="display: flex; justify-content: space-between; text-align: center; gap: 0.5rem;">
                        <div style="background: var(--input-bg); padding: 0.75rem 0.5rem; border-radius: 8px; flex: 1; border: 1px solid var(--glass-border);">
                            <div style="color: var(--accent); font-weight: 600; margin-bottom: 0.25rem;">Białko</div><div>${Math.round(p)}g</div>
                        </div>
                        <div style="background: var(--input-bg); padding: 0.75rem 0.5rem; border-radius: 8px; flex: 1; border: 1px solid var(--glass-border);">
                            <div style="color: var(--warning); font-weight: 600; margin-bottom: 0.25rem;">Tłuszcz</div><div>${Math.round(f)}g</div>
                        </div>
                        <div style="background: var(--input-bg); padding: 0.75rem 0.5rem; border-radius: 8px; flex: 1; border: 1px solid var(--glass-border);">
                            <div style="color: var(--success); font-weight: 600; margin-bottom: 0.25rem;">Węgle</div><div>${Math.round(c > 0 ? c : 0)}g</div>
                        </div>
                    </div>
                `;
            });
        }

        const btnFood = document.getElementById('btn-food');
        const fName = document.getElementById('food-name');
        const fKcal = document.getElementById('food-kcal');
        const fList = document.getElementById('food-list');
        
        function updateFoodProgress() {
            const target = currentBmr > 0 ? currentBmr : 2000;
            let perc = (totalFoodKcal / target) * 100;
            const fill = document.getElementById('kcal-progress-fill');
            const text = document.getElementById('kcal-progress-text');
            if (fill) {
                if(perc > 100) {
                    fill.style.width = '100%';
                    fill.style.background = 'var(--danger)';
                } else {
                    fill.style.width = `${perc}%`;
                    fill.style.background = 'var(--gradient)';
                }
            }
            if (text) text.textContent = `Zjedzono: ${totalFoodKcal} / ${Math.round(target)} kcal`;
        }

        if (btnFood && fName && fKcal && fList) {
            btnFood.addEventListener('click', () => {
                const name = fName.value.trim();
                const kcal = parseFloat(fKcal.value);
                if(!name || isNaN(kcal) || kcal <= 0) return;
                
                totalFoodKcal += kcal;
                const li = document.createElement('li');
                li.innerHTML = `<span>${name}</span> <span style="color: var(--accent); font-weight: 600;">${kcal} kcal</span>`;
                fList.appendChild(li);
                
                fName.value = '';
                fKcal.value = '';
                updateFoodProgress();
                updateAdvancedStats();
            });
        }

        const glasses = document.querySelectorAll('.glass-icon');
        const hydStatus = document.getElementById('hydration-status');

        if (glasses.length > 0 && hydStatus) {
            glasses.forEach(g => {
                g.addEventListener('click', () => {
                    const idx = parseInt(g.getAttribute('data-index'));
                    glasses.forEach(gi => {
                        if(parseInt(gi.getAttribute('data-index')) <= idx) {
                            gi.classList.add('filled');
                        } else {
                            gi.classList.remove('filled');
                        }
                    });
                    waterDrank = idx * 250;
                    hydStatus.textContent = `Wypito: ${waterDrank} ml / 2000 ml`;
                });
            });
        }

        const btnSupp = document.getElementById('btn-supplements');
        const suppGoal = document.getElementById('supp-goal');
        const resSupp = document.getElementById('supplements-result');

        if (btnSupp && suppGoal && resSupp) {
            btnSupp.addEventListener('click', () => {
                const goal = suppGoal.value;
                let html = '';
                if(goal === 'mass') {
                    html = `<ul>
                        <li><strong>Kreatyna:</strong> 5g dziennie, codziennie.</li>
                        <li><strong>Odżywka Białkowa:</strong> 30-50g wg braków w diecie.</li>
                        <li><strong>Gainer:</strong> W razie problemów z apetytem.</li>
                        <li><strong>Cytrulina:</strong> 4-6g przed treningiem.</li>
                    </ul>`;
                } else if (goal === 'reduction') {
                    html = `<ul>
                        <li><strong>Odżywka Białkowa:</strong> Pomaga utrzymać sytość.</li>
                        <li><strong>Kofeina/Spalacz:</strong> 200mg przed treningiem.</li>
                        <li><strong>Omega-3 i Witaminy:</strong> Dla uzupełnienia niedoborów.</li>
                        <li><strong>L-Karnityna:</strong> 2g przed treningiem cardio.</li>
                    </ul>`;
                } else {
                    html = `<ul>
                        <li><strong>Omega-3:</strong> 1-2 kapsułki dziennie (EPA+DHA).</li>
                        <li><strong>Witamina D3+K2:</strong> 2000-4000 IU do posiłku.</li>
                        <li><strong>Magnez:</strong> 300-400mg przed snem.</li>
                        <li><strong>Ashwagandha:</strong> Na redukcję stresu.</li>
                    </ul>`;
                }
                resSupp.style.display = 'block';
                resSupp.style.borderLeftColor = 'var(--accent)';
                resSupp.innerHTML = html;
            });
        }

        const tDisp = document.getElementById('timer-display');
        const btnTStart = document.getElementById('btn-timer-start');
        const btnTStop = document.getElementById('btn-timer-stop');
        const btnTReset = document.getElementById('btn-timer-reset');

        function updateTimerDisplay() {
            if (tDisp) {
                const m = Math.floor(timerElapsed / 60).toString().padStart(2, '0');
                const s = (timerElapsed % 60).toString().padStart(2, '0');
                tDisp.textContent = `${m}:${s}`;
            }
        }

        if (btnTStart && btnTStop && btnTReset) {
            btnTStart.addEventListener('click', () => {
                if(!timerRunning) {
                    timerRunning = true;
                    timerInterval = setInterval(() => {
                        timerElapsed++;
                        updateTimerDisplay();
                    }, 1000);
                }
            });

            btnTStop.addEventListener('click', () => {
                timerRunning = false;
                clearInterval(timerInterval);
            });

            btnTReset.addEventListener('click', () => {
                timerRunning = false;
                clearInterval(timerInterval);
                timerElapsed = 0;
                updateTimerDisplay();
            });
        }

        const btnWork = document.getElementById('btn-workout');
        const wType = document.getElementById('workout-type');
        const wAmt = document.getElementById('workout-amount');
        const wList = document.getElementById('workout-list');
        const tBurn = document.getElementById('total-burned');

        if (btnWork && wType && wAmt && wList && tBurn) {
            btnWork.addEventListener('click', () => {
                const a = parseFloat(wAmt.value);
                const k = parseFloat(wType.value);
                const n = wType.options[wType.selectedIndex].text.split(' (')[0];
                if(isNaN(a) || a <= 0) return;
                
                const b = Math.round(a * k);
                totalBurned += b;
                
                const li = document.createElement('li');
                li.innerHTML = `<span>${n} x${a}</span> <span style="color: var(--danger); font-weight: 600;">+${b} kcal</span>`;
                wList.appendChild(li);
                tBurn.textContent = totalBurned;
                wAmt.value = '';
                updateAdvancedStats();
            });
        }

        const btnOneRm = document.getElementById('btn-onerm');
        const inputOneRmWeight = document.getElementById('onerm-weight');
        const inputOneRmReps = document.getElementById('onerm-reps');
        const resultOneRm = document.getElementById('onerm-result');

        if (btnOneRm && inputOneRmWeight && inputOneRmReps && resultOneRm) {
            btnOneRm.addEventListener('click', () => {
                const w = parseFloat(inputOneRmWeight.value);
                const r = parseInt(inputOneRmReps.value);
                if (isNaN(w) || isNaN(r) || w <= 0 || r <= 0) {
                    resultOneRm.style.display = 'block';
                    resultOneRm.style.borderLeftColor = 'var(--danger)';
                    resultOneRm.innerHTML = '<span style="color: var(--danger);"><i class="fa-solid fa-triangle-exclamation"></i> Wprowadź prawidłowe dane.</span>';
                    return;
                }

                const oneRm = w / (1.0278 - (0.0278 * r));
                const max = Math.round(oneRm);

                let html = `<div style="font-size: 1.25rem; font-weight: 700; color: var(--accent); margin-bottom: 1rem;">Twój szacowany 1RM: ${max} kg</div>`;
                html += `<table style="width: 100%; border-collapse: collapse; margin-top: 0.5rem; font-size: 0.95rem;">`;
                html += `<tr style="border-bottom: 1px solid var(--glass-border);">
                    <th style="text-align: left; padding: 0.75rem 0.5rem; color: var(--text-muted);">% 1RM</th>
                    <th style="text-align: right; padding: 0.75rem 0.5rem; color: var(--text-muted);">Ciężar</th>
                </tr>`;
                
                const percentages = [100, 95, 90, 85, 80, 75, 70, 65, 60, 50];
                percentages.forEach(p => {
                    const weight = Math.round(max * (p / 100));
                    html += `<tr style="border-bottom: 1px solid var(--glass-border);">
                        <td style="padding: 0.75rem 0.5rem; font-weight: 600; color: var(--text-main);">${p}%</td>
                        <td style="text-align: right; padding: 0.75rem 0.5rem; color: var(--accent);">${weight} kg</td>
                    </tr>`;
                });
                html += `</table>`;

                resultOneRm.style.display = 'block';
                resultOneRm.style.borderLeftColor = 'var(--accent)';
                resultOneRm.innerHTML = html;
            });
        }
    } catch (e) {}

    try {
        const observerOptions = {
            threshold: 0.05,
            rootMargin: "0px 0px -30px 0px"
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.card').forEach(card => {
            observer.observe(card);
        });
    } catch (e) {
        document.querySelectorAll('.card').forEach(card => card.classList.add('visible'));
    }
});
