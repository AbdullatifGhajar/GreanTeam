from pathlib import Path

from .entities import SemanticLocationHistory

BASE_PATH = Path("Data/Standortverlauf/Semantic Location History")
MONTHS = {
    1: "JANUARY",
    2: "FEBRUARY",
    3: "MARCH",
    4: "APRIL",
    5: "MAY",
    6: "JUNE",
    7: "JULY",
    8: "AUGUST",
    9: "SEPTEMBER",
    10: "OCTOBER",
    11: "NOVEMBER",
    12: "DECEMBER",
}


def get_activities_from_file(filename):
    # Load in Google Location History data.
    with open(filename) as f:
        semantic_location_history = SemanticLocationHistory.from_json(f.read())
    # Select all activities from the data
    activities = []
    for item in semantic_location_history.timelineObjects:
        if item.activitySegment:
            activities.append(item.activitySegment)

    # sort activities by timestamp
    activities.sort(key=lambda x: x.duration.startTimestamp)

    return activities


def get_activities(month, year):
    # get the filename from the month and year
    filename = f"{year}_{MONTHS[month]}.json"
    # get the activities from the file (year)
    activities = get_activities_from_file(BASE_PATH / str(year) / filename)

    return activities


def get_available_period():
    # list all available folders in the base path
    available_folders = [folder for folder in BASE_PATH.iterdir() if folder.is_dir()]
    # sort folders by name
    available_folders.sort(key=lambda x: x.name)
    # get the first file from the first folder and the last file from the last folder
    first_file = next(available_folders[0].iterdir())
    last_file = next(available_folders[-1].iterdir())

    first_year, first_month = first_file.stem.split("_")
    last_year, last_month = last_file.stem.split("_")

    # turn everything to numbers
    first_year = int(first_year)
    last_year = int(last_year)
    first_month = list(MONTHS.keys())[list(MONTHS.values()).index(first_month)]
    last_month = list(MONTHS.keys())[list(MONTHS.values()).index(last_month)]

    return first_month, first_year, last_month, last_year


print(get_available_period())
