// public/javascripts/form-handler.js

async function enviarDatosFormulario(event) {
    event.preventDefault(); // Evita que el formulario se envíe de la manera tradicional

    const form = document.getElementById('serieForm');
    const formData = new FormData(form);

    try {
        const response = await axios.post('http://localhost:3000/rest/Api/NuevaSerie', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (response.status === 200) {
            window.location.href = '/series';
        } else {
            console.error('Error en el servidor:', response.statusText);
            alert('Hubo un problema al crear la serie. Inténtalo de nuevo.');
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Ocurrió un error al enviar los datos. Verifica tu conexión y vuelve a intentarlo.');
    }
}

document.getElementById('serieForm').addEventListener('submit', enviarDatosFormulario);