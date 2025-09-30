// Configuración - REEMPLAZA ESTA URL CON LA DE TU GOOGLE APPS SCRIPT
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx1aZmK2-9X1GaI6RUytSVwtun4q6Pfc9-AMBiim2LIu_1mqH4FibVLhGA8gU9il3x6CQ/exec';

class FormHandler {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.messageDiv = document.getElementById('message');
        
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        // Validar formulario
        if (!this.validateForm()) {
            return;
        }
        
        // Preparar datos
        const formData = new FormData(this.form);
        const data = {
            nombre: formData.get('nombre'),
            email: formData.get('email'),
            mensaje: formData.get('mensaje')
        };
        
        // Enviar datos
        await this.submitForm(data);
    }
    
    validateForm() {
        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!nombre) {
            this.showMessage('Por favor ingresa tu nombre', 'error');
            return false;
        }
        
        if (!email) {
            this.showMessage('Por favor ingresa tu email', 'error');
            return false;
        }
        
        if (!emailRegex.test(email)) {
            this.showMessage('Por favor ingresa un email válido', 'error');
            return false;
        }
        
        return true;
    }
    
    async submitForm(data) {
        this.setLoading(true);
        
        try {
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.status === 'success') {
                this.showMessage('¡Mensaje enviado correctamente!', 'success');
                this.form.reset();
            } else {
                this.showMessage('Error: ' + result.message, 'error');
            }
            
        } catch (error) {
            console.error('Error:', error);
            this.showMessage('Error al enviar el formulario. Intenta nuevamente.', 'error');
        } finally {
            this.setLoading(false);
        }
    }
    
    setLoading(loading) {
        const btnText = this.submitBtn.querySelector('.btn-text');
        const btnLoading = this.submitBtn.querySelector('.btn-loading');
        
        if (loading) {
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline';
            this.submitBtn.disabled = true;
        } else {
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            this.submitBtn.disabled = false;
        }
    }
    
    showMessage(text, type) {
        this.messageDiv.textContent = text;
        this.messageDiv.className = `message ${type}`;
        this.messageDiv.style.display = 'block';
        
        // Auto-ocultar mensajes de éxito después de 5 segundos
        if (type === 'success') {
            setTimeout(() => {
                this.messageDiv.style.display = 'none';
            }, 5000);
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new FormHandler();
});

// Función para testear la conexión (opcional)
async function testConnection() {
    try {
        const response = await fetch(SCRIPT_URL);
        const result = await response.json();
        console.log('Test connection:', result);
    } catch (error) {
        console.error('Connection test failed:', error);
    }
}

// Ejecutar test al cargar (opcional)
// document.addEventListener('DOMContentLoaded', testConnection);