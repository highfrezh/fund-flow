from django.contrib import admin

# Register your models here.
from tracker import models as tracker

from django.contrib import admin

admin.site.register(tracker.User)
admin.site.register(tracker.Profile)
admin.site.register(tracker.Category)
admin.site.register(tracker.Transaction)
admin.site.register(tracker.BudgetGoal)