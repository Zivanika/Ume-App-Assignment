from django.db import models
from django.contrib.auth.models import User

class Meeting(models.Model):
    STATUS_CHOICES = [
        ("Upcoming", "Upcoming"),
        ("In Review", "In Review"),
        ("Cancelled", "Cancelled"),
        ("Overdue", "Overdue"),
        ("Published", "Published"),
    ]

    agenda = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    date = models.DateField() 
    start_time = models.TimeField()
    meeting_url = models.URLField()
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.agenda
