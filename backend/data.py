from .entities import SemanticLocationHistory


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
