            function volver() {
                window.location.href = "Grilla.html";
            }
            function Realizarformulario(){
                window.location.href = "RealizarSolicitud.html";
            }
            
            window.addEventListener("DOMContentLoaded", () => {
            const formulario = document.getElementById("FormularioR");
            formulario.onsubmit = validar;
            });

            function validar() {
            const fecha = document.getElementById("fecha").value;
            const cancha = document.getElementById("canchas").value;
            const inicio = document.getElementById("horainicio").value;
            const fin = document.getElementById("horafin").value;
            const tipo = document.getElementById("tiporeserva").value;

            if (!fecha || !cancha || !inicio || !fin || !tipo) {
                alert("Por favor, completa todos los campos.");
                return;
            }

            if (inicio >= fin) {
                alert("La hora de fin debe ser posterior a la de inicio.");
                return;
            }

            const mensaje = `Datos seleccionados:
            - Fecha: ${fecha}
            - Cancha: ${cancha}
            - Hora inicio: ${inicio}
            - Hora fin: ${fin}
            - Tipo de reserva: ${tipo}`;

            alert(mensaje);

            }