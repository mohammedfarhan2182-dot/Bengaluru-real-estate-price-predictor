let chart;

// Load locations
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

// Chart function
function updateChart(price) {
  const ctx = document.getElementById("priceChart").getContext("2d");

  if (chart) {
    chart.destroy();
  }

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

// Predict
function predictPrice() {

  let sqft = document.getElementById("sqft").value;

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

  document.getElementById("result").innerText = "Calculating... ⏳";

  fetch("/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(data => {

    let resultText = `₹ ${data.price} Lakhs (${data.category})`;
    document.getElementById("result").innerText = resultText;

    updateChart(data.price);

    // History
    let history = document.getElementById("history");
    let item = document.createElement("li");
    item.innerText = resultText;
    history.appendChild(item);

  })
  .catch(err => {
    document.getElementById("result").innerText = "Error connecting to server!";
  });
}