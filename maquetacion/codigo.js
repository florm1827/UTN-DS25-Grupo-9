            $(document).ready(function () {
            const horas = ["08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00","22:30","23:00","23:30","24:00","24:30"];
            const canchas = ["cancha1", "cancha2", "cancha3", "cancha4", "cancha5", "cancha6", "cancha7", "cancha8"];
            
            horas.forEach(hora => {
                let row = `<tr data-hora="${hora}"><td>${hora}</td>`;
                canchas.forEach(cancha => {
                row += `<td data-cancha="${cancha}" data-hora="${hora}"></td>`;
                });
                row += "</tr>";
                $("#grilla tbody").append(row);
            })
            });

            function volver() {
                window.location.href = "Grilla.html";
            }
            function volverI(){
                window.location.href = "inicio.html"
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