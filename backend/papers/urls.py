from django.urls import path
from . import views

urlpatterns = [
    path('',                          views.list_papers,       name='papers-list'),
    path('upload/',                   views.upload_paper,      name='papers-upload'),
    path('<int:pk>/',                 views.paper_detail,      name='papers-detail'),
    path('<int:pk>/summarize/',       views.summarize_paper,   name='papers-summarize'),
    path('<int:pk>/insights/',        views.extract_insights,  name='papers-insights'),
    path('search/',                   views.search_papers,     name='papers-search'),
    path('chat/',                     views.chat_with_paper,   name='papers-chat'),
    path('<int:pk>/delete/',          views.delete_paper,      name='papers-delete'),
]
