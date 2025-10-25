 // Comportamiento mínimo: toggle de visibilidad y validación simple con feedback visible
        (function(){
            var form = document.getElementById('loginForm');
            var pwd = document.getElementById('password');
            var toggle = document.getElementById('togglePwd');
            var result = document.getElementById('validationResult');

            // Validación: al menos una mayúscula y un número
            var pwdRule = /(?=.*[A-Z])(?=.*\d)/;

            function showMessage(message, ok) {
                result.textContent = message || '';
                result.style.color = ok ? '#047857' : '#b91c1c'; // verde oscuro / rojo
            }

            function validatePwd() {
                var value = pwd.value || '';
                if (value.length === 0) {
                    pwd.setCustomValidity('');
                    showMessage(''); // dejar el área vacía cuando no hay input
                    return;
                }
                if (!pwdRule.test(value)) {
                    pwd.setCustomValidity('La contraseña debe contener al menos una mayúscula y un número.');
                    showMessage('La contraseña debe contener al menos una mayúscula y un número.', false);
                } else {
                    pwd.setCustomValidity('');
                    showMessage('Contraseña válida.', true);
                }
            }

            // Validar mientras el usuario escribe para feedback inmediato
            pwd.addEventListener('input', function(){
                validatePwd();
            });

            toggle.addEventListener('click', function(){
                var isHidden = pwd.type === 'password';
                pwd.type = isHidden ? 'text' : 'password';
                toggle.textContent = isHidden ? 'Ocultar' : 'Mostrar';
                toggle.setAttribute('aria-pressed', String(isHidden));
            });

            function gatherInvalidMessages(formEl) {
                var messages = [];
                Array.prototype.forEach.call(formEl.elements, function(el){
                    if (!el.willValidate) return;
                    if (!el.checkValidity()) {
                        var label = formEl.querySelector('label[for="'+el.id+'"]');
                        var name = label ? label.textContent.trim() : (el.name || el.id);
                        messages.push(name + ': ' + el.validationMessage);
                    }
                });
                return messages;
            }

            form.addEventListener('submit', function(e){
                // forzar validación personalizada antes de comprobar
                validatePwd();

                // validación sencilla y accesible
                if (!form.checkValidity()) {
                    e.preventDefault();
                    var msgs = gatherInvalidMessages(form);
                    showMessage(msgs.length ? msgs.join(' — ') : 'Formulario inválido.', false);
                    var firstInvalid = form.querySelector(':invalid');
                    if (firstInvalid) firstInvalid.focus();
                    return;
                }

                // Formulario válido -> mostrar resultado (en desarrollo evitamos envío real)
                e.preventDefault();
                showMessage('Datos válidos. Envío simulado completado.', true);
                // Si quieres permitir envío real, quita el preventDefault anterior.
            });
        })();