 // Ajusta el máximo de fecha (hoy - 13 años para ejemplo)
        (function setMaxDate(){
            const input = document.getElementById('nacimiento');
            const today = new Date();
            today.setFullYear(today.getFullYear() - 13);
            input.max = today.toISOString().slice(0,10);
        })();

        const form = document.getElementById('registerForm');
        const els = {
            nombre: document.getElementById('nombre'),
            apellido: document.getElementById('apellido'),
            email: document.getElementById('email'),
            usuario: document.getElementById('usuario'),
            password: document.getElementById('password'),
            confirm: document.getElementById('confirm'),
            terms: document.getElementById('terms'),
            serverMsg: document.getElementById('serverMsg')
        };

        function showError(id, show, text){
            const el = document.getElementById(id);
            if(show){ el.textContent = text; el.style.display = 'block'; }
            else el.style.display = 'none';
        }

        function validateFields(){
            let ok = true;
            // nombre/apellido
            if(!els.nombre.value.trim()){ showError('err-nombre', true, 'Introduce tu nombre.'); ok = false; } else showError('err-nombre', false);
            if(!els.apellido.value.trim()){ showError('err-apellido', true, 'Introduce tu apellido.'); ok = false; } else showError('err-apellido', false);
            // email
            if(!els.email.checkValidity()){ showError('err-email', true, 'Introduce un correo válido.'); ok = false; } else showError('err-email', false);
            // usuario pattern
            if(!els.usuario.checkValidity()){ showError('err-usuario', true, els.usuario.title || 'Usuario no válido.'); ok = false; } else showError('err-usuario', false);
            // password
            if(els.password.value.length < 8){ showError('err-password', true, 'La contraseña debe tener al menos 8 caracteres.'); ok = false; } else showError('err-password', false);
            // confirm
            if(els.confirm.value !== els.password.value){ showError('err-confirm', true, 'Las contraseñas no coinciden.'); ok = false; } else showError('err-confirm', false);
            // terms
            if(!els.terms.checked){ showError('err-terms', true, 'Debes aceptar los términos y condiciones.'); ok = false; } else showError('err-terms', false);

            return ok;
        }

        form.addEventListener('submit', function(e){
            e.preventDefault();
            els.serverMsg.style.display = 'none';
            if(!validateFields()) return;

            // Ejemplo de envío: aquí normalmente enviarías a tu servidor via fetch.
            // Simulación de respuesta
            const payload = {
                nombre: els.nombre.value.trim(),
                apellido: els.apellido.value.trim(),
                email: els.email.value.trim(),
                usuario: els.usuario.value.trim()
            };

            // Simula petición
            setTimeout(() => {
                // Simular éxito
                alert('Registro completado. Bienvenido, ' + payload.nombre + '!');
                form.reset();
            }, 600);
        });

        // Validación en tiempo real mínima
        ['input','change'].forEach(evt=>{
            form.addEventListener(evt, () => {
                // oculta mensaje general al editar
                els.serverMsg.style.display = 'none';
            }, {passive:true});
        });