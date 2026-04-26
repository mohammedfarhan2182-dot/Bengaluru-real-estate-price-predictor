let chart;

// ================= LOAD LOCATIONS =================
fetch("/get_locations")
.then(res => res.json())
.then(data => {
  let loc = document.getElementById("location");

  data.locations.forEach(location => {
    let option = document.createElement("option");
    option.value = location;
    option.text = location;
    loc.add(option);
  });
});


// ================= UPDATE CHART =================
function updateChart(price) {
  const ctx = document.getElementById("priceChart").getContext("2d");

  // Destroy old chart if exists
  if (chart) {
    chart.destroy();
  }

  // Create new chart
  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Predicted Price"],
      datasets: [{
        label: "Price (Lakhs)",
        data: [price]
      }]
    }
  });
}


// ================= PREDICT FUNCTION =================
function predictPrice() {

  let sqft = document.getElementById("sqft").value;

  // Input validation
  if (!sqft || sqft <= 0) {
    alert("Enter valid sqft");
    return;
  }

  const data = {
    sqft: sqft,
    bath: document.getElementById("bath").value,
    bhk: document.getElementById("bhk").value,
    location: document.getElementById("location").value
  };

  // Show loading
  document.getElementById("result").innerText = "Calculating... ⏳";

  // Send request to backend
  fetch("/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(data => {

    // Show result
    let resultText = `₹ ${data.price} Lakhs (${data.category})`;
    document.getElementById("result").innerText = resultText;

    // Update chart
    updateChart(data.price);

    // Save history
    let history = document.getElementById("history");
    let item = document.createElement("li");
    item.innerText = resultText;
    history.appendChild(item);

  })
  .catch(err => {
    document.getElementById("result").innerText = "Server Error!";
  });
}