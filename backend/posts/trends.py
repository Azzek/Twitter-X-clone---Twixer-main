from . import models

def create_trends_for_words(words):
    for word in words:
        if word[0] == '#':
            trend, created = models.Trend.objects.get_or_create(name=word)
            if created:
                trend.count = 1
            else:
                trend.count += 1
            trend.save()
