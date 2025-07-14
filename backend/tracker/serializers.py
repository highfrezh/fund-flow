from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from tracker import models as tracker_models

# Define a custom serializer that inherits from TokenObtainPairSerializer
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    '''
    class MyTokenObtainPairSerializer(TokenObtainPairSerializer):: This line creates a new token serializer called MyTokenObtainPairSerializer that is based on an existing one called TokenObtainPairSerializer. Think of it as customizing the way tokens work.
    @classmethod: This line indicates that the following function is a class method, which means it belongs to the class itself and not to an instance (object) of the class.
    def get_token(cls, user):: This is a function (or method) that gets called when we want to create a token for a user. The user is the person who's trying to access something on the website.
    token = super().get_token(user): Here, it's asking for a regular token from the original token serializer (the one it's based on). This regular token is like a key to enter the website.
    token['full_name'] = user.full_name, token['email'] = user.email, token['username'] = user.username: This code is customizing the token by adding extra information to it. For example, it's putting the user's full name, email, and username into the token. These are like special notes attached to the key.
    return token: Finally, the customized token is given back to the user. Now, when this token is used, it not only lets the user in but also carries their full name, email, and username as extra information, which the website can use as needed.
    '''
    @classmethod
    # Define a custom method to get the token for a user
    def get_token(cls, user):
        # Call the parent class's get_token method
        token = super().get_token(user)

        # Add custom claims to the token
        token['full_name'] = user.full_name
        token['email'] = user.email
        token['username'] = user.username

        # Return the token with custom claims
        return token

# 1. User Registration Serializer
class RegisterSerializer(serializers.ModelSerializer):
    # Define fields for the serializer, including password and password2
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        # Specify the model that this serializer is associated with
        model = tracker_models.User
        # Define the fields from the model that should be included in the serializer
        fields = ('username','full_name', 'email',  'password', 'password2')

    def validate(self, attrs):
        # Define a validation method to check if the passwords match
        if attrs['password'] != attrs['password2']:
            # Raise a validation error if the passwords don't match
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        attrs.pop('password2')  # remove it before create()
        # Return the validated attributes
        return attrs

    def create(self, validated_data):
        # Define a method to create a new user based on validated data
        user = tracker_models.User.objects.create(
            full_name=validated_data['full_name'],
            email=validated_data['email'],
            username = validated_data['username']
        )
        # email_username = user.email.split('@')
        # user.username = email_username

        # Set the user's password based on the validated data
        user.set_password(validated_data['password'])
        user.save()

        # Return the created user
        return user

# 2. Profile Serializer
# class ProfileSerializer(serializers.ModelSerializer):
#     user_email = serializers.EmailField(source='user.email', read_only=True)

#     class Meta:
#         model = tracker_models.Profile
#         fields = ['user_email', 'currency', 'monthly_income', 'timezone', 'profile_picture']


# class ProfileSerializer(serializers.ModelSerializer):
#     email = serializers.EmailField(source='user.email', read_only=True)
#     full_name = serializers.CharField(source='user.full_name')

#     class Meta:
#         model = tracker_models.Profile
#         fields = ['full_name', 'currency', 'monthly_income', 'timezone', 'profile_picture']

#     def update(self, instance, validated_data):
#         user_data = validated_data.pop('user', {})
#         if 'full_name' in user_data:
#             instance.user.full_name = user_data['full_name']
#             instance.user.save()

#         return super().update(instance, validated_data)
    
# serializers.py
class ProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    full_name = serializers.CharField(source='user.full_name')

    class Meta:
        model = tracker_models.Profile
        fields = ['full_name', 'email', 'currency', 'monthly_income', 'timezone', 'profile_picture']

    def update(self, instance, validated_data):
        # Update related user (full_name)
        user_data = validated_data.pop('user', {})
        if 'full_name' in user_data:
            instance.user.full_name = user_data['full_name']
            instance.user.save()
        # Update profile fields
        return super().update(instance, validated_data)



# 3. Category Serializer
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = tracker_models.Category
        fields = '__all__'

# 4. Transaction Serializer
class TransactionSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = tracker_models.Transaction
        fields = ['id', 'amount', 'type', 'category', 'category_name', 'date', 'note']

# 5. BudgetGoal Serializer
class BudgetGoalSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = tracker_models.BudgetGoal
        fields = ['id', 'category', 'category_name', 'monthly_limit']

