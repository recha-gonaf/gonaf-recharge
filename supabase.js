// ============================================
// GONAF+ SUPABASE CONNECTION
// ============================================

const SUPABASE_URL =
  "https://qupcrthkmdiburmhzgnr.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_sdxacBnCtTZptfCCCQbtcQ_5cXseYBF";

const ORDERS_TABLE = "orders";
const STORAGE_BUCKET = "payment-proofs";


// ============================================
// SUPABASE REQUEST HELPER
// ============================================

async function supabaseRequest(endpoint, options = {}) {

  const response = await fetch(
    `${SUPABASE_URL}${endpoint}`,
    {
      ...options,

      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",

        ...(options.headers || {})
      }
    }
  );

  if (!response.ok) {

    const errorText = await response.text();

    console.error(
      "Supabase error:",
      errorText
    );

    throw new Error(errorText);
  }

  return response;
}


// ============================================
// GENERATE ORDER ID
// ============================================

function gonafGenerateOrderId() {

  const timestamp =
    Date.now()
      .toString(36)
      .toUpperCase();

  const random =
    Math.floor(
      1000 +
      Math.random() * 9000
    );

  return `GNF-${timestamp}-${random}`;
}


// ============================================
// UPLOAD PAYMENT PROOF
// ============================================

async function gonafUploadPaymentProof(
  orderId,
  file
) {

  if (!file) {
    return null;
  }


  // Maximum 5 MB

  if (file.size > 5 * 1024 * 1024) {

    throw new Error(
      "Payment proof must be smaller than 5 MB."
    );
  }


  const extension =
    file.name
      .split(".")
      .pop()
      .toLowerCase();


  const filePath =
    `${orderId}/${Date.now()}-${crypto.randomUUID()}.${extension}`;


  const response =
    await fetch(

      `${SUPABASE_URL}/storage/v1/object/${STORAGE_BUCKET}/${filePath}`,

      {
        method: "POST",

        headers: {

          apikey: SUPABASE_KEY,

          Authorization:
            `Bearer ${SUPABASE_KEY}`,

          "Content-Type":
            file.type || "application/octet-stream",

          "x-upsert":
            "false"
        },

        body: file
      }
    );


  if (!response.ok) {

    const error =
      await response.text();

    console.error(
      "Payment proof upload error:",
      error
    );

    throw new Error(
      "Unable to upload payment proof."
    );
  }


  return filePath;
}


// ============================================
// CREATE ORDER
// ============================================

async function gonafCreateOrder(orderData) {

  try {

    const response =
      await supabaseRequest(
        `/rest/v1/${ORDERS_TABLE}`,
        {

          method: "POST",

          headers: {

            Prefer:
              "return=representation"
          },

          body:
            JSON.stringify({

              order_id:
                orderData.order_id,

              language:
                orderData.language || "fr",

              service:
                orderData.service,

              amount:
                orderData.amount,

              customer_full_name:
                orderData.customer_full_name,

              wisetag:
                orderData.wisetag || null,

              wise_email:
                orderData.wise_email || null,

              merutag:
                orderData.merutag || null,

              meru_email:
                orderData.meru_email || null,

              paypal_email:
                orderData.paypal_email || null,

              pana_email:
                orderData.pana_email || null,

              pana_phone:
                orderData.pana_phone || null,

              cashapp_tag:
                orderData.cashapp_tag || null,

              cashapp_phone:
                orderData.cashapp_phone || null,

              cashapp_email:
                orderData.cashapp_email || null,

              usdc_base_address:
                orderData.usdc_base_address || null,

              payment_method:
                orderData.payment_method,

              payment_proof_path:
                orderData.payment_proof_path || null,

              status:
                "pending"
            })
        }
      );


    const result =
      await response.json();


    console.log(
      "GONAF+ Order created:",
      result
    );


    return result;


  } catch (error) {

    console.error(
      "GONAF+ create order error:",
      error
    );

    throw error;
  }
}


// ============================================
// COMPLETE ORDER
// ============================================

async function gonafSubmitOrder({

  service,

  amount,

  language,

  customer,

  paymentMethod,

  proofFile

}) {

  const orderId =
    gonafGenerateOrderId();


  let proofPath =
    null;


  // Upload proof first

  if (proofFile) {

    proofPath =
      await gonafUploadPaymentProof(
        orderId,
        proofFile
      );
  }


  // Create database order

  const order =
    await gonafCreateOrder({

      order_id:
        orderId,

      language:
        language || "fr",

      service:
        service,

      amount:
        Number(amount),

      customer_full_name:
        customer.fullName,

      wisetag:
        customer.wisetag,

      wise_email:
        customer.wiseEmail,

      merutag:
        customer.merutag,

      meru_email:
        customer.meruEmail,

      paypal_email:
        customer.paypalEmail,

      pana_email:
        customer.panaEmail,

      pana_phone:
        customer.panaPhone,

      cashapp_tag:
        customer.cashappTag,

      cashapp_phone:
        customer.cashappPhone,

      cashapp_email:
        customer.cashappEmail,

      usdc_base_address:
        customer.usdcBaseAddress,

      payment_method:
        paymentMethod,

      payment_proof_path:
        proofPath

    });


  return {

    orderId,

    order

  };

}


// ============================================
// TEST CONNECTION
// ============================================

async function gonafTestSupabase() {

  try {

    const response =
      await fetch(

        `${SUPABASE_URL}/rest/v1/${ORDERS_TABLE}?select=id&limit=1`,

        {

          method: "GET",

          headers: {

            apikey:
              SUPABASE_KEY,

            Authorization:
              `Bearer ${SUPABASE_KEY}`
          }
        }
      );


    if (!response.ok) {

      console.error(
        "Supabase connection failed:",
        await response.text()
      );

      return false;
    }


    console.log(
      "✅ GONAF+ Supabase connected."
    );

    return true;


  } catch (error) {

    console.error(
      "Supabase connection error:",
      error
    );

    return false;
  }

  }
