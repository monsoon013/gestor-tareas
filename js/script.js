$(document).ready(function () {
    const $titulo = $('#titulo');
    const $descripcion = $('#cuerpo');
    const $estado = $('select[name="estado-task"]');
    const $error = $('.empty-task');

    $('.add-note').on('click', function(e) { //Añadir la nota
        
        const titulo = $titulo.val().trim();
        const desc = $descripcion.val().trim();
        const estado = $estado.val();

        if(desc.trim() === "" || titulo.trim() === ""){
            $error.show(); //si está vacía la tarea, mostramos el mensaje de error.
            return;
        }else {
            $error.hide(); //si todo está correcto, ocultamos.
        }

        const isCompleted = (estado === 'complete');
        const textoTag = isCompleted ? 'Completada' : 'Pendiente';
        const claseTag = isCompleted ? 'tag-complete' : 'tag-ongoing';

        const $newTask = $('<div>', {class: 'tarjeta-tarea'}); //Estructura de cada tarjeta
        const $h3 = $('<h3>', {text: titulo});
        const $p = $('<p>', {text: desc});
        const $tag = $('<span>', {
            class: `tag-estado ${claseTag}`,
            text: textoTag
        });
        const $eraseButton = $('<button>', {class: 'btn-papelera'})
            .append($('<i>', { class: 'fa-solid fa-trash-can'}));
        const $acciones = $('<div>', {class: 'tarjeta-acciones'}).append($eraseButton);

        $newTask.append($tag, $h3, $p, $acciones);

        if(estado === 'complete'){
            $('.tareas-completadas').prepend($newTask);
        } else {
            $('.tareas-no-completadas').prepend($newTask);
        }

        $titulo.val('');//limpieza de campos
        $descripcion.val('');
    });

    $(document).on('click', '.btn-papelera', function(){ //referenciar al document para que detecte las nuevas tareas creadas
        const $tarjeta = $(this).closest('.tarjeta-tarea');

        $tarjeta.fadeOut(300, function(){
            $(this).find('.tag-estado')
                .text('Borrada')
                .css('background-color', 'var(--erased-bckgr)');

            $(this).appendTo('.tareas-borradas').fadeIn(300);
            $tarjeta.find('.btn-papelera').remove();
        })
    })

    //drag & drop

    $('.tareas-completadas, .tareas-no-completadas').sortable({ //habilitar la función de arrastrar y soltar
        connectWith: '.tareas-completadas, .tareas-no-completadas',  //permitir que se muevan entre las dos listas
        placeholder: 'tarjeta-placeholder', //donde se va a colocar la tarjeta mientras se arrastra
        receive: function(event, ui){ //evento al soltar la tarjeta
            const $tarea = ui.item; //la tarjeta soltada
            const $destino = $(this); //destino donde se coloca la tarjeta

            if($destino.hasClass('tareas-completadas')){ //lógica para cambiar el estado de la tarjeta al moverla
                $tarea.find('.tag-estado').text('Completada').attr('class', 'tag-estado tag-complete'); //actualizar el texto y la clase del tag.
            }else if ($destino.hasClass('tareas-no-completadas')){
                $tarea.find('.tag-estado').text('Pendiente').attr('class', 'tag-estado tag-ongoing');
            }
        }
    }).disableSelection(); //bloquear el resaltado del texto al arrastrar.


})
