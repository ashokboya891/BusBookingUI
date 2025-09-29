import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/Services/notification.service';
declare var Razorpay: any; // Declare Razorpay globally

@Component({
  selector: 'app-paymentoptions',
  templateUrl: './paymentoptions.component.html',
  styleUrls: ['./paymentoptions.component.css']
})
export class PaymentoptionsComponent  implements OnInit{

  bookingData: any;
  userId:any;
  constructor(private router: Router,private http:HttpClient,private notificationService:NotificationService) {
    const nav = this.router.getCurrentNavigation();
    this.bookingData = nav?.extras.state?.['bookingPayload'];

    console.log("Received booking payload:", this.bookingData);
  }

chooseProvider(provider: string) {
  if (!this.bookingData) {
    console.error("BookingData is not set");
    return;
  }

  this.bookingData.provider = provider;
  console.log("Final payload before sending:", this.bookingData);

  switch (provider) {
    case "Razorpay":
      this.rPayNow();
      break;
    case "Stripepay":
      this.sPayNow();
      break;
    default:
      console.warn("Unknown provider:", provider);
  }
}

  ngOnInit(): void {
    this.userId=sessionStorage.getItem("userId");
      const nav = history.state;
  if (nav && nav.bookingData) {
    this.bookingData = nav.bookingData;
    this.bookingData.userId=this.userId;
    console.log("payload receive from chekout"+this.bookingData)
  } else {
    this.bookingData = {}; // fallback
  }

  }
 rPayNow() {
  const bookingPayload = {
    eventId: this.bookingData?.eventId,
    travellerIds: this.bookingData?.travellerIds || [],
    seatNumber: this.bookingData?.seatNumber || [],
    userId: this.bookingData?.userId,
    price: this.bookingData?.price,
    provider: this.bookingData?.provider,
  };

  // 1️⃣ Create Razorpay order via backend
  this.http.post('https://localhost:7108/api/create-booking', bookingPayload)
    .subscribe((order: any) => {
      const options = {
        key: 'rzp_test_QXHInQ5xIrE7dd', // your Razorpay test key
        amount: order.amount,
        currency: 'INR',
        name: 'Bla-Bla-payments',
        description: 'Bus booking Application',
        image: 'https://th.bing.com/th/id/OIP.FgKYdiHIomrRoQHEjVFd-gHaEM?w=305&h=180',
        order_id: order.razorpayOrderId,
        prefill: {
          name: 'Ashok King',
          email: 'asking@example.com',
          contact: '8919388938'
        },
        handler: (response: any) => {
          // 2️⃣ Send response to backend for verification
          const verifyPayload = {
            orderId: order.orderId,  // your booking/order ID from backend
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          };

          this.http.post('https://localhost:7108/api/payments/verify-razorpay', verifyPayload)
            .subscribe(
              (res: any) => {
                console.log('Verification response:', res);

                if (res.paymentStatus === 'Paid') {
                  alert('✅ Payment verified successfully!');
                  // this.DeleteCart();
                } else {
                  alert('❌ Payment failed or incomplete!');
                }
              },
              (err: any) => {
                alert('❌ Payment verification failed!');
                console.error('Verification Failed:', err);
              }
            );
        },
        theme: { color: '#3399cc' },
        modal: {
          backdropclose: true,
          escape: true,
          ondismiss: () => console.log('Payment modal closed')
        },
      };

      const rzp = new Razorpay(options);
      rzp.open();
    }, (err: any) => {
      alert('❌ Failed to create Razorpay order.');
      console.error('Create order error:', err);
    });
}
//   rPayNow() {
   
//    const bookingPayload = {
//   eventId: this.bookingData?.eventId,
//     travellerIds: this.bookingData?.travellerIds || [],   // ✅ correct key
//     seatNumber: this.bookingData?.seatNumber || [], 
//   userId: this.bookingData?.userId,
//   price: this.bookingData?.price,
//   provider: this.bookingData?.provider,   // comes from chooseProvider
//   providerOrderId: "",
//   providerPaymentId: "",
//   providerSignature: ""
// };

//   this.http.post('https://localhost:7108/api/create-booking', bookingPayload)
//     .subscribe((order: any) => {
//       const options = {
//         key: 'rzp_test_QXHInQ5xIrE7dd',
//         amount: order.amount,
//         currency: 'INR',
//         name: 'Bla-Bla-payments',
//         description: 'Bus booking Application',
//         image: 'https://th.bing.com/th/id/OIP.FgKYdiHIomrRoQHEjVFd-gHaEM?w=305&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
//         order_id: order.razorpayOrderId,
//         prefill: {
//           name: 'Ashok King',
//           email: 'asking@example.com',
//           contact: '8919388938'
//         },
//         handler: (response: any) => {
//           const verifyPayload = {
//             bookingId:response.razorpayOrderId,
//             razorpay_order_id: response.razorpay_order_id,
//             razorpay_payment_id: response.razorpay_payment_id,
//             razorpay_signature: response.razorpay_signature
//           };

//         this.http.post('https://localhost:7062/api/Payments/webhook/razorpay', verifyPayload)
//         .subscribe(
//         (res: any) => {
//         console.log('Verification response:', res);

//         if (res.paymentStatus === 'Paid') {
//           this
//           alert('✅ Payment verified successfully!');
//           // this.lastOrder = res;
//           // this.DeleteCart(); // ✅ only if payment confirmed
//         } else {
//           alert('❌ Payment failed or incomplete!');
//           // 🚫 DO NOT delete cart
//         }
//       },
//           (err: any) => {
//                 alert('❌ Payment verification failed!');
//                 console.error('Verification Failed:', err);
//                 this.notificationService.error(err);
//               }
//             );
//         },
//         theme: { color: '#3399cc' },
//         modal: {
//           backdropclose: true,
//           escape: true,
//           ondismiss: () => console.log('Payment modal closed')
//         },
//       };

//       const rzp = new Razorpay(options);
//       rzp.open();
//     }, (err: any) => {
//       alert('❌ Failed to create Razorpay order.');
//       console.error('Create order error:', err);
//     });
//   }
  walletPayNow()
  {

  }
  sPayNow()
  {

  }
}
