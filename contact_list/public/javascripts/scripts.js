$(function(){

	var ContactModel = Backbone.Model.extend({
		urlRoot: '/contacts'
	});

	var CategoryModel = Backbone.Model.extend({
		urlRoot: '/categories'
	});


	var ContactView = Backbone.View.extend({
		tagName:"li",
		template1: _.template( $('#template1').html() ),
		events: {
			"click a.name" : "seeInfo",
			"click span.edit" : "editInfo"
		},

		seeInfo: function() {
			
			var modal = new ModalView()
		},

		initialize: function(){
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
		},

		render:function(){
		   this.$el.html(this.template1( { contact: this.model.toJSON() } ) );
		}
	})

	var ContactListView = Backbone.View.extend({
		
		events: {
			
		},

		initialize: function(option){
			this.filter = option.filter

			this.listenTo(this.collection, "add", this.addOne);
			this.collection.fetch();
			// console.log(this.$el)

		},

		addOne:function(item){
		   if (item.attributes.category_id == this.filter) {

			   var contact = new ContactView({ model: item })
			   // console.log(contact)
			   // console.log(contact.el)
			   contact.render();
			   this.$el.append(contact.el)
			}
		}
	});

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

	// categories.fetch().done(function() {
	// 	_.each(categories.models, function(category) {

	// 		var contactList = new ContactListView({ collection: contacts, el: $('#' + category.attributes.name), filter: category.id})

	// 	})
	// })

	var friendList = new ContactListView({ collection: contacts, el: $('#friends'), filter: 1})
	var friendList = new ContactListView({ collection: contacts, el: $('#frenemies'), filter: 2})

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
			var categoryName = this.$el.find('input[name="contact-category"]').val();
			console.log(this.collection);

			categories.fetch().done(function() {
				console.log(categories.models[0].attributes.name)
				_.each(categories.models, function(category) {

					if (category.attributes.name == categoryName) {
						contacts.create({ name: name, age: age, address: address, phone_number: number, category_id: category.id})
					}
				})
			})
			
		}
	});

	var formView = new FormView({ el: $(".form"), collection: contacts });

	var ModalView = Backbone.View.extend({

		modalTemplate: _.template( $('#modal-template').html() ),

		initialize: function(){
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
		},

		render:function(){
		   this.$el.html(this.modalTemplate( { contact: this.model.toJSON() } ) );
		}
	});

})












