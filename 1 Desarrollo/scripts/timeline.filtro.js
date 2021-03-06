var Filtros = {
	// Instancia del div contenedor del panel de filtros
	$contenedor: null, 
	// Instancia del div contenedor de la vista previa de los filtros
	$filtros: null,
	
	// Html que representa la vista previa de un filtro
	plantilla_filtro: '<div class="filtro"> \
							<p><b>Titulo: </b>{titulo}</p> \
							<p><b>Categorias: </b>{categorias}</p> \
							<p><b>Paises: </b>{paises}</p> \
							<button type="button">x</button> \
						</div>',
						
	init: function () {
		Filtros.$contenedor = $('#filtros-panel');
		Filtros.$filtros = $('#timeline-filtros');
		
		// Recupera las categorias de un archivo y las carga en el combo
		// FIXME: este m�todo est� fallando en Google Chrome
		$.getJSON('datos/paises.json', function (paises) {
			$('#filtroPaises').cargarCombo(paises, 'id', 'nombre');
		});

		
		// Recupera las paises de un archivo y los carga en el combo
		$.getJSON('datos/categorias.json', function (categorias) {
			$('#filtroCategorias').cargarCombo(categorias, 'id', 'nombre');
		});
		
		// Agrega funcionalidad al bot�n que abre/cierra el panel de filtros
	
		//ACTUALIZACION Cambie el orden de las funciones porque al parecer lo que generaba el bug era que bajaba el filtro sin mostrarlo, cuando hacias el primer click, cuando hacias el segundo te levantaba el filtro y cuando hacias el tercer click recien lo bajaba. Cuando se cambia el orden y se valida que entre en este metodo apenas cargue la pagina con la validacion que se hace mas abajo se arregla porque ahora sube el filtro que todavia no se muestra en la primera pasada y al primer click se baja el filtro que ya esta cargado.
		$('#filtros a:last').toggle(
			function () {
				Filtros.$contenedor.slideDown();					
			},
			function () {						
				Filtros.$contenedor.slideUp();	
			}
		);
		
		// Asigno los handlers a los eventos click de los botones Generar y Agregar
		$('#btnAgregarFiltro').click(Filtros.agregarFiltro);		
		$('#btnGenerarLineas').click(Filtros.generarLineas);
		
	}, 
	
	// A�ade un nuevo filtro a la vista previa dentro del panel de filtros
	agregarFiltro: function () {
		var datos = {
			titulo: $('#filtroTitulo').val(),
			categorias: $('#filtroCategorias').val(),
			paises: $('#filtroPaises').val()
		};
		
		// Recupera el texto a mostrar de las categorias seleccionadas
		var categorias_texto = [];
		$("#filtroCategorias option:selected").each(function () { categorias_texto.push($(this).text()); });
		
		// Recupera el texto a mostrar de los paises seleccionados
		var paises_texto = [];
		$("#filtroPaises option:selected").each(function () { paises_texto.push($(this).text()); });
		
		// Agrega un nuevo elemento al div contenedor de la vista previa de los filtros
		Filtros.$filtros.append(Filtros.plantilla_filtro
			.replace('{titulo}', datos.titulo || '-')
			.replace('{categorias}', categorias_texto.join(', ') || '-')
			.replace('{paises}', paises_texto.join(', ') || '-'));
		
		// Guarda en el data del nuevo objeto insertado el detalle de los filtros seleccionados
		Filtros.$filtros.children('div.filtro:last').data('filtro', datos);
		
		// Agrega el evento click al bot�n cerrar del elemento nuevo 
		Filtros.$filtros.find('.filtro:last button').click(function () {
			$(this).parent('div').slideUp().remove();
		});
		
		$('#filtroTitulo, #filtroCategorias, #filtroPaises').val('');
	},
	
	// Crea las lineas correspondientes a los filtros seleccionados
	generarLineas: function () {
		var filtros = [];
		
		// Recupera en un vector todos los filtros ingresados
		//ACUTALIZACION	 Se agrega una validacion ya que cuando carga la pagina pasa por aqui y la variable $filtros todavia no existe.
		if(Filtros.$filtros != null){		
		Filtros.$filtros.children('div.filtro').each(function () {
			filtros.push($(this).data('filtro'));
		});}
		
		// Si no se seleccion� ning�n filtro, no se contin�a con la funci�n
		if(filtros.length === 0) {
			return;
		}
		
		Linea.borrarLineas();
		
		// Por cada uno de los filtros seleccionados se crea una nueva l�nea
		$.each(filtros, function (ind, val) {
			Linea.crearLinea(val);
		});
		
		Linea.mostrarLineas();
	}
};
