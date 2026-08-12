// ==========================================
// GONAF+ RECHARGE WEBSITE
// Frontend only
// ==========================================


// ===============================
// SERVICES
// ===============================

const services = [
  "Wise",
  "Pana",
  "Meru",
  "PayPal",
  "Cash App",
  "USDC/Base"
];


// ===============================
// PAYMENT METHODS
// ===============================

const paymentMethods = [
  {
    name: "MonCash",
    description: "For customers in Haiti or Dominican Republic"
  },

  {
    name: "Banco Popular",
    description: "For customers living in Dominican Republic"
  },

  {
    name: "USDC / Base",
    description: "Pay with USDC on Base network"
  },

  {
    name: "PayPal",
    description: "Pay using PayPal"
  }
];


// ===============================
// GLOBAL ORDER DATA
// ===============================

let orderData = {
  service: "",
  amount: 0,
  paymentMethod: ""
};


// ===============================
// START
// ===============================

document.addEventListener("DOMContentLoaded", () => {

  setupServiceButtons();

});


// ===============================
// SERVICE BUTTONS
// ===============================

function setupServiceButtons() {

  const cards =
    document.querySelectorAll(".service-card");


  cards.forEach((card) => {

    card.addEventListener("click", () => {

      const title =
        card.querySelector("h3").textContent;

      const service =
        title.replace("Recharge ", "");

      openAmountPage(service);

    });

  });

}


// ===============================
// AMOUNT PAGE
// ===============================

function openAmountPage(service) {

  orderData.service = service;
  orderData.amount = 0;
  orderData.paymentMethod = "";


  document.body.innerHTML = `

    <header>

      <div class="logo">
        GONAF<span>+</span>
      </div>

      <button
        class="language"
        id="backHome"
      >
        EN
      </button>

    </header>


    <main
      style="
        max-width:650px;
        margin:auto;
        padding:60px 20px;
      "
    >

      <button
        id="backButton"
        style="
          border:none;
          background:none;
          font-size:15px;
          font-weight:600;
          cursor:pointer;
          margin-bottom:30px;
        "
      >
        ← Back
      </button>


      <div
        style="
          background:white;
          border:1px solid #e5e5e5;
          border-radius:22px;
          padding:30px;
        "
      >

        <div class="badge">
          RECHARGE SERVICE
        </div>


        <h1
          style="
            font-size:36px;
            margin:15px 0 8px;
          "
        >
          Recharge ${service}
        </h1>


        <p
          style="
            color:#777;
            margin-bottom:30px;
          "
        >
          Enter the amount you want to recharge.
        </p>


        <label
          style="
            display:block;
            font-size:14px;
            font-weight:bold;
            margin-bottom:8px;
          "
        >
          Amount
        </label>


        <div
          style="
            display:flex;
            align-items:center;
            border:1px solid #ddd;
            border-radius:14px;
            padding:0 16px;
            margin-bottom:20px;
          "
        >

          <strong
            style="
              font-size:22px;
            "
          >
            $
          </strong>


          <input
            id="amountInput"
            type="number"
            min="1"
            step="0.01"
            placeholder="0.00"

            style="
              width:100%;
              border:none;
              outline:none;
              padding:18px 10px;
              font-size:22px;
              font-weight:bold;
              background:transparent;
            "
          >

        </div>


        <button
          id="amountContinueButton"

          style="
            width:100%;
            border:none;
            border-radius:14px;
            padding:16px;
            background:#111;
            color:white;
            font-size:15px;
            font-weight:bold;
            cursor:pointer;
          "
        >
          Continue
        </button>

      </div>

    </main>


    <footer>

      <strong>
        GONAF<span>+</span>
      </strong>

      <p>
        Your gateway to simple digital services.
      </p>

    </footer>

  `;


  // BACK BUTTON

  document
    .getElementById("backButton")
    .addEventListener(
      "click",
      () => {

        location.reload();

      }
    );


  // CONTINUE BUTTON

  document
    .getElementById("amountContinueButton")
    .addEventListener(
      "click",
      () => {

        const input =
          document.getElementById(
            "amountInput"
          );


        const amount =
          parseFloat(input.value);


        if (
          !amount ||
          amount <= 0
        ) {

          alert(
            "Please enter a valid amount."
          );

          return;

        }


        orderData.amount = amount;


        openPaymentPage();

      }
    );

}


// ===============================
// PAYMENT PAGE
// ===============================

function openPaymentPage() {

  const service =
    orderData.service;

  const amount =
    orderData.amount;


  // FILTER PAYMENT METHODS

  const availableMethods =
    paymentMethods.filter(
      (method) => {

        // PayPal cannot pay for PayPal recharge

        if (
          service === "PayPal" &&
          method.name === "PayPal"
        ) {

          return false;

        }


        // USDC/Base cannot pay for USDC/Base recharge

        if (
          service === "USDC/Base" &&
          method.name === "USDC / Base"
        ) {

          return false;

        }


        return true;

      }
    );


  let methodsHTML = "";


  availableMethods.forEach(
    (method) => {

      methodsHTML += `

        <button
          class="payment-choice"
          data-method="${method.name}"

          style="
            width:100%;
            padding:18px;
            margin-bottom:12px;
            background:white;
            border:1px solid #ddd;
            border-radius:15px;
            text-align:left;
            cursor:pointer;
          "
        >

          <strong
            style="
              display:block;
              font-size:16px;
              margin-bottom:4px;
            "
          >
            ${method.name}
          </strong>


          <span
            style="
              color:#777;
              font-size:13px;
            "
          >
            ${method.description}
          </span>

        </button>

      `;

    }
  );


  document.body.innerHTML = `

    <header>

      <div class="logo">
        GONAF<span>+</span>
      </div>

    </header>


    <main
      style="
        max-width:650px;
        margin:auto;
        padding:60px 20px;
      "
    >

      <button
        id="paymentBack"
        style="
          border:none;
          background:none;
          font-size:15px;
          font-weight:600;
          cursor:pointer;
          margin-bottom:30px;
        "
      >
        ← Back
      </button>


      <div
        style="
          background:white;
          border:1px solid #e5e5e5;
          border-radius:22px;
          padding:30px;
        "
      >

        <div class="badge">
          PAYMENT METHOD
        </div>


        <h1
          style="
            font-size:34px;
            margin:15px 0 8px;
          "
        >
          Choose how to pay
        </h1>


        <p
          style="
            color:#777;
            margin-bottom:30px;
          "
        >
          Recharge
          <strong>
            ${service}
          </strong>

          <br>

          Amount:
          <strong>
            $${amount.toFixed(2)}
          </strong>
        </p>


        ${methodsHTML}

      </div>

    </main>

  `;


  // BACK

  document
    .getElementById("paymentBack")
    .addEventListener(
      "click",
      () => {

        openAmountPage(service);

      }
    );


  // PAYMENT OPTIONS

  document
    .querySelectorAll(".payment-choice")
    .forEach((button) => {

      button.addEventListener(
        "click",
        () => {

          const method =
            button.dataset.method;


          orderData.paymentMethod =
            method;


          openConfirmationPage();

        }
      );

    });

}


// ===============================
// CONFIRMATION PAGE
// ===============================

function openConfirmationPage() {

  const service =
    orderData.service;

  const amount =
    orderData.amount;

  const method =
    orderData.paymentMethod;


  document.body.innerHTML = `

    <header>

      <div class="logo">
        GONAF<span>+</span>
      </div>

    </header>


    <main
      style="
        max-width:650px;
        margin:auto;
        padding:60px 20px;
      "
    >

      <button
        id="confirmBack"
        style="
          border:none;
          background:none;
          font-size:15px;
          font-weight:600;
          cursor:pointer;
          margin-bottom:30px;
        "
      >
        ← Back
      </button>


      <div
        style="
          background:white;
          border:1px solid #e5e5e5;
          border-radius:22px;
          padding:30px;
        "
      >

        <div class="badge">
          ORDER SUMMARY
        </div>


        <h1
          style="
            font-size:34px;
            margin:15px 0 25px;
          "
        >
          Confirm your order
        </h1>


        <div
          style="
            border:1px solid #eee;
            border-radius:16px;
            padding:20px;
            margin-bottom:25px;
          "
        >

          <div
            style="
              margin-bottom:18px;
            "
          >

            <span
              style="
                color:#777;
                font-size:13px;
              "
            >
              Service
            </span>

            <br>

            <strong>
              Recharge ${service}
            </strong>

          </div>


          <div
            style="
              margin-bottom:18px;
            "
          >

            <span
              style="
                color:#777;
                font-size:13px;
              "
            >
              Amount
            </span>

            <br>

            <strong>
              $${amount.toFixed(2)}
            </strong>

          </div>


          <div>

            <span
              style="
                color:#777;
                font-size:13px;
              "
            >
              Payment method
            </span>

            <br>

            <strong>
              ${method}
            </strong>

          </div>

        </div>


        <button
          id="confirmOrderButton"

          style="
            width:100%;
            border:none;
            border-radius:14px;
            padding:16px;
            background:#111;
            color:white;
            font-size:15px;
            font-weight:bold;
            cursor:pointer;
          "
        >
          Confirm Order
        </button>

      </div>

    </main>

  `;


  // BACK

  document
    .getElementById("confirmBack")
    .addEventListener(
      "click",
      () => {

        openPaymentPage();

      }
    );


  // CONFIRM

  document
    .getElementById("confirmOrderButton")
    .addEventListener(
      "click",
      () => {

        createOrder();

      }
    );

}


// ===============================
// CREATE ORDER
// ===============================

function createOrder() {

  const orderNumber =
    "GNF-" +
    Math.floor(
      100000 +
      Math.random() * 900000
    );


  const service =
    orderData.service;

  const amount =
    orderData.amount;

  const method =
    orderData.paymentMethod;


  document.body.innerHTML = `

    <main
      style="
        min-height:100vh;
        display:flex;
        align-items:center;
        justify-content:center;
        padding:20px;
        background:#f7f8fa;
      "
    >

      <div
        style="
          width:100%;
          max-width:500px;
          background:white;
          border:1px solid #eee;
          border-radius:24px;
          padding:40px 25px;
          text-align:center;
        "
      >

        <div
          style="
            width:65px;
            height:65px;
            border-radius:50%;
            background:#e8faf2;
            color:#159463;
            display:flex;
            align-items:center;
            justify-content:center;
            margin:0 auto 20px;
            font-size:30px;
            font-weight:bold;
          "
        >
          ✓
        </div>


        <h1
          style="
            margin-bottom:10px;
          "
        >
          Order Created
        </h1>


        <p
          style="
            color:#777;
            margin-bottom:25px;
          "
        >
          Your recharge order has been created.
        </p>


        <div
          style="
            background:#f5f5f5;
            border-radius:14px;
            padding:18px;
            margin-bottom:20px;
          "
        >

          <span
            style="
              display:block;
              color:#777;
              font-size:12px;
              margin-bottom:5px;
            "
          >
            ORDER ID
          </span>


          <strong
            style="
              font-size:20px;
            "
          >
            ${orderNumber}
          </strong>

        </div>


        <div
          style="
            text-align:left;
            border-top:1px solid #eee;
            padding-top:20px;
          "
        >

          <p>
            <strong>
              Service:
            </strong>

            Recharge ${service}
          </p>


          <p>
            <strong>
              Amount:
            </strong>

            $${amount.toFixed(2)}
          </p>


          <p>
            <strong>
              Payment:
            </strong>

            ${method}
          </p>

        </div>


        <p
          style="
            color:#777;
            font-size:13px;
            margin-top:25px;
          "
        >
          Payment instructions will appear here
          once the payment system is connected.
        </p>

      </div>

    </main>

  `;

          }
