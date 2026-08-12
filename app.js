const serviceCards = document.querySelectorAll(".service-card");

serviceCards.forEach((card) => {
  card.addEventListener("click", () => {

    const service =
      card.querySelector("h3").textContent;

    showRechargePage(service);

  });
});


function showRechargePage(service) {

  document.body.innerHTML = `

    <header>

      <div class="logo">
        GONAF<span>+</span>
      </div>

      <button
        class="language"
        onclick="location.reload()"
      >
        EN
      </button>

    </header>


    <main style="
      max-width:650px;
      margin:0 auto;
      padding:60px 20px;
    ">

      <button
        onclick="location.reload()"
        style="
          border:none;
          background:none;
          font-size:15px;
          font-weight:600;
          cursor:pointer;
          margin-bottom:35px;
        "
      >
        ← Back
      </button>


      <div style="
        background:white;
        border:1px solid #e5e5e5;
        border-radius:22px;
        padding:30px;
      ">

        <div class="badge">
          RECHARGE SERVICE
        </div>


        <h1 style="
          font-size:36px;
          margin:15px 0 8px;
        ">
          ${service}
        </h1>


        <p style="
          color:#777;
          margin-bottom:30px;
        ">
          Enter the amount you want to recharge.
        </p>


        <label style="
          display:block;
          font-weight:bold;
          font-size:14px;
          margin-bottom:8px;
        ">
          Amount
        </label>


        <div style="
          display:flex;
          align-items:center;
          border:1px solid #ddd;
          border-radius:14px;
          padding:0 16px;
          margin-bottom:20px;
        ">

          <strong style="font-size:22px;">
            $
          </strong>

          <input
            id="amount"
            type="number"
            placeholder="0.00"
            min="1"
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
          onclick="choosePayment('${service}')"
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

}


function choosePayment(service) {

  const amount =
    parseFloat(
      document.getElementById("amount").value
    );


  if (!amount || amount <= 0) {

    alert(
      "Please enter a valid amount."
    );

    return;

  }


  // Save information temporarily
  // until we connect the database.

  localStorage.setItem(
    "gonaf_service",
    service
  );

  localStorage.setItem(
    "gonaf_amount",
    amount
  );


  showPaymentMethods(
    service,
    amount
  );

}


function showPaymentMethods(
  service,
  amount
) {

  const methods = [

    {
      name: "MonCash",
      description:
        "For customers in Haiti or Dominican Republic"
    },

    {
      name: "Banco Popular",
      description:
        "For customers living in Dominican Republic"
    },

    {
      name: "USDC / Base",
      description:
        "Pay with USDC on Base network"
    },

    {
      name: "PayPal",
      description:
        "Pay using PayPal"
    }

  ];


  // IMPORTANT:
  // PayPal cannot be used to recharge PayPal.
  // USDC/Base cannot be used to recharge USDC/Base.

  const availableMethods =
    methods.filter((method) => {

      if (
        service === "Recharge PayPal" &&
        method.name === "PayPal"
      ) {
        return false;
      }


      if (
        service === "Recharge USDC/Base" &&
        method.name === "USDC / Base"
      ) {
        return false;
      }


      return true;

    });


  let methodsHTML = "";


  availableMethods.forEach((method) => {

    methodsHTML += `

      <button
        class="payment-card"
        onclick="selectPayment('${method.name}')"
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

        <strong style="
          display:block;
          font-size:16px;
        ">
          ${method.name}
        </strong>

        <span style="
          color:#777;
          font-size:13px;
        ">
          ${method.description}
        </span>

      </button>

    `;

  });


  document.body.innerHTML = `

    <header>

      <div class="logo">
        GONAF<span>+</span>
      </div>

    </header>


    <main style="
      max-width:650px;
      margin:0 auto;
      padding:60px 20px;
    ">

      <button
        onclick="location.reload()"
        style="
          border:none;
          background:none;
          font-weight:bold;
          cursor:pointer;
          margin-bottom:35px;
        "
      >
        ← Back
      </button>


      <div style="
        background:white;
        border:1px solid #e5e5e5;
        border-radius:22px;
        padding:30px;
      ">

        <div class="badge">
          PAYMENT METHOD
        </div>


        <h1 style="
          font-size:34px;
          margin:15px 0 8px;
        ">
          Choose how to pay
        </h1>


        <p style="
          color:#777;
          margin-bottom:30px;
        ">
          Recharge:
          <strong>${service}</strong>
          <br>
          Amount:
          <strong>$${amount.toFixed(2)}</strong>
        </p>


        ${methodsHTML}

      </div>

    </main>

  `;

}


function selectPayment(method) {

  const service =
    localStorage.getItem(
      "gonaf_service"
    );

  const amount =
    parseFloat(
      localStorage.getItem(
        "gonaf_amount"
      )
    );


  localStorage.setItem(
    "gonaf_payment",
    method
  );


  showConfirmation(
    service,
    amount,
    method
  );

}


function showConfirmation(
  service,
  amount,
  method
) {

  document.body.innerHTML = `

    <header>

      <div class="logo">
        GONAF<span>+</span>
      </div>

    </header>


    <main style="
      max-width:650px;
      margin:0 auto;
      padding:60px 20px;
    ">


      <div style="
        background:white;
        border:1px solid #e5e5e5;
        border-radius:22px;
        padding:30px;
      ">

        <div class="badge">
          ORDER SUMMARY
        </div>


        <h1 style="
          font-size:34px;
          margin:15px 0 25px;
        ">
          Confirm your order
        </h1>


        <div style="
          border:1px solid #eee;
          border-radius:15px;
          padding:20px;
          margin-bottom:25px;
        ">

          <p style="
            margin-bottom:12px;
          ">
            <span style="color:#777;">
              Service
            </span>

            <br>

            <strong>
              ${service}
            </strong>
          </p>


          <p style="
            margin-bottom:12px;
          ">
            <span style="color:#777;">
              Amount
            </span>

            <br>

            <strong>
              $${amount.toFixed(2)}
            </strong>
          </p>


          <p>

            <span style="color:#777;">
              Payment method
            </span>

            <br>

            <strong>
              ${method}
            </strong>

          </p>

        </div>


        <button
          onclick="createOrder()"
          style="
            width:100%;
            border:none;
            border-radius:14px;
            padding:16px;
            background:#111;
            color:white;
            font-weight:bold;
            cursor:pointer;
          "
        >
          Confirm Order
        </button>


      </div>

    </main>

  `;

}


function createOrder() {

  const orderNumber =
    "GNF-" +
    Math.floor(
      100000 +
      Math.random() * 900000
    );


  localStorage.setItem(
    "gonaf_order",
    orderNumber
  );


  document.body.innerHTML = `

    <main style="
      min-height:100vh;
      display:flex;
      align-items:center;
      justify-content:center;
      padding:20px;
      text-align:center;
      background:#f7f8fa;
    ">

      <div style="
        max-width:500px;
        background:white;
        border:1px solid #eee;
        border-radius:24px;
        padding:40px 25px;
      ">

        <div style="
          font-size:50px;
          margin-bottom:15px;
        ">
          ✓
        </div>


        <h1 style="
          margin-bottom:10px;
        ">
          Order Created
        </h1>


        <p style="
          color:#777;
          margin-bottom:20px;
        ">
          Your order has been created successfully.
        </p>


        <div style="
          background:#f5f5f5;
          padding:15px;
          border-radius:12px;
          font-weight:bold;
          margin-bottom:25px;
        ">
          ${orderNumber}
        </div>


        <p style="
          color:#777;
          font-size:14px;
        ">
          Payment instructions will appear here
          once we connect the payment system.
        </p>

      </div>

    </main>

  `;

            }
window.choosePayment = choosePayment;
window.selectPayment = selectPayment;
window.createOrder = createOrder;
