import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/Services/notification.service';
import { loadStripe, Stripe, StripeCardNumberElement, StripeCardExpiryElement, StripeCardCvcElement } from '@stripe/stripe-js';

declare var Razorpay: any;

@Component({
  selector: 'app-paymentoptions',
  templateUrl: './paymentoptions.component.html',
  styleUrls: ['./paymentoptions.component.css']
})
export class PaymentoptionsComponent implements OnInit {

  bookingData: any;
  userId: any;

  // Stripe properties
  stripe: Stripe | null = null;
  @ViewChild('cardNumber') cardNumberElement?: ElementRef;
  @ViewChild('cardExpiry') cardExpiryElement?: ElementRef;
  @ViewChild('cardCvc') cardCvcElement?: ElementRef;

  cardNumber?: StripeCardNumberElement;
  cardExpiry?: StripeCardExpiryElement;
  cardCvc?: StripeCardCvcElement;

  nameOnCard: string = '';
  showStripePopup = false;
  clientSecret: string | null = null;

  constructor(
    private router: Router,
    private http: HttpClient,
    private notificationService: NotificationService
  ) {
    const nav = this.router.getCurrentNavigation();
    this.bookingData = nav?.extras.state?.['bookingPayload'];
  }

  ngOnInit(): void {
    this.userId = sessionStorage.getItem("userId");
    const nav = history.state;
    if (nav && nav.bookingData) {
      this.bookingData = nav.bookingData;
      this.bookingData.userId = this.userId;
    } else {
      this.bookingData = {};
    }

    // Initialize Stripe
    loadStripe('pk_test_51OUTGKSFVmSbHbAjJ99lyHIjdg3ttrLIddBMc12OeN51ilD6lfBAZlYAO81tH4CbQhDCNCvydAAull8QggLfq8yP00C7HZ6IKm')
      .then(stripe => {
        this.stripe = stripe;
      });
  }

  chooseProvider(provider: string) {
    if (!this.bookingData) {
      console.error("BookingData is not set");
      return;
    }

    this.bookingData.provider = provider;
    switch (provider) {
      case "Razorpay":
        this.rPayNow();
        break;
      case "Stripe":
        this.sPayNow();
        break;
      default:
        console.warn("Unknown provider:", provider);
    }
  }

  rPayNow() {
    // ✅ Already working Razorpay code unchanged
    const bookingPayload = { ...this.bookingData };
    this.http.post('https://localhost:7108/api/create-booking', bookingPayload)
      .subscribe((order: any) => {
        const options = {
          key: 'rzp_test_QXHInQ5xIrE7dd',
          amount: order.amount,
          currency: 'INR',
          name: 'Bus Booking',
          description: 'Bus booking payment',
          order_id: order.razorpayOrderId,
          handler: (response: any) => {
            const verifyPayload = {
              orderId: order.orderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            };
            this.http.post('https://localhost:7108/api/payments/verify-razorpay', verifyPayload)
              .subscribe(
                (res: any) => {
                  if (res.paymentStatus === 'Paid') {
                    alert('✅ Payment verified successfully!');
                  } else {
                    alert('❌ Payment failed or incomplete!');
                  }
                },
                (err: any) => {
                  alert('❌ Payment verification failed!');
                  console.error(err);
                }
              );
          },
        };
        const rzp = new Razorpay(options);
        rzp.open();
      });
  }

  async sPayNow() {
    // 1️⃣ Create booking on backend with Stripe provider
    const bookingPayload = { ...this.bookingData, provider: 'Stripe' };

    const response: any = await this.http.post('https://localhost:7108/api/create-booking', bookingPayload).toPromise();
    this.clientSecret = response.stripeClientSecret;

    // 2️⃣ Show popup
    this.showStripePopup = true;

    // 3️⃣ Mount Stripe elements (after popup is rendered)
    setTimeout(() => {
      if (this.stripe) {
        const elements = this.stripe.elements();
        this.cardNumber = elements.create('cardNumber');
        this.cardNumber.mount(this.cardNumberElement?.nativeElement);

        this.cardExpiry = elements.create('cardExpiry');
        this.cardExpiry.mount(this.cardExpiryElement?.nativeElement);

        this.cardCvc = elements.create('cardCvc');
        this.cardCvc.mount(this.cardCvcElement?.nativeElement);
      }
    }, 100);
  }

  async confirmStripePayment() {
    if (!this.stripe || !this.clientSecret) return;

    const { paymentIntent, error } = await this.stripe.confirmCardPayment(this.clientSecret, {
      payment_method: {
        card: this.cardNumber!,
        billing_details: {
          name: this.nameOnCard
        }
      }
    });

    if (error) {
      this.notificationService.showError(error.message || 'Stripe payment failed');
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      this.notificationService.showSuccess('✅ Payment successful!');
      this.showStripePopup = false;
      this.router.navigate(['/success']);
    }
  }

  closeStripePopup() {
    this.showStripePopup = false;
  }
}
