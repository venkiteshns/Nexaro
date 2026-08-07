import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

function PayPalButtonComponent () {
    const [{ isPending }] = usePayPalScriptReducer();

    return (
<>
    {isPending ? <p>Loading PayPal...</p> : (
         
        <PayPalButtons 
           createOrder={async () => {
               try {
                   const res = await fetch("http://localhost:8000/api/payment/orders", {
                       method: "POST",
                       headers: { "Content-Type": "application/json" },
                       body: JSON.stringify({
                           totalAmount: 10.00,
                           items: [{ name: "Test Product", price: 10.00, quantity: 1 }]
                        })
                    });
                    // Check if the response returned an error status (like 404 or 500)
                    if (!res.ok) {
                        const textError = await res.text();
                        console.error("Backend Error Response:", textError);
                        throw new Error(`Server returned code ${res.status}`);
                    }

                    const order = await res.json();
                    return order.id; 
                } catch (error) {
                    console.error("Failed to initiate PayPal order:", error);
                    alert("Could not start checkout. Please try again later.");
                }
            }}
            onApprove={async (data) => {
                // data.orderID contains the PayPal ID approved by the customer
                const res = await fetch(`http://localhost:8000/api/payment/orders/${data.orderID}/capture`, {
                    method: "POST"
                });
                const captureResult = await res.json();
                if (captureResult.status === "Success") {
                    alert("Payment successful! Database status updated to Paid.");
                }
            }}
            
            onCancel={() => {
                console.log("Customer cancelled payment");
            }}
            />
            )
        }
            </>
    )
}

export default function Checkout () {


  return (
    <div className="flex justify-center z-9999 items-center w-[70%] pt-[100px] bg-green-500 min-h-[400px]">
      <PayPalScriptProvider options={{ "client-id": "BAAqZizMfvZturYdpFssYGObvERUu_E3VGGlmQbspL1e_5idPdVQSzgzsbAICoGF-jxaVkSlC48tGBy4DA", "currency": "USD" }} >
        <PayPalButtonComponent/>
       </PayPalScriptProvider>
    </div>
  );
}

