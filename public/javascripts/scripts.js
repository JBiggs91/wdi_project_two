$(function(){
// 
//	Models
// 
	var ContactModel = Backbone.Model.extend({
		urlRoot: '/contacts'
	});

	var CategoryModel = Backbone.Model.extend({
		urlRoot: '/categories'
	});

// 
//	Collections
// 
//
	
	var ContactCollection = Backbone.Collection.extend({
		url: '/contacts',
		model: ContactModel
	});

	var CategoryCollection = Backbone.Collection.extend({
		url: '/categories',
		model: CategoryModel
	});

	var contacts = new ContactCollection();
	var categories = new CategoryCollection();

// 
// Views
// 
	var ContactView = Backbone.View.extend({
		tagName:"li",
		template1: _.template( $('#template1').html() ),
		events: {
			"click a.name" : "seeInfo",
		},

		seeInfo: function() {
			var modal = new ModalView({model: this.model})
		},

		initialize: function(){
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
		},

		render:function(){
		   this.$el.html(this.template1( { contact: this.model.toJSON() } ) );
		}
	});

	var ContactListView = Backbone.View.extend({
		
		events: {
			
		},

		initialize: function(option){
			this.filter = option.filter

			this.listenTo(this.collection, 'add', this.addOne);
			this.collection.fetch();
		},

		addOne:function(item){
		   if (item.attributes.category_id == this.filter) {

			   var contact = new ContactView({ model: item })
			   contact.render();
			   this.$el.append(contact.el)
			}
		}
	});

	

	var friendList = new ContactListView({ collection: contacts, el: $('.friends'), filter: 1})
	var frenemyList = new ContactListView({ collection: contacts, el: $('.frenemies'), filter: 2})
	var otherList = new ContactListView({ collection: contacts, el: $('.other'), filter: 3})

	var FormView = Backbone.View.extend({
		events: {
			"click i#add-category" : "createCategory",
			"click i#add-contact" : "createContact"
		},

		createContact: function() {
			var name = this.$el.find('input[name="contact-name"]').val();
			var age = this.$el.find('input[name="contact-age"]').val();
			var address = this.$el.find('input[name="contact-address"]').val();
			var number = this.$el.find('input[name="contact-number"]').val();
			var picture = this.$el.find('input[name="contact-picture"]').val();
			var categoryName = this.$el.find('select[name="contact-category"]').val();

			categories.fetch().done(function() {
				_.each(categories.models, function(category) {

					if (name == "" || age == "" || address == "" || number == "") {
						_.each($('.input'), function(input) {
							if (input.value == "") {
								input.style.backgroundColor = "#C73E3A"
							} else {
								input.style.backgroundColor = "white"
							}
						});
					} else {

						if (category.attributes.name == categoryName) {
						contacts.create({ name: name, age: age, address: address, phone_number: number, picture: picture, category_id: category.id})
						$(".form").toggle("blind");
						_.each($('.input'), function(input) {
							input.value = ""
							input.style.backgroundColor = "white"
						});
						}
					}	
				})
			})
		}
	});

	var formView = new FormView({ el: $(".form"), collection: contacts });

	var ModalView = Backbone.View.extend({
		modalTemplate: _.template( $('#modal-template').html() ),
		events: {
			"click i.delete-button" : "delete",
			"click i.edit-button" : "edit",
			"click i.save-button" : "save",
			"click i.cancel-button" : "cancel"
		},

		delete: function() {
			this.model.destroy();
			$('#info').modal('toggle');
		},

		edit: function() {
			var currentName = this.model.attributes.name;
			var currentAge = this.model.attributes.age;
			var currentAddress = this.model.attributes.address;
			var currentNumber = this.model.attributes.phone_number;

			$('.modal-title').html('<input type="text" name="contact-name" value="' + currentName + '">&#39s Info')
			$('.age').html('<input type="text" name="contact-age" value="' + currentAge + '">');
			$('.address').html('<input type="text" name="contact-address" value="' + currentAddress + '">');
			$('.number').html('<input type="text" name="contact-number" value="' + currentNumber + '">');

			$('.modal-footer').html('<i class="fa fa-floppy-o fa-3x save-button"></i> <i class="fa fa-times-circle fa-3x cancel-button"></i>');

		},

		save: function() {
			var name = this.$el.find('input[name="contact-name"]').val();
			var age = this.$el.find('input[name="contact-age"]').val();
			var address = this.$el.find('input[name="contact-address"]').val();
			var number = this.$el.find('input[name="contact-number"]').val();

			this.model.set('name', name);
			this.model.set('age', age);
			this.model.set('address', address);
			this.model.set('phone_number', number);
			this.model.save();
			$('#info').modal('toggle');
		},

		cancel: function() {
			$('#info').modal('toggle');
		},

		initialize: function(){
			this.render();
		},

		render: function(){
			var myTemplate = this.modalTemplate( { contact: this.model.toJSON() } );
		   	this.$el.html(myTemplate);
		   	$('.modal-content').empty();
		   	$('.modal-content').append(this.$el);

		}
	});

 	$('.friends, .frenemies, .other').sortable({connectWith: '.list'}).disableSelection();
 	$('.list').on( "sortupdate", function( event, ui ) {
 		var contactId = ui.item.children()[0].id;
 		var contact = contacts.get(contactId);
 		console.log(contact)
 		console.log(event.target.id)
		contact.set('category_id', Number(event.target.id));
		contact.save();
 	});


	$(".down").click(function() {
	  $(".form").toggle("blind");
	});
// 
//	Random Users
// 
	function Capitalize(string) {
    	return string.charAt(0).toUpperCase() + string.slice(1);
	};

	$('.rand-name').on('click', function() {
		$.ajax({
		  url: 'http://api.randomuser.me/',
		  dataType: 'json',
		  success: function(data){
		  	var name = Capitalize(data.results[0].user.name.first);
		  	$('input[name="contact-name"]').val(name);
		  }
		});
	});

	$('.rand-age').on('click', function() {
		$.ajax({
		  url: 'http://api.randomuser.me/',
		  dataType: 'json',
		  success: function(data){
		  	var age = Math.random().toString().split('.')[1].slice(1, 3);
		  	$('input[name="contact-age"]').val(age);
		  }
		});
	});

	$('.rand-address').on('click', function() {
		$.ajax({
		  url: 'http://api.randomuser.me/',
		  dataType: 'json',
		  success: function(data){
		  	var address = data.results[0].user.location.street;
		  	$('input[name="contact-address"]').val(address);
		  }
		});
	});

	$('.rand-number').on('click', function() {
		$.ajax({
		  url: 'http://api.randomuser.me/',
		  dataType: 'json',
		  success: function(data){
		  	var number = data.results[0].user.cell;
		  	$('input[name="contact-number"]').val(number);
		  }
		});
	});

	$('.rand-picture').on('click', function() {
		$.ajax({
		  url: 'http://api.randomuser.me/',
		  dataType: 'json',
		  success: function(data){
		  	var picture = data.results[0].user.picture.thumbnail;
		  	$('input[name="contact-picture"]').val(picture);
		  }
		});
	})
// 
//	Search Bar
// 
	nameArray = []
	function autoComplete(searchBar) {
		contacts.fetch().done(function() {
			_.each(contacts.models, function(model) {
				nameArray.push(model.attributes.name)
			});
			searchBar.autocomplete({source: nameArray});
		})
		
	};
	autoComplete($('.search'));

	$('.search').on('keyup', function(e) {
		if (e.keyCode == 13) {
			$('.search-items').empty();
			_.each(contacts.models, function(model) {
				
				if ($('.search').val() == model.attributes.name) {
					var contact = new ContactView({ model:  model});
					contact.render();
					
					$('.search-items').append(contact.el);
				}
			})
		}

		if ($('.search').val() == "") {
		$('.search-items').empty();
		}

	})
// 
//	Google maps
// 
	function initializeMap() {
		
		var map = new google.maps.Map(document.getElementById('map-canvas'));
		var bounds = new google.maps.LatLngBounds();
		var locationArray = []
		var geocoder = new google.maps.Geocoder();
		contacts.fetch().done(function() {

			_.each(contacts.models, function(model) {
				var latitude;
				var longitude;
				var location;
				
				var address = model.attributes.address;
				
				
				geocoder.geocode({'address': address}, function(results, status) {
					
					if (status == google.maps.GeocoderStatus.OK) {
						latitude = results[0].geometry.location.k;
						longitude = results[0].geometry.location.B;
						location = new google.maps.LatLng(latitude, longitude);
						console.log(location)
						bounds.extend(location)

						var marker = new google.maps.Marker({
				      		position: location,
				      		map: map,
				      		title: model.attributes.name
				  		});
					}

					google.maps.event.addListener(marker, 'click', function() {
						new ModalView({model: model})
						$('#info').modal('show')
					});
					
				});

				
			})
			setTimeout(function() {
				google.maps.event.trigger(map, "resize");
				map.fitBounds(bounds);
			}, 300);

		})
	}
	// initializeMap();
	
	$(".map-button").click(function() {

	  $("#map-toggle").toggle("pulsate");
	  $(".article-lists").toggle("pulsate");
	  initializeMap();
	});
})








