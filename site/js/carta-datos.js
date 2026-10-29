/* Alcalà — datos de la carta para la maqueta.
   Platos y precios sacados de las cartas en PDF de cafeteriaalcala.es (septiembre de 2026).
   Los ALÉRGENOS son de ejemplo: los tiene que validar cocina antes de publicar.
   Cuando exista el panel, este fichero lo generará el servidor desde la base de datos. */
window.ALERGENOS = [
  { id:'gluten',     n:'Gluten' },        { id:'crustaceos', n:'Crustáceos' },  { id:'huevos',  n:'Huevos' },
  { id:'pescado',    n:'Pescado' },       { id:'cacahuetes', n:'Cacahuetes' },  { id:'soja',    n:'Soja' },
  { id:'lacteos',    n:'Lácteos' },       { id:'cascara',    n:'Frutos de cáscara' }, { id:'apio', n:'Apio' },
  { id:'mostaza',    n:'Mostaza' },       { id:'sesamo',     n:'Sésamo' },      { id:'sulfitos', n:'Sulfitos' },
  { id:'altramuces', n:'Altramuces' },    { id:'moluscos',   n:'Moluscos' }
];
window.ETIQUETAS = { nuevo:'Nuevo', reco:'Recomendado', vegano:'Vegano', singluten:'Sin gluten', picante:'Picante' };
window.CARTA = [
  { id:'desayunos', n:'Desayunos', foto:'desayunos', d:'Hasta las 12:00. Tostadas, bowls, huevos y el almuerzo valenciano con cacahuetes y aceitunas.', platos:[
    { n:'Almuerzo valenciano', p:'9,00', p2:'10,00', e2:'3 variantes', d:'Bocadillo con 2 variantes, 1 bebida y café. Con cacahuetes y aceitunas.', a:['gluten','cacahuetes'], t:['reco'] },
    { n:'Tostada rústica', p:'4,90', d:'Pan de pueblo con tomate valenciano, jamón serrano ibérico, albahaca y aceite virgen extra.', a:['gluten'] },
    { n:'Huevos Benedict', p:'7,70', d:'Huevos pochados con jamón serrano bañados en salsa holandesa sobre pan tierno.', a:['gluten','huevos','lacteos'], t:['reco'] },
    { n:'Huevos Benedict al estilo noruego', p:'7,85', d:'Con salmón ahumado y salsa holandesa.', a:['gluten','huevos','lacteos','pescado'] },
    { n:'English Breakfast', p:'9,50', d:'Huevos fritos o revueltos con bacon ahumado, judías, champiñones, tomate a la plancha, longaniza y pan tostado.', a:['gluten','huevos'] },
    { n:'Aguacate toast', p:'6,90', d:'Pan de cereales con aguacate, huevo revuelto, queso y tomate seco.', a:['gluten','huevos','lacteos','sesamo'] },
    { n:'Tostada Merrick', p:'5,90', d:'Recomendación desde Kentucky: pan de semillas, aguacate, huevo revuelto y bacon horneado con paprika.', a:['gluten','huevos','sesamo'], t:['nuevo'] },
    { n:'Bowl Alcalá', p:'8,00', d:'Yogur griego con fruta de temporada y muesli.', a:['lacteos','gluten','cascara'] },
    { n:'Açaí Bowl', p:'8,50', d:'Açaí, arándanos, coco, fresas, plátano, granola y salsa de pistacho.', a:['gluten','cascara'], t:['nuevo','vegano'] },
    { n:'Bol de frutas de temporada', p:'7,90', d:'Variedad de frutas cortadas al momento.', a:[], t:['vegano','singluten'] },
    { n:'Tortitas con miel y nata', p:'5,90', d:'Tortitas americanas de tres pisos con nata y miel.', a:['gluten','huevos','lacteos'] },
    { n:'Desayuno vegano', p:'7,20', d:'Café y tostada de pan de cereales con lechuga, tomate, aguacate y tofu.', a:['gluten','soja'], t:['vegano'] },
    { n:'Desayuno sin gluten salado', p:'6,70', d:'Café y fajita de maíz con aguacate, huevos revueltos, queso y tomate seco.', a:['huevos','lacteos'], t:['singluten'] },
    { n:'Croissant relleno', p:'4,90', d:'Croissant caliente de jamón York y queso.', a:['gluten','lacteos','huevos'] }
  ]},
  { id:'cafes', n:'Cafés', foto:'cafes', d:'Cafés de barista, especialidades de la casa, frappés, tés e infusiones.', platos:[
    { n:'Café solo', p:'1,45', a:[] }, { n:'Café con leche', p:'2,15', a:['lacteos'] }, { n:'Capuchino', p:'2,25', d:'Con crema de leche o con nata.', a:['lacteos'] },
    { n:'Café Alcalalito', p:'3,05', d:'Café con nuestro toque de chocolate, leche condensada y nata.', a:['lacteos'], t:['reco'] },
    { n:'Café Alcalalote', p:'4,05', d:'Como el Alcalalito, con licor.', a:['lacteos','sulfitos'] },
    { n:'Café señorial', p:'3,35', d:'Con licor de arroz Señorial de Cullera, servido con nata.', a:['lacteos'], t:['reco'] },
    { n:'Café Borja', p:'2,75', d:'Con un toque de Baileys y whisky.', a:['lacteos'] },
    { n:'Café irlandés', p:'5,80', d:'Con whisky y azúcar de caña quemado, servido con nata.', a:['lacteos'] },
    { n:'Expresso Gelato', p:'3,05', d:'Café con helado de vainilla.', a:['lacteos'] },
    { n:'Bombón tentación', p:'2,25', d:'Café con dulce de leche y nata montada.', a:['lacteos'] },
    { n:'Frappés y smoothies', p:'4,75', d:'Strawberry Split, Pash\'n Shoot, Caramel Coffee o Dolze Inizio. Con agua o leche entera, soja, sin lactosa, arroz o almendra.', a:['lacteos','soja','cascara'] },
    { n:'Latte moments', p:'2,50', d:'Chai, matcha, cúrcuma o remolacha latte.', a:['lacteos'] },
    { n:'Tés helados', p:'2,50', d:'Té negro con melocotón o con frutos del bosque.', a:[], t:['vegano'] },
    { n:'Infusiones', p:'2,45', d:'Chai Masala, Gunpowder, Pu Erh, Pai Mu Tan, Noches tropicales, Piña colada, Limón y jengibre, Manzana y canela, Frutas del Caribe, Manzanilla, Menta, Rooibos floral.', a:[], t:['vegano'] }
  ]},
  { id:'bocadillos', n:'Bocadillos', foto:'bocadillos', d:'Calientes y fríos, en pan recién hecho.', platos:[
    { n:'Chivito', p:'7,00', d:'Lomo, queso, cebolla frita y bacon. Caliente.', a:['gluten','lacteos'], t:['reco'] },
    { n:'Calamares', p:'6,75', d:'Caliente.', a:['gluten','moluscos'] },
    { n:'Jamón de bellota ibérico', p:'6,50', d:'Frío.', a:['gluten'] },
    { n:'Lomo', p:'6,00', d:'Caliente.', a:['gluten'] },
    { n:'Pechuga de pollo', p:'6,00', d:'Caliente.', a:['gluten'] },
    { n:'Atún especial', p:'6,00', d:'Atún, anchoas, aceitunas y tomate. Frío.', a:['gluten','pescado'] },
    { n:'Longanizas (3)', p:'5,65', d:'Caliente.', a:['gluten'] },
    { n:'Tortilla a elegir', p:'5,50', d:'Caliente.', a:['gluten','huevos'] },
    { n:'Queso manchego', p:'5,50', d:'Frío.', a:['gluten','lacteos'] },
    { n:'Sobrasada', p:'5,50', d:'Frío.', a:['gluten'] },
    { n:'Tortilla francesa', p:'4,85', d:'Caliente.', a:['gluten','huevos'] }
  ]},
  { id:'sandwiches', n:'Sándwiches', foto:'sandwiches', d:'Del mixto de siempre al Alcalá de tres pisos.', platos:[
    { n:'Sándwich Alcalá', p:'13,40', d:'Tres pisos de pechuga de pollo con bacon crujiente, lechuga, tomate y huevo. Incluye ración de patatas.', a:['gluten','huevos','lacteos'], t:['reco'] },
    { n:'Primavera', p:'12,80', d:'Frío. Jamón York, queso, lechuga, tomate, pollo y salsa César. Incluye patatas.', a:['gluten','huevos','lacteos','pescado'] },
    { n:'Pollo', p:'8,00', d:'Lechuga, tomate, pollo, queso y huevo duro. Incluye patatas.', a:['gluten','huevos','lacteos'] },
    { n:'Vegetal', p:'8,00', d:'Lechuga, tomate, atún, mahonesa, huevo duro y espárrago. Incluye patatas.', a:['gluten','huevos','pescado'] },
    { n:'Mixto con huevo frito', p:'6,00', a:['gluten','huevos','lacteos'] },
    { n:'Jamón serrano y queso', p:'5,20', a:['gluten','lacteos'] },
    { n:'Mixto', p:'4,80', d:'Jamón York y queso.', a:['gluten','lacteos'] }
  ]},
  { id:'hamburguesas', n:'Hamburguesas y tacos', foto:'hamburguesas', d:'Todas con guarnición de patatas fritas. Con huevo o queso de cabra, +1 €. Pan sin gluten, +1,20 €.', platos:[
    { n:'Burger de buey', p:'14,85', d:'Buey de 250 g con tomate, ensalada, bacon y queso.', a:['gluten','lacteos','sesamo'], t:['reco'] },
    { n:'Beyond Burger', p:'13,80', d:'La hamburguesa que parece carne pero no lo es. Hecha de plantas.', a:['gluten','soja','sesamo'], t:['vegano'] },
    { n:'Taco Alcalá', p:'14,00', d:'Solomillo de pollo rebozado, lechuga, tomate, cheddar, cebolla, pimiento, salsa agria y sweet chili.', a:['gluten','lacteos','huevos'], t:['picante'] },
    { n:'Taco Pulled Pork', p:'13,50', d:'Carne desmigada de cerdo, lechuga, tomate, aguacate, cilantro, salsa agria, queso fresco y pepinillos.', a:['gluten','lacteos'] },
    { n:'Burger Pulled Pork', p:'13,50', d:'Carne desmigada de cerdo con tomate, ensalada, bacon y queso.', a:['gluten','lacteos','sesamo'] },
    { n:'Burger de vacuno y cerdo', p:'12,50', d:'140 g con tomate, ensalada, bacon y queso.', a:['gluten','lacteos','sesamo'] },
    { n:'Burger de pollo', p:'12,35', d:'Pollo de 180 g con tomate, ensalada, bacon y queso.', a:['gluten','lacteos','sesamo'] }
  ]},
  { id:'ensaladas', n:'Ensaladas y entrantes', foto:'ensaladas', d:'Para empezar o para compartir.', platos:[
    { n:'Plato de jamón', p:'16,00', d:'100 g de jamón de bellota ibérico, 50 % raza ibérica.', a:[], t:['singluten'] },
    { n:'Ensalada César', p:'13,00', d:'Tomate cherry, parmesano, picatostes y pechuga rebozada. Con queso de cabra, +1 €.', a:['gluten','lacteos','huevos','pescado'], t:['reco'] },
    { n:'Ensalada especial', p:'12,45', d:'Lechuga, tomate, atún, huevo duro, pimiento asado y espárragos.', a:['pescado','huevos'], t:['singluten'] },
    { n:'Ensalada de temporada', p:'12,45', d:'Con hortalizas de temporada.', a:[], t:['vegano','singluten'] },
    { n:'Ensalada griega', p:'12,00', d:'Tomate, aceitunas negras, pimiento, cebolla y queso fresco sobre mezcla de lechugas, con vinagreta griega.', a:['lacteos'] },
    { n:'Plato de surtido ibéricos', p:'12,00', d:'Salchichón, chorizo y lomo 100 % bellota.', a:[] },
    { n:'Plato de cecina de León', p:'10,50', d:'Cecina Suprema Premium.', a:[] },
    { n:'Plato de queso', p:'9,50', d:'Medalla de oro en los World Cheese Awards 2023.', a:['lacteos'] },
    { n:'Ensaladilla rusa', p:'9,50', a:['huevos','pescado'] },
    { n:'Cesta de panes variados', p:'3,50', d:'Con tomate y aceite.', a:['gluten'] }
  ]},
  { id:'patatas', n:'Especialidades con patatas', foto:'patatas', d:'Para picar entre varios.', platos:[
    { n:'Huevos rotos', p:'10,50', d:'Con jamón, chorizo y patatas.', a:['huevos'], t:['reco'] },
    { n:'Patatas Alcalá', p:'10,50', d:'Patatas fritas con beicon y queso fundido.', a:['lacteos'] },
    { n:'Torreta de patatas', p:'9,60', d:'Torre de patatas caseras, semipicante.', a:[], t:['picante'] },
    { n:'Patatas dipear', p:'9,50', d:'Con variedad de salsas.', a:['huevos','lacteos'] },
    { n:'Láminas de boniato', p:'7,95', a:[], t:['vegano'] },
    { n:'Patatas bravas', p:'6,95', a:['huevos'] },
    { n:'Cesta de patatas', p:'5,80', a:[] }
  ]},
  { id:'pastas', n:'Pastas', foto:'pastas', d:'Suplemento de queso, +1 €.', platos:[
    { n:'Moussaka', p:'9,40', d:'Lasaña griega de berenjenas con ternera, cerdo y ave, cebolla y tomate.', a:['gluten','lacteos','huevos'], t:['reco'] },
    { n:'Spaghetti boloñesa', p:'9,00', a:['gluten'] },
    { n:'Lasaña boloñesa', p:'8,80', a:['gluten','lacteos','huevos'] },
    { n:'Spaghetti carbonara', p:'8,70', a:['gluten','lacteos','huevos'] }
  ]},
  { id:'carnes', n:'Carnes', foto:'carnes', d:'Con patata hervida, fritas o arroz. Suplementos: patatas fritas 1,25 €, verduras 2,50 €, boniato 1,60 €.', platos:[
    { n:'Cordero', p:'19,20', d:'Con patata hervida.', a:[] },
    { n:'Costillas barbacoa', p:'18,40', p2:'14,80', e2:'media', d:'Ración completa con patata hervida.', a:['sulfitos'], t:['reco'] },
    { n:'Codillo', p:'16,30', d:'Con patatas fritas.', a:[] },
    { n:'Rabo de toro', p:'16,10', d:'Con arroz.', a:['sulfitos'] },
    { n:'Carrillera de cerdo', p:'15,40', d:'Con patata hervida.', a:['sulfitos'] },
    { n:'Brochetas de pollo', p:'13,30', d:'Con patata hervida.', a:[], t:['singluten'] },
    { n:'Secreto ibérico', p:'13,00', d:'Con salsa chimichurri.', a:[] },
    { n:'Pollo con curry y arroz', p:'12,50', a:['lacteos'] },
    { n:'Pechuga de pollo', p:'11,30', d:'Empanada, con pasta y patatas fritas.', a:['gluten','huevos'] },
    { n:'Nuggets', p:'10,00', d:'De solomillo de pollo, caseros.', a:['gluten','huevos'] },
    { n:'Croquetas', p:'8,00', d:'De setas y jamón serrano. 6 unidades.', a:['gluten','lacteos','huevos'] },
    { n:'Alitas de pollo', p:'7,80', d:'A la barbacoa.', a:[] }
  ]},
  { id:'pescados', n:'Pescados', foto:'pescados', d:'Del Mediterráneo a la plancha o a la romana.', platos:[
    { n:'Pulpo a la gallega', p:'21,00', a:['moluscos'], t:['reco','singluten'] },
    { n:'Bacalao con tomate', p:'15,40', d:'Con patata hervida.', a:['pescado'], t:['singluten'] },
    { n:'Emperador', p:'14,95', a:['pescado'], t:['singluten'] },
    { n:'Sepia', p:'13,75', a:['moluscos'] },
    { n:'Calamar entero', p:'13,00', a:['moluscos'] },
    { n:'Chipirones', p:'11,90', a:['moluscos','gluten'] },
    { n:'Calamares a la romana', p:'11,00', a:['moluscos','gluten','huevos'] },
    { n:'Tostada de ahumados', p:'7,50', a:['gluten','pescado'] }
  ]},
  { id:'postres', n:'Postres', foto:'postres', d:'Caseros, para terminar bien.', platos:[
    { n:'Bowl Alcalá', p:'7,10', d:'Yogur griego con frutas de temporada y muesli.', a:['lacteos','gluten','cascara'] },
    { n:'Tarta de queso', p:'5,50', d:'Con frutos rojos.', a:['lacteos','huevos','gluten'], t:['reco'] },
    { n:'Tatín', p:'5,30', d:'Tarta de manzana caliente con helado de vainilla.', a:['gluten','lacteos','huevos'] },
    { n:'Torrija casera', p:'5,30', d:'Con helado de leche merengada.', a:['gluten','lacteos','huevos'] },
    { n:'Tarta 3 chocolates', p:'5,30', a:['lacteos','huevos','gluten','soja'] },
    { n:'Tortitas con miel', p:'5,30', d:'Con chocolate o caramelo, +0,50 €.', a:['gluten','lacteos','huevos'] },
    { n:'Coulant de chocolate', p:'4,80', a:['gluten','lacteos','huevos'] },
    { n:'Helado de leche merengada', p:'4,90', a:['lacteos'] },
    { n:'Flan casero', p:'4,20', a:['huevos','lacteos'], t:['singluten'] }
  ]},
  { id:'infantil', n:'Menú infantil', foto:'infantil', d:'Hasta 12 años. Incluye agua, refresco o zumo.', platos:[
    { n:'Menú infantil', p:'11,40', d:'Primero a elegir: spaghetti boloñesa o hamburguesa con patatas. Postre: helado de vainilla con lacasitos.', a:['gluten','lacteos','huevos'] }
  ]},
  { id:'vegana', n:'Carta vegana', foto:'vegana', d:'Sin productos de origen animal. Gran parte también sin gluten.', platos:[
    { n:'Hamburguesa Penélope', p:'9,50', d:'Pan especial de semillas, tomate, cebolla, pepinillos y un toque de mostaza. Con patata asada.', a:['gluten','sesamo','mostaza'], t:['vegano','nuevo'] },
    { n:'Sándwich Pitágoras', p:'9,85', d:'Pan con semillas, tofu, brotes verdes, espinacas, tomate y aguacate.', a:['gluten','soja','sesamo'], t:['vegano'] },
    { n:'Salteado vegano de pollo', p:'10,50', d:'Con todo el sabor del pollo y verduras frescas, totalmente vegano.', a:['soja','gluten'], t:['vegano','nuevo'] },
    { n:'Season Green Salad', p:'11,95', d:'Hortalizas de temporada con vuna (atún vegano).', a:['soja'], t:['vegano'] },
    { n:'Peruvian Salad', p:'11,50', d:'Quinoa, pimiento, garbanzos, maíz dulce, nueces y pasas con vinagreta especial.', a:['cascara'], t:['vegano','singluten'] },
    { n:'Falafel', p:'7,85', d:'Albóndigas especiadas de garbanzos y remolacha.', a:['gluten','sesamo'], t:['vegano'] },
    { n:'Nuggets veganos', p:'7,25', d:'A partir de proteínas de soja y trigo.', a:['soja','gluten'], t:['vegano'] },
    { n:'Bocadillo de pollo vegano', p:'7,10', a:['gluten','soja'], t:['vegano','nuevo'] },
    { n:'Batido Natalie Portman', p:'7,30', d:'Green detox: manzana, pepino, apio, espinacas, jengibre y zumo de naranja.', a:['apio'], t:['vegano','singluten'] }
  ]},
  { id:'cocteles', n:'Cócteles', foto:'cocteles', d:'Para la tarde en la terraza.', platos:[
    { n:'Spritz', p:'5,00', d:'Nuestro aperitivo de la casa: Select aperitivo, soda y cava.', a:['sulfitos'], t:['reco'] },
    { n:'Mojito classic', p:'7,00', d:'Ron Plantation 3 Stars, lima, hierbabuena, azúcar líquido y refresco.', a:[] },
    { n:'Mojito Le Fruit', p:'7,50', d:'Elige tu sabor: fresa, mango, maracuyá o piña.', a:[] }
  ]},
  { id:'vinos', n:'Vinos', foto:'vinos', d:'Selección de la carta de vinos 2026, por copa y botella.', platos:[
    { n:'Vino de la casa', p:'2,50', p2:'12,00', e2:'botella', a:['sulfitos'] },
    { n:'Selección por copa', p:'3,50', d:'Pregunta por los vinos del mes.', a:['sulfitos'] }
  ]},
  { id:'cervezas', n:'Cervezas', foto:'cervezas', d:'De barril y de botella, nacionales e importación.', platos:[
    { n:'Caña', p:'1,90', a:['gluten'] },
    { n:'Doble', p:'2,60', a:['gluten'] },
    { n:'Cerveza sin gluten', p:'2,80', a:[], t:['singluten'] }
  ]}
];
