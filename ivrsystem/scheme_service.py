from data import SCHEMES

def get_schemes(region: str, gender: str, scheme_type: str) -> list:
    """Get filtered schemes based on user preferences"""
    schemes = SCHEMES.get(scheme_type, {}).get(region, [])
    
    # Add women-specific schemes for female users
    if gender == "female" and scheme_type != "women":
        women_schemes = SCHEMES.get("women", {}).get(region, [])
        schemes.extend(women_schemes[:1])
    
    return schemes[:3]  # Return top 3 schemes