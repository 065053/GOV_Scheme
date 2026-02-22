document.getElementById('profile-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const age = parseInt(document.getElementById('age').value);
    const occupation = document.getElementById('occupation').value;
    const income = parseInt(document.getElementById('income').value);

    const btn = document.querySelector('.primary-btn');
    btn.textContent = 'Searching...';
    btn.disabled = true;

    try {
        // Fetch the raw JSON directly instead of making an API call to a backend
        const response = await fetch('schemes_db.json');
        const allSchemes = await response.json();
        
        // Run the matching engine purely on the frontend
        const matched = filterSchemes(allSchemes, age, occupation, income);
        
        // Render the results
        renderSchemes(matched);
    } catch (error) {
        console.error('Error fetching schemes:', error);
        document.getElementById('status-message').innerHTML = '<span style="color: #EF4444;">Failed to load schemes database.</span>';
    } finally {
        btn.textContent = 'Find Matches';
        btn.disabled = false;
    }
});

// The matching engine logic translated to JavaScript
function filterSchemes(schemes, age, occupation, income) {
    const matched = [];
    const occLower = occupation.toLowerCase();
    
    for (const s of schemes) {
        const ageValid = s.age_range.min <= age && age <= s.age_range.max;
        const incomeValid = s.max_income_limit >= income;
        
        const targetOccs = s.target_occupation.map(o => o.toLowerCase());
        const occValid = targetOccs.includes('all') || targetOccs.includes(occLower);
        
        if (ageValid && incomeValid && occValid) {
            matched.push(s);
        }
    }
    return matched;
}

function renderSchemes(schemes) {
    const container = document.getElementById('results-container');
    const headerMsg = document.getElementById('status-message');
    
    container.innerHTML = ''; // Clear previous

    if (!document.getElementById('age').value) {
        return;
    }

    if (!schemes || schemes.length === 0) {
        headerMsg.innerHTML = '<span style="color: #F87171;">No schemes currently match your profile. Try adjusting your details.</span>';
        return;
    }

    headerMsg.innerHTML = `<span style="color: #10B981;">Found ${schemes.length} suitable scheme(s) based on your profile!</span>`;

    schemes.forEach(scheme => {
        const listItems = scheme.application_checklist.map(item => `<li>${item}</li>`).join('');

        const card = document.createElement('div');
        card.className = 'scheme-card';
        card.innerHTML = `
            <div class="card-title">${scheme.scheme_name}</div>
            <div class="card-desc">${scheme.description}</div>
            <div class="card-checklist-title">Required Documents:</div>
            <ul class="card-checklist">
                ${listItems}
            </ul>
            <a href="${scheme.official_link}" target="_blank" class="card-link" rel="noopener noreferrer">
                Go to Official Portal →
            </a>
        `;
        container.appendChild(card);
    });
}
