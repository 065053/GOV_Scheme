# Welfare Matching Portal Plan

## Project Structure
- `PLAN.md`: Implementation documentation and project overview.
- `schemes_db.json`: JSON file serving as the mock database with government schemes.
- `app.py`: Streamlit-based web application with the engine logic and UI.

## Implementation Details
1. **Data Mocking:**
   - 8 schemes are defined with attributes such as `target_occupation`, `max_income_limit`, `age_range`, and more.
2. **Application Modules:**
   - `load_data()`: Reads the mocked JSON data.
   - `filter_schemes()`: Matching engine returning valid schemes depending on the user's details.
   - `main()`: Streamlit layout with sidebar inputs and main result renderers.
3. **User Flow:**
   - The user inputs Age, Occupation, and Income on the sidebar.
   - The engine dynamically displays eligible schemes.
