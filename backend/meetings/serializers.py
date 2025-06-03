from rest_framework import serializers
from .models import Meeting

class MeetingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meeting
        fields = [
            'id',
            'agenda',
            'description',
            'status',
            'date',
            'start_time',
            'meeting_url',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']
