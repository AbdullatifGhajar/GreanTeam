import json
from datetime import datetime
from typing import List, Optional


class SourceInfo:
    def __init__(self, deviceTag: int = None):
        self.deviceTag = deviceTag

class Location:
    def __init__(self, latitudeE7: int = None, longitudeE7: int = None, placeId: str = None, 
                 address: str = None, name: Optional[str] = None, semanticType: Optional[str] = None, 
                 sourceInfo: SourceInfo = None, locationConfidence: float = None, 
                 calibratedProbability: float = None):
        self.latitudeE7 = latitudeE7
        self.longitudeE7 = longitudeE7
        self.placeId = placeId
        self.address = address
        self.name = name
        self.semanticType = semanticType
        self.sourceInfo = sourceInfo
        self.locationConfidence = locationConfidence
        self.calibratedProbability = calibratedProbability
        
    def __str__(self) -> str:
        return f"{self.name if self.name else ''} ({self.latitudeE7 / 10000000.0}, {self.longitudeE7 / 10000000.0})"

class Duration:
    def __init__(self, startTimestamp: str = None, endTimestamp: str = None):
        self.startTimestamp = datetime.fromisoformat(startTimestamp.replace("Z", "+00:00")) if startTimestamp else None
        self.endTimestamp = datetime.fromisoformat(endTimestamp.replace("Z", "+00:00")) if endTimestamp else None
        self.value = self.endTimestamp - self.startTimestamp if startTimestamp and endTimestamp else None 

class PlaceVisit:
    def __init__(self, location: Location = None, duration: Duration = None, placeConfidence: str = None, 
                 centerLatE7: int = None, centerLngE7: int = None, visitConfidence: int = None, 
                 otherCandidateLocations: List[Location] = None, editConfirmationStatus: str = None, 
                 locationConfidence: int = None, placeVisitType: str = None, 
                 placeVisitImportance: str = None):
        self.location = location
        self.duration = duration
        self.placeConfidence = placeConfidence
        self.centerLatE7 = centerLatE7
        self.centerLngE7 = centerLngE7
        self.visitConfidence = visitConfidence
        self.otherCandidateLocations = otherCandidateLocations
        self.editConfirmationStatus = editConfirmationStatus
        self.locationConfidence = locationConfidence
        self.placeVisitType = placeVisitType
        self.placeVisitImportance = placeVisitImportance

class Activity:
    def __init__(self, activityType: str = None, probability: float = None):
        self.activityType = activityType
        self.probability = probability

class ActivitySegment:
    def __init__(self, startLocation: Location = None, endLocation: Location = None, duration: Duration = None, 
                 distance: int = None, activityType: str = None, confidence: str = None, 
                 activities: List[Activity] = None):
        self.startLocation = startLocation
        self.endLocation = endLocation
        self.duration = duration
        self.distance = distance
        self.activityType = activityType
        self.confidence = confidence
        self.activities = activities

class TimelineObject:
    def __init__(self, placeVisit: Optional[PlaceVisit] = None, 
                 activitySegment: Optional[ActivitySegment] = None):
        self.placeVisit = placeVisit
        self.activitySegment = activitySegment

class SemanticLocationHistory:
    def __init__(self, timelineObjects: List[TimelineObject] = None):
        self.timelineObjects = timelineObjects

    @classmethod
    def from_json(cls, jsonStr: str):
        data = json.loads(jsonStr)
        timelineObjects = []

        for obj in data["timelineObjects"]:
            placeVisit = None
            activitySegment = None

            if "placeVisit" in obj:
                pv = obj["placeVisit"]
                location = Location(**pv.get("location", {}))
                duration = Duration(**pv.get("duration", {}))
                otherCandidateLocations = [Location(**loc) for loc in pv.get("otherCandidateLocations", [])]
                placeVisit = PlaceVisit(location, duration, pv.get("placeConfidence"), pv.get("centerLatE7"), 
                                         pv.get("centerLngE7"), pv.get("visitConfidence"), otherCandidateLocations, 
                                         pv.get("editConfirmationStatus"), pv.get("locationConfidence"), 
                                         pv.get("placeVisitType"), pv.get("placeVisitImportance"))

            if "activitySegment" in obj:
                asg = obj["activitySegment"]
                startLocation = Location(**asg.get("startLocation", {}))
                endLocation = Location(**asg.get("endLocation", {}))
                duration = Duration(**asg.get("duration", {}))
                activities = [Activity(**act) for act in asg.get("activities", [])]
                activitySegment = ActivitySegment(startLocation, endLocation, duration, asg.get("distance"), 
                                                   asg.get("activityType"), asg.get("confidence"), activities)

            timelineObjects.append(TimelineObject(placeVisit, activitySegment))

        return cls(timelineObjects)
