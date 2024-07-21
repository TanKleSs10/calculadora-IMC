const form = document.querySelector("#bmi-form");
const heightRange = document.getElementById("height");
const heightValue = document.getElementById("height-value");
const buttons = document.querySelectorAll(".bmi-calculator__button");
const modal = document.getElementById("bmi-modal");
const modalClose = document.querySelector(".modal .close");
const bmiResult = document.getElementById("bmi-result");

// Función que controla los botones para la edad y el peso
function handleButtonClick(e) {
  const button = e.target.closest("button");
  if (button) {
    const container = button.closest(".bmi-calculator__input");
    const valueSpan = container.querySelector(".bmi-calculator__value");
    const input = container.querySelector("input[type='hidden']");
    let value = parseInt(valueSpan.innerText);

    if (button.id.includes("plus")) {
      value++;
    } else if (button.id.includes("subtract") && value > 0) {
      value--;
    }

    valueSpan.innerText = value;
    input.value = value;
  }
}

// Validar formulario
function validateForm(data) {
  const errors = {}; // Inicializar un nuevo objeto de errores

  // Validar género
  if (!data.gender || data.gender.trim() === "") {
    errors.gender = "Selecciona un género";
  }

  // Validar edad
  if (+data.age === 0) {
    errors.age = "Selecciona una edad válida";
  }

  // Validar peso
  if (+data.weight === 0) {
    errors.weight = "Selecciona un peso válido";
  }

  // Validar altura
  if (+data.height === 0) {
    errors.height = "Selecciona una altura válida";
  }

  return errors;
}

function showToast(message) {
  const toastContainer = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<i class="fa-solid fa-exclamation-circle"></i> ${message}`;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000); // Eliminar el toast después de 3 segundos
}

// Calcular IMC
function CalcIMC(data) {
  let height = +data.height / 100;
  let bmi = +data.weight / Math.pow(height, 2);
  return bmi;
}

// obtener clasificación
function classification(bmi) {
  if (bmi < 18.5) return "Desnutrición";
  if (bmi >= 18.5 && bmi <= 24.9) return "Normal";
  if (bmi >= 25 && bmi <= 29.9) return "Sobrepeso";
  if (bmi > 30) return "Obesidad";
}

// Mostrar modal con resultado del IMC
function showModal(bmi) {
  let clas = classification(bmi);
  bmiResult.innerHTML = `<p>Tu IMC es <span class="bmi-calculator__value-text-white">${bmi.toFixed(
    2
  )}</span>. Te clsificas en <span class="bmi-calculator__value-text-white">${clas}</span></p>`;
  modal.style.display = "block";
  modal.classList.remove("hide");
  modal.classList.add("show");
}

// Cerrar modal
function closeModal() {
  modal.classList.remove("show");
  modal.classList.add("hide");
  // Esperar a que la animación de cierre termine para ocultar el modal
  setTimeout(() => {
    modal.style.display = "none";
  }, 300); // Tiempo de animación de cierre en milisegundos
}

// Eventos
buttons.forEach((button) => {
  button.addEventListener("click", handleButtonClick);
});

// Actualizar el valor cuando cambie el input
heightRange.addEventListener("input", () => {
  heightValue.textContent = heightRange.value + " cm";
});

// Manejar el evento de envío del formulario
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  const errors = validateForm(data);

  if (Object.keys(errors).length > 0) {
    Object.entries(errors).forEach(([key, value]) => {
      showToast(value);
    });
  } else {
    const bmi = CalcIMC(data);
    showModal(bmi);
  }
});

// Cerrar el modal
modalClose.addEventListener("click", closeModal);

// Cerrar el modal al hacer clic fuera del contenido
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});
