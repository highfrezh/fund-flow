from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from tracker import views as tracker_views

urlpatterns = [
    # Userauths API Endpoints
    path('token/', tracker_views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('register/', tracker_views.RegisterView.as_view(), name='register'),
    path('profile/', tracker_views.ProfileView.as_view(), name='profile'),
    
    path('categories/', tracker_views.CategoryListCreateView.as_view(), name='category-list-create'),

    path('transactions/', tracker_views.TransactionListCreateView.as_view(), name='transaction-list-create'),
    path('transactions/<int:pk>/', tracker_views.TransactionDetailView.as_view(), name='transaction-detail'),

    path('dashboard/insights/', tracker_views.dashboard_insights, name='dashboard-insights'),
    path("dashboard/summary/", tracker_views.dashboard_summary, name='dashboard summary'),
    path('dashboard/chart/category/', tracker_views.category_spending_chart),
    path('dashboard/chart/monthly/', tracker_views.monthly_expense_chart),
    path('dashboard/chart/budget-vs-spend/', tracker_views.category_vs_budget),



    path('budget-goals/', tracker_views.BudgetGoalListCreateView.as_view(), name='budgetgoal-list-create'),
    path('budget-goals/<int:pk>/', tracker_views.BudgetGoalDetailView.as_view(), name='budgetgoal-detail'),
    

]# Note: The above urlpatterns are for the API endpoints.
# They are used to route requests to the appropriate views in the Django application.