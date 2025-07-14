from django.shortcuts import render

# Create your views here.
# Custom Imports
from tracker import serializers as tracker_serializer
from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Category, Transaction, BudgetGoal, Profile, User
from .serializers import (
    RegisterSerializer,
    ProfileSerializer,
    CategorySerializer,
    TransactionSerializer,
    BudgetGoalSerializer
)
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Sum
from datetime import timedelta, date, datetime
from rest_framework.decorators import api_view, permission_classes
import calendar

# This code defines a DRF View class called MyTokenObtainPairView, which inherits from TokenObtainPairView.
class MyTokenObtainPairView(TokenObtainPairView):
    # Here, it specifies the serializer class to be used with this view.
    serializer_class = tracker_serializer.MyTokenObtainPairSerializer

# 1. User Registration
class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

# 2. Profile View/Update (Current User)
class ProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProfileSerializer

    def get_object(self):
        user = self.request.user
        if not hasattr(user, 'profile'):
            Profile.objects.create(user=user)
        return user.profile

# 3. Category List & Create
class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

# 4. Transaction List & Create
class TransactionListCreateView(generics.ListCreateAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user).order_by('-date')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# 5. Transaction Detail (Retrieve, Update, Delete)
class TransactionDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)

# 6. Budget Goal List & Create
class BudgetGoalListCreateView(generics.ListCreateAPIView):
    serializer_class = BudgetGoalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return BudgetGoal.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# 7. Budget Goal Detail (Retrieve, Update, Delete)
class BudgetGoalDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BudgetGoalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return BudgetGoal.objects.filter(user=self.request.user)
    

class DashboardSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        transactions = Transaction.objects.filter(user=user).order_by('-date')[:5]
        summary = {
            "income": Transaction.objects.filter(user=user, type='income').aggregate(total=Sum('amount'))['total'] or 0,
            "expense": Transaction.objects.filter(user=user, type='expense').aggregate(total=Sum('amount'))['total'] or 0,
        }

        chart_data = []
        today = date.today()
        for i in range(6, -1, -1):  # last 7 days
            day = today - timedelta(days=i)
            income = Transaction.objects.filter(user=user, type='income', date=day).aggregate(Sum('amount'))['amount__sum'] or 0
            expense = Transaction.objects.filter(user=user, type='expense', date=day).aggregate(Sum('amount'))['amount__sum'] or 0
            chart_data.append({"label": day.strftime("%a"), "income": income, "expense": expense})

        recent_transactions = [
            {
                "id": tx.id,
                "amount": tx.amount,
                "type": tx.type,
                "category_name": tx.category.name if tx.category else "Uncategorized",
                "date": tx.date,
            }
            for tx in transactions
        ]

        return Response({
            "summary": summary,
            "chart_data": chart_data,
            "recent_transactions": recent_transactions,
        })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_summary(request):
    user = request.user
    today = date.today()
    this_month = today.month
    this_year = today.year

    income = Transaction.objects.filter(user=user, type='income', date__month=this_month, date__year=this_year).aggregate(Sum('amount'))['amount__sum'] or 0
    expense = Transaction.objects.filter(user=user, type='expense', date__month=this_month, date__year=this_year).aggregate(Sum('amount'))['amount__sum'] or 0
    balance = income - expense

    return Response({
        'income': float(income),
        'expense': float(expense),
        'balance': float(balance),
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_insights(request):
    user = request.user
    today = date.today()
    this_month = today.month
    this_year = today.year
    this_week = today - timedelta(days=today.weekday())  # Monday

    # 1. Compare this week vs last week
    last_week = this_week - timedelta(days=7)
    this_week_exp = Transaction.objects.filter(user=user, type='expense', date__gte=this_week).aggregate(Sum('amount'))['amount__sum'] or 0
    last_week_exp = Transaction.objects.filter(user=user, type='expense', date__gte=last_week, date__lt=this_week).aggregate(Sum('amount'))['amount__sum'] or 0

    insight1 = ""
    if last_week_exp > 0:
        change = ((this_week_exp - last_week_exp) / last_week_exp) * 100
        if abs(change) > 15:
            insight1 = f"You spent {abs(change):.1f}% {'more' if change > 0 else 'less'} this week compared to last week."

    # 2. Monthly expense vs income
    month_income = Transaction.objects.filter(user=user, type='income', date__month=this_month).aggregate(Sum('amount'))['amount__sum'] or 0
    month_expense = Transaction.objects.filter(user=user, type='expense', date__month=this_month).aggregate(Sum('amount'))['amount__sum'] or 0

    insight2 = ""
    if month_income > 0 and (month_expense / month_income) >= 0.75:
        insight2 = f"Your expense this month has reached {month_expense / month_income * 100:.0f}% of your income."

    # 3. Top category
    top_category = (
        Transaction.objects
        .filter(user=user, type='expense', date__month=this_month)
        .values('category__name')
        .annotate(total=Sum('amount'))
        .order_by('-total')
        .first()
    )

    insight3 = ""
    if top_category:
        insight3 = f"Your top spending category this month is '{top_category['category__name']}'."

    insights = list(filter(None, [insight1, insight2, insight3]))
    return Response({"insights": insights})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def category_spending_chart(request):
    user = request.user
    data = (
        Transaction.objects.filter(user=user, type='expense')
        .values('category__name')
        .annotate(total=Sum('amount'))
        .order_by('-total')
    )
    return Response([
        {'category': item['category__name'], 'amount': float(item['total'])}
        for item in data if item['category__name']
    ])

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def monthly_expense_chart(request):
    user = request.user
    year = datetime.now().year
    data = (
        Transaction.objects.filter(user=user, type='expense', date__year=year)
        .values('date__month')
        .annotate(total=Sum('amount'))
        .order_by('date__month')
    )
    return Response([
        {'month': calendar.month_abbr[item['date__month']], 'amount': float(item['total'])}
        for item in data
    ])

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def category_vs_budget(request):
    user = request.user
    goals = BudgetGoal.objects.filter(user=user)

    result = []
    for goal in goals:
        spent = Transaction.objects.filter(
            user=user,
            type='expense',
            category=goal.category,
            date__month=date.today().month
        ).aggregate(Sum('amount'))['amount__sum'] or 0

        result.append({
            'category': goal.category.name,
            'budget': float(goal.monthly_limit),
            'spent': float(spent)
        })

    return Response(result)
