import json
import math
from typing import Dict, List, Any

class EligibilityCalculator:
    def __init__(self):
        self.subject_weights = {
            'Mathematics': 0.3,
            'English': 0.25,
            'Physical Sciences': 0.2,
            'Life Sciences': 0.15,
            'Other': 0.1
        }
        
        self.course_requirements = {
            'Engineering': {
                'Mathematics': 70,
                'Physical Sciences': 70,
                'English': 60,
                'minimum_aps': 35
            },
            'Medicine': {
                'Mathematics': 75,
                'Physical Sciences': 75,
                'Life Sciences': 75,
                'English': 70,
                'minimum_aps': 42
            },
            'Commerce': {
                'Mathematics': 65,
                'English': 60,
                'minimum_aps': 30
            },
            'Science': {
                'Mathematics': 70,
                'Physical Sciences': 65,
                'English': 60,
                'minimum_aps': 32
            },
            'Humanities': {
                'English': 65,
                'minimum_aps': 28
            }
        }

    def calculate_aps_score(self, qualifications: List[Dict]) -> int:
        """Calculate Admission Point Score (APS) based on Grade 12 marks"""
        total_points = 0
        subject_count = 0
        
        for qual in qualifications:
            if qual.get('subject') and qual.get('mark'):
                mark = int(qual['mark'])
                # Convert percentage to APS points (7-point scale)
                if mark >= 80:
                    points = 7
                elif mark >= 70:
                    points = 6
                elif mark >= 60:
                    points = 5
                elif mark >= 50:
                    points = 4
                elif mark >= 40:
                    points = 3
                elif mark >= 30:
                    points = 2
                else:
                    points = 1
                
                total_points += points
                subject_count += 1
        
        return total_points

    def check_course_eligibility(self, qualifications: List[Dict], course_field: str) -> Dict:
        """Check if student meets requirements for a specific course field"""
        if course_field not in self.course_requirements:
            return {'eligible': False, 'reason': 'Course field not found'}
        
        requirements = self.course_requirements[course_field]
        aps_score = self.calculate_aps_score(qualifications)
        
        # Create subject lookup
        subject_marks = {}
        for qual in qualifications:
            subject = qual.get('subject', '')
            mark = int(qual.get('mark', 0))
            
            # Normalize subject names
            if 'Mathematics' in subject:
                subject_marks['Mathematics'] = mark
            elif 'English' in subject:
                subject_marks['English'] = mark
            elif 'Physical Sciences' in subject:
                subject_marks['Physical Sciences'] = mark
            elif 'Life Sciences' in subject:
                subject_marks['Life Sciences'] = mark
        
        # Check each requirement
        missing_requirements = []
        met_requirements = []
        
        for subject, min_mark in requirements.items():
            if subject == 'minimum_aps':
                if aps_score >= min_mark:
                    met_requirements.append(f"APS Score: {aps_score}/{min_mark}")
                else:
                    missing_requirements.append(f"APS Score too low: {aps_score}/{min_mark}")
            else:
                student_mark = subject_marks.get(subject, 0)
                if student_mark >= min_mark:
                    met_requirements.append(f"{subject}: {student_mark}%/{min_mark}%")
                else:
                    missing_requirements.append(f"{subject}: {student_mark}%/{min_mark}% required")
        
        eligible = len(missing_requirements) == 0
        
        return {
            'eligible': eligible,
            'aps_score': aps_score,
            'met_requirements': met_requirements,
            'missing_requirements': missing_requirements,
            'match_percentage': max(0, 100 - (len(missing_requirements) * 20))
        }

    def calculate_university_match(self, qualifications: List[Dict], preferences: Dict) -> Dict:
        """Calculate overall university match based on qualifications and preferences"""
        
        # Calculate base academic score
        total_marks = sum(int(q.get('mark', 0)) for q in qualifications if q.get('mark'))
        subject_count = len([q for q in qualifications if q.get('mark')])
        average_mark = total_marks / subject_count if subject_count > 0 else 0
        
        # Academic score (40% of total)
        academic_score = min(average_mark * 0.4, 40)
        
        # APS score contribution (30% of total)
        aps_score = self.calculate_aps_score(qualifications)
        aps_contribution = min((aps_score / 42) * 30, 30)  # 42 is maximum APS
        
        # Preference alignment (30% of total)
        preference_score = 0
        if preferences.get('career_field'):
            preference_score += 10
        if preferences.get('location_preference'):
            preference_score += 10
        if preferences.get('study_mode'):
            preference_score += 10
        
        total_score = academic_score + aps_contribution + preference_score
        
        return {
            'overall_match': min(total_score, 100),
            'academic_score': academic_score,
            'aps_score': aps_score,
            'aps_contribution': aps_contribution,
            'preference_score': preference_score,
            'average_mark': average_mark
        }

    def get_course_recommendations(self, qualifications: List[Dict], preferences: Dict) -> List[Dict]:
        """Get recommended courses based on qualifications and preferences"""
        recommendations = []
        
        career_field = preferences.get('career_field', '')
        
        # Map career interests to course fields
        field_mapping = {
            'Engineering & Technology': 'Engineering',
            'Health Sciences': 'Medicine',
            'Business & Commerce': 'Commerce',
            'Natural Sciences': 'Science',
            'Arts & Humanities': 'Humanities'
        }
        
        course_field = field_mapping.get(career_field, 'Science')
        
        # Check eligibility for preferred field
        eligibility = self.check_course_eligibility(qualifications, course_field)
        
        if eligibility['eligible']:
            recommendations.append({
                'field': course_field,
                'match_score': eligibility['match_percentage'],
                'status': 'Highly Recommended',
                'requirements_met': eligibility['met_requirements']
            })
        
        # Check other fields as alternatives
        for field in self.course_requirements.keys():
            if field != course_field:
                alt_eligibility = self.check_course_eligibility(qualifications, field)
                if alt_eligibility['eligible']:
                    recommendations.append({
                        'field': field,
                        'match_score': alt_eligibility['match_percentage'],
                        'status': 'Alternative Option',
                        'requirements_met': alt_eligibility['met_requirements']
                    })
        
        # Sort by match score
        recommendations.sort(key=lambda x: x['match_score'], reverse=True)
        
        return recommendations

# Example usage
def analyze_student_profile(qualifications_data: str, preferences_data: str) -> str:
    """Main function to analyze student profile and return recommendations"""
    
    calculator = EligibilityCalculator()
    
    try:
        qualifications = json.loads(qualifications_data)
        preferences = json.loads(preferences_data)
        
        # Calculate university match
        university_match = calculator.calculate_university_match(qualifications, preferences)
        
        # Get course recommendations
        course_recommendations = calculator.get_course_recommendations(qualifications, preferences)
        
        # Generate insights
        insights = []
        avg_mark = university_match['average_mark']
        
        if avg_mark >= 80:
            insights.append("Excellent academic performance! You qualify for top-tier universities and competitive programs.")
        elif avg_mark >= 70:
            insights.append("Strong academic performance opens doors to most university programs.")
        elif avg_mark >= 60:
            insights.append("Good academic foundation. Consider strengthening key subjects for better opportunities.")
        else:
            insights.append("Focus on improving academic performance. Consider bridging courses or alternative pathways.")
        
        if university_match['aps_score'] >= 35:
            insights.append("Your APS score qualifies you for most university programs.")
        else:
            insights.append("Consider improving your APS score through supplementary exams if needed.")
        
        results = {
            'university_match': university_match,
            'course_recommendations': course_recommendations,
            'insights': insights,
            'aps_score': university_match['aps_score']
        }
        
        return json.dumps(results, indent=2)
        
    except Exception as e:
        return json.dumps({'error': str(e)})

# Test the calculator
if __name__ == "__main__":
    # Sample data for testing
    sample_qualifications = [
        {'subject': 'Mathematics', 'mark': '85'},
        {'subject': 'English Home Language', 'mark': '78'},
        {'subject': 'Physical Sciences', 'mark': '82'},
        {'subject': 'Life Sciences', 'mark': '75'},
        {'subject': 'Geography', 'mark': '70'},
        {'subject': 'Life Orientation', 'mark': '80'}
    ]
    
    sample_preferences = {
        'career_fiel  'Life Orientation', 'mark': '80'}
    ]
    
    sample_preferences = {
        'career_field': 'Engineering & Technology',
        'location_preference': 'Gauteng',
        'study_mode': 'Full-time on campus',
        'financial_aid': 'Yes'
    }
    
    result = analyze_student_profile(
        json.dumps(sample_qualifications),
        json.dumps(sample_preferences)
    )
    
    print("Analysis Results:")
    print(result)
