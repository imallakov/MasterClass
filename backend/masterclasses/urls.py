from django.urls import path
from . import views

urlpatterns = [
    path("", views.MasterClassListCreateView.as_view(), name="masterclass-list-create"),
    path(
        "<int:pk>/",
        views.MasterClassDetailUpdateDestroyView.as_view(),
        name="masterclass-detail",
    ),
    path("slots/", views.MasterClassSlotCreateView.as_view(), name="slot-create"),
    path(
        "slots/<int:pk>/", views.MasterClassSlotDeleteView.as_view(), name="slot-delete"
    ),
    path(
        "enroll/",
        views.MasterClassEnrollmentCreateView.as_view(),
        name="masterclass-enroll",
    ),
    path(
        "enrollments/", views.UserEnrollmentsListView.as_view(), name="user-enrollments"
    ),
    path(
        "all_enrollments/",
        views.AdminMasterClassEnrollmentListView.as_view(),
        name="admin-masterclass-enrollments",
    ),
    path("payments/create/", views.PaymentCreateView.as_view(), name="payment-create"),
    path(
        "payments/webhook/", views.PaymentWebhookView.as_view(), name="payment-webhook"
    ),
    path(
        "payments/status/<int:enrollment_id>/",
        views.PaymentStatusSSEView.as_view(),
        name="payment-status-sse",
    ),
]
