$(document).ready(function(){

    // Función para cargar las tareas desde localStorage al cargar la página
    function loadTasks() {
        var tasks = JSON.parse(localStorage.getItem('tasks'));
        if (tasks) {
            tasks.forEach(function(task) {
                addTaskToList(task.text, task.estado, task.dueDate); 
            });
        }
    }

    // Función para agregar una nueva tarea a la lista y al localStorage
    function addTaskToList(taskText, estado, fechaVencimiento) { 
        const listaTareas = $('#taskList');
        const tarea = $("<li class='tarea'><p>" + taskText + "</p></li>");
        const editar = $("<button class='btn editButton'>Editar</button>");
        const eliminar = $("<button class='btn deleteButton'>Eliminar</button>");
        const completa = $("<button class='btn completeButton'>Completada</button>");
        const fechaVenc = $("<span class='dueDate'>" + fechaVencimiento + "</span>"); 
        
        tarea.attr('estado', estado);

        if (estado === 'completa') {
            tarea.addClass('completed');
        }

        listaTareas.append(tarea);
        tarea.append(editar);
        tarea.append(eliminar);
        tarea.append(completa);
        tarea.append(fechaVenc); 
    }

    // Función para agregar una nueva tarea
    $('#addTaskButton').click(function(){
        var newTask = $('#newTaskInput').val();
        var dueDate = $('#dueDateInput').val();
        if(newTask.trim() !== '' && dueDate !== ''){
            addTaskToList(newTask, 'incompleta', dueDate); // Pasa la fecha de vencimiento a la función addTaskToList

            var tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            tasks.push({ text: newTask, estado: 'incompleta', dueDate: dueDate }); 
            localStorage.setItem('tasks', JSON.stringify(tasks));

            $('#newTaskInput').val('');
            $('#dueDateInput').val(''); 
        } else {
            alert('Por favor, ingresa el nombre de la tarea y la fecha de vencimiento.');
        }
    });

    // Función para marcar una tarea como completada
    $('#taskList').on('click', '.completeButton', function(){
        var $task = $(this).parent();
        $task.toggleClass('completed');
        
        // Cambiar el estado de la tarea
        if ($task.hasClass('completed')) {
            $task.attr('estado', 'completa');
        } else {
            $task.attr('estado', 'incompleta');
        }

        // Actualizar el estado en localStorage
        var tasks = JSON.parse(localStorage.getItem('tasks'));
        var taskText = $task.find('p').text() 
        var taskIndex = tasks.findIndex(task => task.text.trim() === taskText);
        
        // Verificar si la tarea existe en el array tasks
        if (taskIndex !== -1) {
            tasks[taskIndex].estado = $task.attr('estado');
            localStorage.setItem('tasks', JSON.stringify(tasks));

            // Verificar fechas de vencimiento después de marcar como completada
            checkDueDates();
        }
    });

    // Función para eliminar una tarea
    $('#taskList').on('click', '.deleteButton', function(){
        var $task = $(this).parent();

        // Eliminar la tarea del localStorage
        var tasks = JSON.parse(localStorage.getItem('tasks'));
        var taskText = $task.find('p').text();
        var newTasks = tasks.filter(task => task.text !== taskText);
        localStorage.setItem('tasks', JSON.stringify(newTasks));

        $task.remove(); // Eliminar el padre del botón, que es el elemento <li> que contiene la tarea
    });

    // Función para editar una tarea cuando se hace clic en el botón "Editar"
    $('#taskList').on('click', '.editButton', function(){
        var $taskText = $(this).siblings('p');
        var $editableInput = $('<input class="edit" type="text">').val($taskText.text());
        $taskText.replaceWith($editableInput);
        $editableInput.focus();

        $editableInput.blur(function(){
            var newText = $(this).val();
            $(this).replaceWith('<p>' + newText + '</p>');

            // Actualizar el texto de la tarea en localStorage
            var tasks = JSON.parse(localStorage.getItem('tasks'));
            var oldText = $taskText.text();
            var taskIndex = tasks.findIndex(task => task.text === oldText);
            tasks[taskIndex].text = newText;
            localStorage.setItem('tasks', JSON.stringify(tasks));
        });
    });


    // Función para filtrar tareas completadas
    $('#filterCompleted').click(function(){
        $('.tarea[estado="completa"]').show();
        $('.tarea[estado="incompleta"]').hide();
    });

    // Función para filtrar tareas no completadas
    $('#filterIncomplete').click(function(){
        $('.tarea[estado="incompleta"]').show();
        $('.tarea[estado="completa"]').hide();
    });

    // Función para mostrar todas las tareas
    $('#filterAll').click(function(){
        $('.tarea').show();
    });

    // Función para verificar las fechas de vencimiento y mostrar una alerta cuando una tarea está próxima a vencerse
    function checkDueDates() {
        var tasks = JSON.parse(localStorage.getItem('tasks'));
        tasks.forEach(function(task) {
            var dueDate = new Date(task.dueDate);
            var today = new Date();
            var timeDifference = dueDate.getTime() - today.getTime();
            var daysDifference = timeDifference / (1000 * 3600 * 24);
            if (daysDifference < 1) {
                alert('La tarea "' + task.text + '" está próxima a vencerse.');
            }
        });
    }

    // Llama a la función checkDueDates al cargar la página
    checkDueDates();

    // Cargar tareas al cargar la página
    loadTasks();
});