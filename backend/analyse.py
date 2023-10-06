import math

from .data import get_activities_from_file
from .entities import ActivitySegment, Location

GOOGLE_LOCATION_FILENAME = 'Data/Standortverlauf/Semantic Location History/2023/2023_APRIL.json'

activities: list[ActivitySegment] = get_activities_from_file(GOOGLE_LOCATION_FILENAME)

# sort activities by timestamp
activities.sort(key=lambda x: x.duration.startTimestamp)

# group activities by day
activities_by_day = {}
for activity in activities:
    day = activity.duration.startTimestamp.date()
    if day not in activities_by_day:
        activities_by_day[day] = []
    activities_by_day[day].append(activity)
    
# trips
def is_same_location(location1: Location, location2: Location):
    if location1.name and location2.name:
        return location1.name == location2.name
    
    THRESHOLD = 50000 # TODO: find a good value
    return math.sqrt((location1.latitudeE7 - location2.latitudeE7)**2 + \
           (location1.longitudeE7 - location2.longitudeE7)**2) < THRESHOLD

class Trip:
    def __init__(self, activity: ActivitySegment):
        self.activities = [activity]
    
    def has_multiple_activities(self):
        return len(self.activities) > 1        
        
def is_activity_the_same_trip(activity: ActivitySegment, trip: Trip):
    return is_same_location(activity.startLocation, trip.activities[0].startLocation) and \
              is_same_location(activity.endLocation, trip.activities[0].endLocation)

trips = []

count_same = 0  
count_dif = 0  

for activity in activities:
    for trip in trips:
        if is_activity_the_same_trip(activity, trip):
            count_same += 1
            trip.activities.append(activity)
            break
    else:
        trips.append(Trip(activity))
        count_dif += 1
            
print("same: ", count_same)
print("different: ", count_dif)

for trip in trips:
    if trip.has_multiple_activities():
        print("Trip: ")
        for activity in trip.activities:
            print(activity.startLocation, "->", activity.endLocation, activity.activityType, "with", activity.confidence, "confidence")