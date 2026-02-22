document.getElementById('profile-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const age = parseInt(document.getElementById('age').value);
    const occupation = document.getElementById('occupation').value;
    const income = parseInt(document.getElementById('income').value);

    const btn = document.querySelector('.primary-btn');
    const originalText = btn.innerHTML;
    
    // Add professional loading spinner to the button
    btn.innerHTML = '<span class="spinner"></span> <span>Verifying...</span>';
    btn.disabled = true;

    // Simulate a slight network delay to make the interaction feel substantial and let the loader show
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
        const response = await fetch('schemes_db.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const allSchemes = await response.json();
        
        // Matching Engine
        const matched = filterSchemes(allSchemes, age, occupation, income);
        
        // Render to DOM with animation cascading
        renderSchemes(matched);
    } catch (error) {
        console.error('Error securely querying schemes:', error);
        const container = document.getElementById('status-message-container');
        container.innerHTML = '<span id="status-message" style="color: #dc2626; font-weight: 500;">Connection failed. Unable to retrieve official scheme data at this time.</span>';
    } finally {
        // Restore button state
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
});

function filterSchemes(schemes, age, occupation, income) {
    const matched = [];
    const occLower = occupation.toLowerCase();
    
    for (const s of schemes) {
        const ageValid = s.age_range.min <= age && age <= s.age_range.max;
        const incomeValid = s.max_income_limit >= income;
        
        // Normalize occupation checks
        const targetOccs = s.target_occupation.map(o => o.toLowerCase());
        
        const occValid = targetOccs.includes('all') || targetOccs.some(t => occLower.includes(t) || t.includes(occLower));
        
        if (ageValid && incomeValid && occValid) {
            matched.push(s);
        }
    }
    return matched;
}

function renderSchemes(schemes) {
    const container = document.getElementById('results-container');
    const msgContainer = document.getElementById('status-message-container');
    
    // Fade out old content
    container.style.opacity = '0';
    
    setTimeout(() => {
        container.innerHTML = ''; // Clear DOM safely
        container.style.opacity = '1';

        if (!schemes || schemes.length === 0) {
            msgContainer.innerHTML = '<span id="status-message" style="color: #b91c1c; font-weight:500;">No central schemes match the demographics provided. Please adjust the criteria.</span>';
            return;
        }

        msgContainer.innerHTML = `<span id="status-message" class="status-success">✓ Eligibility Verified: ${schemes.length} Suitable Scheme(s) Discovered</span>`;

        // Inject cards with a staggered cascade animation
        schemes.forEach((scheme, index) => {
            const listItems = scheme.application_checklist.map(item => `<li>${item}</li>`).join('');

            const card = document.createElement('div');
            card.className = 'scheme-card animate-in';
            // Stagger the animation delay so they pop in sequentially
            card.style.animationDelay = `${index * 0.12}s`;
            
            card.innerHTML = `
                <div class="card-title">${scheme.scheme_name}</div>
                <div class="card-desc">${scheme.description}</div>
                
                <div class="card-checklist-box">
                    <div class="card-checklist-title">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        Mandatory Documents
                    </div>
                    <ul class="card-checklist">
                        ${listItems}
                    </ul>
                </div>
                
                <div class="card-footer">
                    <a href="${scheme.official_link}" target="_blank" class="card-link" rel="noopener noreferrer">
                        Proceed to Official Portal
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                    </a>
                </div>
            `;
            container.appendChild(card);
        });
    }, 200);
}
