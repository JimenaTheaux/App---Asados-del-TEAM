console.log("Asados app iniciada");

// =============================
// UTILIDADES
// =============================
function formatearFecha(fechaISO) {
  if (!fechaISO) return null;
  return new Date(fechaISO);
}

function formatearMes(fecha) {
  return fecha.toLocaleDateString("es-AR", {
    year: "numeric",
    month: "short"
  });
}

function mostrarPopupSuccess() {
  const popup = document.getElementById("popup-success");
  popup.classList.remove("hidden");

  setTimeout(() => {
    popup.classList.add("hidden");
  }, 2000); // 2 segundos visible
}


// =============================
// FORMULARIO
// =============================
const form = document.getElementById("asado-form");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const fecha = document.getElementById("fecha").value;

  const cortesSeleccionados = Array.from(
    document.querySelectorAll('input[name="cortes"]:checked')
  ).map(i => i.value);

  const participantesSeleccionados = Array.from(
    document.querySelectorAll('input[name="participantes"]:checked')
  ).map(i => i.value);

  if (!fecha || !cortesSeleccionados.length || !participantesSeleccionados.length) {
    alert("Completá todos los datos");
    return;
  }

  const params = new URLSearchParams({
    fecha,
    cortes: cortesSeleccionados.join(", "),
    participantes: participantesSeleccionados.join(", ")
  });

 fetch(`https://script.google.com/macros/s/AKfycbwYKVgtmgApcd3X57J9uapCGSYjxUz9CzPYaSlO5Luqmi1hcznKdC_ZBP2-VMGqes7x/exec?${params}`)
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      mostrarPopupSuccess();   // 👈 POPUP
      form.reset();            // limpia formulario
      cargarDashboard();       // refresca métricas
    } else {
      alert("Error al guardar el asado");
    }
  })
  .catch(err => {
    console.error(err);
    alert("Error de conexión");
  });
});


// =============================
// DASHBOARD
// =============================
const DASHBOARD_URL = "https://script.google.com/macros/s/AKfycbwYKVgtmgApcd3X57J9uapCGSYjxUz9CzPYaSlO5Luqmi1hcznKdC_ZBP2-VMGqes7x/exec";

// Registrar plugin de datalabels
Chart.register(ChartDataLabels);

document.addEventListener("DOMContentLoaded", cargarDashboard);

let chartMeses, chartParticipacion, chartCortes;

function cargarDashboard() {
  fetch(`${DASHBOARD_URL}?action=dashboard`)
    .then(r => r.json())
    .then(data => {
      if (!Array.isArray(data)) return;

      const dataLimpia = data.filter(a => a.fecha && a.cortes && a.participantes);

      renderTotalAsados(dataLimpia);
      renderAsadosPorMes(dataLimpia);
      renderParticipacion(dataLimpia);
      renderRankingCortes(dataLimpia);
    })
    .catch(err => console.error("Dashboard error:", err));
}

// =============================
// MÉTRICAS
// =============================
function renderTotalAsados(data) {
  document.getElementById("total-asados").innerText = data.length;
}

// =============================
// 📈 ASADOS POR MES (LINE)
// =============================
function renderAsadosPorMes(data) {
  const conteo = {};

  data.forEach(a => {
    const fecha = formatearFecha(a.fecha);
    if (!fecha) return;
    const mes = formatearMes(fecha);
    conteo[mes] = (conteo[mes] || 0) + 1;
  });

  const labels = Object.keys(conteo);
  const values = Object.values(conteo);

  if (chartMeses) chartMeses.destroy();

  chartMeses = new Chart(
    document.getElementById("chart-asados-fecha"),
    {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: "Asados",
          data: values,
          borderColor: "#8C4A2F",
          backgroundColor: "rgba(140,74,47,.25)",
          tension: 0.35,
          fill: true,
          borderWidth: 3,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: "#8C4A2F",
          pointBorderColor: "#F2D3B3",
          pointBorderWidth: 2,
          pointHoverBackgroundColor: "#6F3A24",
          pointHoverBorderColor: "#F2D3B3"
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "rgba(58, 42, 34, 0.95)",
            padding: 12,
            cornerRadius: 8,
            titleColor: "#F2D3B3",
            bodyColor: "#F2D3B3",
            borderColor: "#C87B4A",
            borderWidth: 1,
            callbacks: {
              label: ctx => ctx.raw + " asados"
            }
          },
          datalabels: {
            anchor: "end",
            align: "top",
            color: "#3A2A22",
            font: {
              weight: "bold",
              size: 9
            },
            formatter: (value) => value,
            display: true,
            offset: 8
          }
        },
        scales: {
          x: { 
            grid: {
              display: false
            },
            border: {
              display: false
            },
            ticks: {
              color: "#3A2A22",
              font: {
                size: 11,
                weight: "600"
              },
              padding: 8
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(140, 74, 47, 0.1)",
              drawBorder: false
            },
            border: {
              display: false
            },
            ticks: {
              color: "#6F3A24",
              font: {
                size: 11,
                weight: "500"
              },
              precision: 0,
              padding: 8
            }
          }
        },
        layout: {
          padding: {
            top: 20,
            right: 10
          }
        }
      }
    }
  );
}

// =============================
// 📊 PARTICIPACIÓN (%)
// =============================
function renderParticipacion(data) {
  const total = data.length;
  const conteo = {};

  data.forEach(a => {
    a.participantes.split(",").forEach(p => {
      const nombre = p.trim();
      conteo[nombre] = (conteo[nombre] || 0) + 1;
    });
  });

  const labels = [];
  const values = [];

  Object.entries(conteo)
    .map(([p, c]) => ({ p, v: Math.round((c / total) * 100) }))
    .sort((a, b) => b.v - a.v)
    .forEach(i => {
      labels.push(i.p);
      values.push(i.v);
    });

  if (chartParticipacion) chartParticipacion.destroy();

  chartParticipacion = new Chart(
    document.getElementById("chart-participacion"),
    {
      type: "bar",
      data: {
        labels,
        datasets: [{
          data: values,
          backgroundColor: "#8C4A2F",
          borderRadius: 8,
          borderSkipped: false
        }]
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "rgba(58, 42, 34, 0.95)",
            padding: 12,
            cornerRadius: 8,
            titleColor: "#F2D3B3",
            bodyColor: "#F2D3B3",
            borderColor: "#C87B4A",
            borderWidth: 1,
            callbacks: {
              label: ctx => ctx.raw + "%"
            }
          },
          datalabels: {
            anchor: "center",
            align: "center",
            color: "#F2D3B3",
            font: {
              weight: "bold",
              size: 9
            },
            formatter: (value) => value + "%",
            display: true
          }
        },
        scales: {
          x: { 
            display: false  // ✅ Oculta completamente el eje X
          },
          y: {
            grid: {
              display: false  // ✅ Sin líneas de cuadrícula
            },
            border: {
              display: false  // ✅ Sin borde del eje
            },
            ticks: {
              color: "#3A2A22",
              font: {
                size: 12,
                weight: "600"
              },
              padding: 8
            }
          }
        },
        layout: {
          padding: {
            right: 30
          }
        }
      }
    }
  );
}

// =============================
// 🥩 RANKING CORTES (TOP 5)
// =============================
function renderRankingCortes(data) {
  const conteo = {};

  data.forEach(a => {
    a.cortes.split(",").forEach(c => {
      const corte = c.trim();
      conteo[corte] = (conteo[corte] || 0) + 1;
    });
  });

  const labels = [];
  const values = [];

  Object.entries(conteo)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .forEach(([c, v]) => {
      labels.push(c);
      values.push(v);
    });

  if (chartCortes) chartCortes.destroy();

  chartCortes = new Chart(
    document.getElementById("chart-cortes"),
    {
      type: "bar",
      data: {
        labels,
        datasets: [{
          data: values,
          backgroundColor: "#8C4A2F",
          borderRadius: 8,
          borderSkipped: false
        }]
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "rgba(58, 42, 34, 0.95)",
            padding: 12,
            cornerRadius: 8,
            titleColor: "#F2D3B3",
            bodyColor: "#F2D3B3",
            borderColor: "#C87B4A",
            borderWidth: 1,
            callbacks: {
              label: ctx => ctx.raw + " veces"
            }
          },
          datalabels: {
            anchor: "center",
            align: "center",
            color: "#F2D3B3",
            font: {
              weight: "bold",
              size: 9
            },
            formatter: (value) => value,
            display: true
          }
        },
        scales: {
          x: { 
            display: false
          },
          y: {
            grid: {
              display: false
            },
            border: {
              display: false
            },
            ticks: {
              color: "#3A2A22",
              font: {
                size: 12,
                weight: "600"
              },
              padding: 8
            }
          }
        },
        layout: {
          padding: {
            right: 30
          }
        }
      }
    }
  );
}
