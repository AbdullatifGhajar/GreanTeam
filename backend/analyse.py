import math

from .data import get_activities
from .entities import ActivitySegment, Location
from .map import reverse_geocode


# trips
def is_same_location(location1: Location, location2: Location):
    if location1.name and location2.name:
        return location1.name == location2.name

    THRESHOLD = 50000  # TODO: find a good value
    return (
        math.sqrt(
            (location1.latitudeE7 - location2.latitudeE7) ** 2
            + (location1.longitudeE7 - location2.longitudeE7) ** 2
        )
        < THRESHOLD
    )


class Trip:
    REGULAR_TRIP_THRESHOLD = 4

    def __init__(self, activity: ActivitySegment):
        self.activities: list[ActivitySegment] = [activity]
        self.nr_2 = 0
        self.nr_1 = 0

    def has_multiple_activities(self):
        return len(self.activities) > 1

    def is_regular_trip(self):
        return len(self.activities) >= Trip.REGULAR_TRIP_THRESHOLD

    def mean_distance(self):
        return sum([activity.distance for activity in self.activities]) / len(
            self.activities
        )

    def bad_transportation(self):
        return len(self.activities) - (self.nr_1 + self.nr_2)


def is_activity_the_same_trip(activity: ActivitySegment, trip: Trip):
    return is_same_location(
        activity.startLocation, trip.activities[0].startLocation
    ) and is_same_location(activity.endLocation, trip.activities[0].endLocation)


class HabitsPoints:
    def __init__(
        self, trip: Trip = None, activityPoints: int = None, co2_saved: int = None
    ):
        self.trip = trip
        self.activityPoints = activityPoints
        self.co2_saved = co2_saved


def import_trips(month, year) -> list[Trip]:
    activities: list[ActivitySegment] = get_activities(month, year)

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

    return trips


co2_car_per_meter = 0.17
co2_bus_per_meter = 0.097
co2_rail_per_meter = 0.035
co2_tram_per_meter = 0.029


def get_trip_points(month, year):
    def calculate_user_points(max_points: int, activity_points: int):
        percentage = activity_points / max_points
        return int(200 * percentage)

    trips = import_trips(month, year)
    trip_points: list[HabitsPoints] = []

    for trip in trips:
        if not trip.is_regular_trip():
            continue
        max_points = len(trip.activities) * 2.0
        activity_points = 0.0
        saved_co2 = 0
        nr_2 = 0
        nr_1 = 0

        print("Trip:")
        for activity in trip.activities:
            print(
                activity.startLocation,
                "->",
                activity.endLocation,
                activity.activityType,
                "with",
                activity.confidence,
                "confidence",
                activity.distance,
                "distance",
            )
            if (
                activity.activityType == "WALKING"
                or activity.activityType == "CYCLING"
                or activity.activityType == "RUNNING"
            ):
                activity_points += 2
                saved_co2 += co2_car_per_meter * activity.distance
                nr_2 += 1
                print("saved co2: ", saved_co2)
                # add saved co2 based on distance between start and end location & mode of transportation compared to petrol car
            elif activity.activityType == "IN_BUS":
                saved_co2 += activity.distance * (co2_car_per_meter - co2_bus_per_meter)
                activity_points += 1
                nr_1 += 1
            elif activity.activityType == "IN_TRAIN":
                saved_co2 += activity.distance * (
                    co2_car_per_meter - co2_rail_per_meter
                )
                activity_points += 1
                nr_1 += 1
            elif activity.activityType == "VEHICLE IN_TRAM":
                saved_co2 += activity.distance * (
                    co2_car_per_meter - co2_tram_per_meter
                )
                activity_points += 1
                nr_1 += 1
        # add start and end location of the first activity, duration and user points
        trip.nr_2 = nr_2
        trip.nr_1 = nr_1
        trip_points.append(
            HabitsPoints(
                trip, calculate_user_points(max_points, activity_points), int(saved_co2)
            )
        )

    return trip_points


# print("-----")
# print("-----")
# print("-----")
# print("-----")

# for trip in trip_points:
#     print(
#         trip.trip.activities[0].startLocation,
#         "->",
#         trip.trip.activities[0].endLocation,
#         "->",
#         trip.trip.activities[0].distance,
#         "->",
#         trip.activityPoints,
#     )


def get_overview(month, year):
    trip_points = get_trip_points(month, year)

    point_sum = sum([trip.activityPoints for trip in trip_points])
    print("point_sum: ", point_sum)
    return {
        "year": year,
        "month": month,
        "points": point_sum,
        "trips": [
            {
                "distance": int(trip_point.trip.mean_distance()),
                "start": reverse_geocode(
                    trip_point.trip.activities[0].startLocation.latitudeE7 / 1e7,
                    trip_point.trip.activities[0].startLocation.longitudeE7 / 1e7,
                ),
                "end": reverse_geocode(
                    trip_point.trip.activities[0].endLocation.latitudeE7 / 1e7,
                    trip_point.trip.activities[0].endLocation.longitudeE7 / 1e7,
                ),
                "points": trip_point.activityPoints,
                "saved_co2_in_g": trip_point.co2_saved,
                "nr_of_activities": len(trip_point.trip.activities),
                "amount_walk_bike_run": trip_point.trip.nr_2,
                "amount_rail_bus_tram": trip_point.trip.nr_1,
                "amount_car": trip_point.trip.bad_transportation(),
            }
            for trip_point in trip_points
        ],
    }
