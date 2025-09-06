from enum import Enum

class Language(str, Enum):
    ENGLISH = "en"
    HINDI = "hi"

class Region(str, Enum):
    NORTH = "north"
    SOUTH = "south" 
    EAST = "east"
    WEST = "west"
    CENTRAL = "central"

class Gender(str, Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"

class SchemeType(str, Enum):
    AGRICULTURE = "agriculture"
    EDUCATION = "education"
    HEALTHCARE = "healthcare"
    EMPLOYMENT = "employment"
    HOUSING = "housing"
    WOMEN = "women"